import { Op } from "sequelize";
import { z } from "zod";
import { checkPermission } from "~/helpers";
import { Permission, Role, RolePermission } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const UpdateRoleRequestSchema = z.object({
  name: z.string().min(1).max(255),
  permission_ids: z.array(z.string()),
});

const UpdateRoleResponseSchema = z.object({
  id: z.string(),
});

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof UpdateRoleRequestSchema>,
  z.infer<typeof UpdateRoleResponseSchema>
> = async (request, reply) => {
  if (!(await checkPermission(request, "roles.write"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  // get existing preset id
  const params: { id?: string } = request.params as object;
  if (!params.id) {
    return reply.code(404);
  }

  // get existing role
  const role = await Role.findOne({
    where: {
      organization_id: request.organizationId,
      id: params.id,
    },
  });
  if (!role) {
    return reply.code(404).send({ message: "Role not found" });
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
  await role.update({
    name: request.body.name,
  });

  // assign permissions
  await RolePermission.bulkCreate(
    permissions.map((perm) => ({
      role_id: role.id,
      permission_id: perm.id,
    }))
  );

  // remove old perms
  await RolePermission.destroy({
    where: {
      role_id: role.id,
      permission_id: {
        [Op.notIn]: permissions.map((perm) => perm.id),
      },
    },
  });

  reply.code(200);
  return reply.send({ id: role.id });
};

/**
 * Define route
 */
export const updateRoleController: Controller = {
  handler: handler,
  schema: {
    body: UpdateRoleRequestSchema,
    response: {
      200: UpdateRoleResponseSchema,
    },
  },
};
