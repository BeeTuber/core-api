import { Op } from "sequelize";
import { z } from "zod";
import { checkPermission } from "~/helpers";
import { Permission, Role, RolePermission } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const CreateRoleRequestSchema = z.object({
  name: z.string().min(1).max(255),
  permission_ids: z.array(z.string()),
});

const CreateRoleResponseSchema = z.object({
  id: z.string(),
});

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof CreateRoleRequestSchema>,
  z.infer<typeof CreateRoleResponseSchema>
> = async (request, reply) => {
  if (!(await checkPermission(request, "roles.write"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  // load permissions
  const permissions = await Permission.findAll({
    where: {
      id: {
        [Op.in]: request.body.permission_ids,
      },
    },
  });
  if (permissions.length !== request.body.permission_ids.length) {
    return reply.code(400).send({ message: "Invalid permission IDs" });
  }

  // insert role into DB
  const role = await Role.create(
    {
      organization_id: request.organizationId,
      name: request.body.name,
    },
    { returning: true }
  );

  // assign permissions
  await RolePermission.bulkCreate(
    permissions.map((perm) => ({
      role_id: role.id,
      permission_id: perm.id,
    }))
  );

  reply.code(201);
  return reply.send({ id: role.id });
};

/**
 * Define route
 */
export const createRoleController: Controller = {
  handler: handler,
  schema: {
    body: CreateRoleRequestSchema,
    response: {
      201: CreateRoleResponseSchema,
    },
  },
};
