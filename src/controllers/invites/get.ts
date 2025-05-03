import { initializeApp } from "firebase-admin";
import { Auth } from "firebase-admin/auth";
import { z } from "zod";
import { OrganizationInvite, OrganizationUser } from "~/models";
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
  // get id
  const params: { id?: string } = request.params as object;
  if (!params.id) {
    return reply.code(404);
  }

  // gte the invite
  const invite = await OrganizationInvite.findOne({
    where: {
      id: params.id,
    },
  });
  if (!invite) {
    return reply.code(404).send();
  }

  // validate users email address
  const firebaseApp = initializeApp();
  const firebaseAuth = new Auth();
  const user = await firebaseAuth.getUser(request.userId!);
  // TODO: setup requires_approval instead
  if (user.email !== invite.email) {
    console.warn(`Email mismatch for invite: ${invite.id}`);
    return reply.code(404).send();
  }

  // check user isn't already enrolled
  const existing = await OrganizationUser.count({
    where: {
      organization_id: invite.organization_id,
      user_id: request.userId!,
    },
  });
  if (existing > 0) {
    console.warn(`User already enrolled for invite: ${invite.id}`);
    await invite.destroy();
    return reply.code(200).send();
  }

  // add user to org
  console.info(
    `Adding user '${request.userId}' to org '${invite.organization_id}' via invite '${invite.id}'`
  );
  await OrganizationUser.create({
    organization_id: invite.organization_id,
    user_id: request.userId!,
    role_id: invite.role_id,
  });
  await invite.destroy();

  // TODO: return the new role?
  return reply.code(204).send();
};

/**
 * Define route
 */
export const listUsersController: Controller = {
  handler: handler,
  schema: {
    body: ListInvitesRequestSchema,
    response: {
      204: ListInvitesResponseSchema,
    },
  },
};
