import { z } from "zod";
import { StreamCategory, StreamPreset } from "../../models";
import { Controller, Handler } from "../../types";

/**
 * Define schemas
 */
const CreateStreamPresetRequestSchema = z.object({
  name: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  category_id: z.string().optional(),
});

const CreateStreamPresetResponseSchema = z.object({
  id: z.string(),
});

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof CreateStreamPresetRequestSchema>,
  z.infer<typeof CreateStreamPresetResponseSchema>
> = async (request, reply) => {
  const category = await StreamCategory.findOne({
    where: { id: request.body.category_id },
  });
  if (category === null) {
    reply.code(400);
    return reply.send({ message: "Invalid category ID" });
  }

  const { id } = await StreamPreset.create(request.body);

  reply.code(201);
  return reply.send({ id });
};

/**
 * Define route
 */
export const deleteStreamPresetController: Controller = {
  handler: handler,
  schema: {
    body: CreateStreamPresetRequestSchema,
    response: {
      201: CreateStreamPresetResponseSchema,
    },
  },
};
