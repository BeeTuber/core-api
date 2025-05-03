import { z } from "zod";
import { checkPermission } from "~/helpers";
import { StreamPreset } from "~/models";
import { Controller, Handler } from "~/types";

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
  if (!(await checkPermission(request, "stream-presets.write"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  // get existing preset id
  const params: { id?: string } = request.params as object;
  if (!params.id) {
    return reply.code(404);
  }

  await StreamPreset.destroy({
    where: { id: params.id },
  });

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
