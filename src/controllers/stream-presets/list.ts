import { omit } from "lodash";
import { z } from "zod";
import { checkPermission } from "~/helpers";
import { StreamCategory, StreamPreset } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const ListStreamPresetRequestSchema = undefined;

const ListStreamPresetResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    tags: z.array(z.string()),
    category: z
      .object({
        id: z.string(),
        name: z.string(),
        twitch_id: z.string().optional(),
        igdb_id: z.string().optional(),
      })
      .optional(),
  })
);

/**
 * Handler
 */
const handler: Handler<
  any,
  z.infer<typeof ListStreamPresetResponseSchema>
> = async (request, reply) => {
  if (!(await checkPermission(request, "stream-presets.read"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  const presets = await StreamPreset.findAll({
    where: {
      organization_id: request.organizationId,
    },
    include: [StreamCategory],
  });

  reply.code(200);
  return reply.send(
    presets.map((preset) =>
      omit(preset, ["organization", "organization_id", "category_id"])
    )
  );
};

/**
 * Define route
 */
export const listStreamPresetController: Controller = {
  handler: handler,
  schema: {
    body: ListStreamPresetRequestSchema,
    response: {
      200: ListStreamPresetResponseSchema,
    },
  },
};
