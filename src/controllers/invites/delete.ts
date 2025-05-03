import { z } from "zod";
import { checkPermission } from "~/helpers";
import { OrganizationInvite } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const DeleteInviteRequestSchema = z.undefined();
const CreateInviteResponseSchema = z.undefined();

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof DeleteInviteRequestSchema>,
  z.infer<typeof CreateInviteResponseSchema>
> = async (request, reply) => {
  if (!(await checkPermission(request, "users.invite"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  // get id
  const params: { id?: string } = request.params as object;
  if (!params.id) {
    return reply.code(404);
  }

  // delete invite
  await OrganizationInvite.destroy({
    where: {
      id: params.id,
    },
  });

  return reply.code(204).send();
};

/**
 * Define route
 */
export const listUsersController: Controller = {
  handler: handler,
  schema: {
    body: DeleteInviteRequestSchema,
    response: {
      204: CreateInviteResponseSchema,
    },
  },
};
