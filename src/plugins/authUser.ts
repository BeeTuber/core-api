import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";

/**
 * Shim plugin type
 */
declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }

  interface FastifyContextConfig {
    noAuth?: boolean;
  }
}

/**
 * Plugin
 */
type AuthUserPluginOptions = {};
const organizationCheckMiddleware: FastifyPluginCallback<
  AuthUserPluginOptions
> = (fastifyInstance: FastifyInstance, opts: AuthUserPluginOptions, done) => {
  fastifyInstance.addHook("onRequest", async (request, reply: FastifyReply) => {
    const { noAuth } = request.routeOptions.config;

    const authHeader = request.headers["authorization"] as string | undefined;

    if (!authHeader && !noAuth) {
      const msg = "Authentication Required.";
      return reply.code(401).send({ error: msg });
    }

    try {
      const token = authHeader!.replace(/^Bearer /i, "");
      const [, rawPayload] = token.split(".");
      const { iat, exp, sub } = JSON.parse(
        Buffer.from(rawPayload, "base64").toString("utf-8")
      );

      if (!sub) {
        return reply.code(401).send({ error: "Invalid auth token" });
      }

      fastifyInstance.decorateRequest("userId", sub);
    } catch (err) {
      console.error("JWT parsing failed", err);
      return reply.code(401).send({ error: "Invalid auth token" });
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
