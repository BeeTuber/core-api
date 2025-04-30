import { FastifyRequest } from "fastify";
import { OrganizationUser, Permission, Role } from "../models";
import { app } from "../server";

export const checkPermission = async (
  request: FastifyRequest,
  permission: string
): Promise<boolean> => {
  const { organizationId, userId, authTokenHash } = request;

  const { redis } = app;
  if (!redis) {
    console.error("Redis client inaccessible");
    process.exit(1);
  }

  // check to see if already cached
  const redisKey = `permissions:${organizationId}:${userId}${
    !!authTokenHash ? ":" + authTokenHash : ""
  }`;
  let cached = await redis.get(redisKey);

  // get perms from DB
  if (cached === null) {
    const orgUser = await OrganizationUser.findOne({
      where: { user_id: userId, organization_id: organizationId },
      include: [Role, Permission],
    });

    const perms = orgUser?.role?.permissions?.map((perm) => perm.id) ?? [];
    cached = await redis.set(redisKey, JSON.stringify(perms), {
      EX: authTokenHash ? 86400 : 600, // cache for 10m without hash, 24h with
      GET: true,
    });
  }
  if (cached === null) {
    throw new Error("failed to get permissions");
  }

  // process permissions
  const permissions: string[] = JSON.parse(cached);
  return permissions.includes(permission);
};
