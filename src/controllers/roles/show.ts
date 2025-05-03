import { z } from "zod";
import { checkPermission } from "~/helpers";
import { Permission, Role } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const UpdateRoleRequestSchema = z.undefined();

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
  if (!(await checkPermission(request, "roles.read"))) {
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
    include: [Permission],
  });
  if (!role) {
    return reply.code(404).send({ message: "Role not found" });
  }

  return reply.code(200).send(role);
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
