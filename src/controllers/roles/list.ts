import { z } from "zod";
import { checkPermission } from "~/helpers";
import { Role } from "~/models";
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

  // get existing role
  const roles = await Role.findAll({
    where: {
      organization_id: request.organizationId,
    },
  });

  return reply.code(200).send(roles);
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
