import { Op } from "sequelize";
import { z } from "zod";
import { Organization, OrganizationUser, Role } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const ListOrganizationsRequestSchema = undefined;

const ListOrganizationsResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    role: z.object({
      id: z.string(),
      name: z.string(),
    }),
  })
);

/**
 * Handler
 */
const handler: Handler<
  any,
  z.infer<typeof ListOrganizationsResponseSchema>
> = async (request, reply) => {
  const organizationUsers = await OrganizationUser.findAll({
    where: { user_id: request.userId },
    include: [Role],
  });

  const organizations = await Organization.findAll({
    where: {
      id: {
        [Op.in]: organizationUsers.map((tu) => tu.organization_id),
      },
    },
  });

  reply.code(200);
  return reply.send(
    organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      role: organizationUsers.find((tu) => tu.id === organization.id)?.role,
    }))
  );
};

/**
 * Define route
 */
export const listOrganizationsController: Controller = {
  handler: handler,
  schema: {
    body: ListOrganizationsRequestSchema,
    response: {
      200: ListOrganizationsResponseSchema,
    },
  },
};
