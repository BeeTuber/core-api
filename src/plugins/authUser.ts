import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";

/**
 * Shim plugin type
 */
declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    authTokenHash?: string;
    organizationId?: string;
  }

  interface FastifyContextConfig {
    noAuth?: boolean;
    bypassOrganizationCheck?: boolean;
  }
}

/**
 * Plugin
 */
type AuthUserPluginOptions = {};
const organizationCheckMiddleware: FastifyPluginCallback<
  AuthUserPluginOptions
> = (fastifyInstance: FastifyInstance, opts: AuthUserPluginOptions, done) => {
  /**
   * User Data
   */
  fastifyInstance.addHook("onRequest", async (request, reply: FastifyReply) => {
    const { noAuth } = request.routeOptions.config;

    const authHeader = request.headers["authorization"] as string | undefined;

    if (!authHeader && !noAuth) {
      const msg = "Authentication Required.";
      return reply.code(401).send({ error: msg });
    }

    try {
      const token = authHeader!.replace(/^Bearer /i, "");
      const [, rawPayload, tokenHash] = token.split(".");
      const { iat, exp, sub } = JSON.parse(
        Buffer.from(rawPayload, "base64").toString("utf-8")
      );

      if (!sub) {
        return reply.code(401).send({ error: "Invalid auth token" });
      }

      fastifyInstance.decorateRequest("userId", sub);
      fastifyInstance.decorateRequest("authTokenHash", tokenHash);
    } catch (err) {
      console.error("JWT parsing failed", err);
      return reply.code(401).send({ error: "Invalid auth token" });
    }
  });

  /**
   * Org ID
   */
  fastifyInstance.addHook("onRequest", async (request, reply: FastifyReply) => {
    const { bypassOrganizationCheck } = request.routeOptions.config;

    const organizationId = request.headers["x-organization-id"] as
      | string
      | undefined;
    fastifyInstance.decorateRequest("organizationId", organizationId);

    if (!organizationId && !bypassOrganizationCheck) {
      const msg =
        "Missing organization identifier. Provide x-organization-id header.";
      reply.code(400).send({ error: msg });
      return;
    }
  });

  done();
};

/**
 * Register Plugin
 */
export default fastifyPlugin(organizationCheckMiddleware, {
  name: "fastify-auth-user",
  fastify: ">= 5.2",
});
