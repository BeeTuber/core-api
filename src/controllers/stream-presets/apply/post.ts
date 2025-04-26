import { z } from "zod";
import { TwitchClient } from "../../../clients/twitch";
import { getSecret } from "../../../helpers";
import { StreamCategory, StreamPreset } from "../../../models";
import { Connection, ConnectionType } from "../../../models/connection";
import { Controller, Handler, TwitchSecret } from "../../../types";

/**
 * Define schemas
 */
const UpdateStreamPresetRequestSchema = z.undefined();

const UpdateStreamPresetResponseSchema = z.undefined();

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof UpdateStreamPresetRequestSchema>,
  z.infer<typeof UpdateStreamPresetResponseSchema>
> = async (request, reply) => {
  // get existing preset id
  const params: { id?: string } = request.params as object;
  if (!params.id) {
    return reply.code(404);
  }

  // get preset from DB
  const preset = await StreamPreset.findOne({
    where: { id: params.id },
    include: [StreamCategory, Connection],
  });
  if (preset === null) {
    return reply.code(404);
  }

  for (const connection of preset.connections!) {
    switch (connection.type) {
      // apply config to Twitch
      case ConnectionType.Twitch:
        const secret = await getSecret<TwitchSecret>(
          request.organizationId!,
          `connection/${connection.id}`
        );
        const twitchClient = new TwitchClient({ secret });
        await twitchClient.modifyChannelInformation({
          title: preset.title,
          tags: preset.tags,
          game_id: preset.category?.twitch_id ?? "0",
        });
        continue;
    }
  }

  reply.code(201);
};

/**
 * Define route
 */
export const updateStreamPresetController: Controller = {
  handler: handler,
  schema: {
    body: UpdateStreamPresetRequestSchema,
    response: {
      201: UpdateStreamPresetResponseSchema,
    },
  },
};
