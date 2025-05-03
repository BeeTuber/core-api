import { Op } from "sequelize";
import { z } from "zod";
import { StreamCategory } from "../../models";
import { Controller, Handler } from "../../types";

/**
 * Define schemas
 */
const SearchStreamCategoriesRequestSchema = z.undefined();

const SearchStreamCategoriesResponseSchema = z.array(z.object({}));

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof SearchStreamCategoriesRequestSchema>,
  z.infer<typeof SearchStreamCategoriesResponseSchema>
> = async (request, reply) => {
  const params: { s?: string } = request.params as object;
  const search = (params.s ?? "").replaceAll(/[%_]/, "");

  const categories = await StreamCategory.findAll({
    where: {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    },
    limit: 30,
  });

  reply.code(200);
  return reply.send(categories);
};

/**
 * Define route
 */
export const createStreamPresetController: Controller = {
  handler: handler,
  schema: {
    body: SearchStreamCategoriesRequestSchema,
    response: {
      200: SearchStreamCategoriesResponseSchema,
    },
  },
};
