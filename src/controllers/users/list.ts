import { initializeApp } from "firebase-admin/app";
import { Auth, GetUsersResult } from "firebase-admin/auth";
import { chunk } from "lodash";
import { z } from "zod";
import { OrganizationUser, Role } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const ListUsersRequestSchema = undefined;

const ListUsersResponseSchema = z.array(
  z.object({
    id: z.string(),
    role: z.object({}),
    display_name: z.string(),
    photo_url: z.string().optional(),
  })
);

/**
 * Handler
 */
const handler: Handler<any, z.infer<typeof ListUsersResponseSchema>> = async (
  request,
  reply
) => {
  const firebaseApp = initializeApp();
  const firebaseAuth = new Auth();

  // find matching users for organization
  const users = await OrganizationUser.findAll({
    where: { organization_id: request.organizationId },
    include: [Role],
  });

  // get user info from firebase
  const userChunks = chunk(users, 100);
  let firebaseUsers: GetUsersResult["users"] = [];
  for (const userChunk of userChunks) {
    const result = await firebaseAuth.getUsers(
      userChunk.map((user) => ({ uid: user.user_id }))
    );
    firebaseUsers.push(...result.users);

    // log unknown users
    for (const notFoundUser of result.notFound) {
      reply.log.error(`User not found in Firebase: ${notFoundUser}`);
    }
  }

  // merge user info back together
  return users.map((user) => {
    const firebaseUser = firebaseUsers.find((fbu) => fbu.uid === user.user_id);
    return {
      id: user.user_id,
      role: user.role!,
      display_name: firebaseUser?.displayName ?? "UNKNOWN_USER",
      photo_url: firebaseUser?.photoURL,
    };
  });
};

/**
 * Define route
 */
export const listUsersController: Controller = {
  handler: handler,
  schema: {
    body: ListUsersRequestSchema,
    response: {
      200: ListUsersResponseSchema,
    },
  },
};
