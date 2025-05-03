import { z } from "zod";
import { checkPermission } from "~/helpers";
import { OrganizationInvite } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const ListInvitesRequestSchema = z.undefined();
const ListInvitesResponseSchema = z.undefined();

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof ListInvitesRequestSchema>,
  z.infer<typeof ListInvitesResponseSchema>
> = async (request, reply) => {
  if (!(await checkPermission(request, "users.read"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  const invites = await OrganizationInvite.findAll({
    where: {
      organization_id: request.organizationId,
    },
  });

  return reply.code(200).send(invites);
};

/**
 * Define route
 */
export const listUsersController: Controller = {
  handler: handler,
  schema: {
    body: ListInvitesRequestSchema,
    response: {
      200: ListInvitesResponseSchema,
    },
  },
};
