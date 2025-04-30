import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";
import fastifyPlugin from "fastify-plugin";

/**
 * Shim plugin type
 */
declare module "fastify" {
  interface FastifyRequest {
    organizationId?: string;
  }

  interface FastifyContextConfig {
    bypassOrganizationCheck?: boolean;
  }
}

/**
 * Plugin
 */
type OrganizationCheckPluginOptions = {};
const organizationCheckMiddleware: FastifyPluginCallback<
  OrganizationCheckPluginOptions
> = (
  fastifyInstance: FastifyInstance,
  opts: OrganizationCheckPluginOptions,
  done
) => {
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
  name: "fastify-organization-check",
  fastify: ">= 5.2",
});
