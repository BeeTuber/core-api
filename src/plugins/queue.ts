import { FastifyInstance, FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { RedisClientOptions } from "redis";
import { initQueues, Queues } from "../worker";

/**
 * Shim plugin type
 */
declare module "fastify" {
  interface FastifyInstance {
    queues: Queues;
  }
}

/**
 * Options
 */
type QueuePluginOptions = RedisClientOptions;
const defaultOpts: Partial<QueuePluginOptions> = {};

/**
 * Plugin
 */
const fastifyQueues: FastifyPluginCallback<QueuePluginOptions> = async (
  fastifyInstance: FastifyInstance,
  options: QueuePluginOptions
) => {
  const opts = { ...defaultOpts, ...options };

  // Assign the Sequelize instance to Fastify instance
  fastifyInstance.decorate("queues", initQueues());

  // Clean up on server close
  fastifyInstance.addHook("onClose", async () => {
    try {
      await Promise.all(
        Object.values(fastifyInstance.queues).map((queue) => queue.close())
      );
      fastifyInstance.log.info("Queue connections closed.");
    } catch (error) {
      fastifyInstance.log.error("Error closing Queue connections:", error);
    }
  });
};

/**
 * Register Plugin
 */
export default fastifyPlugin(fastifyQueues, {
  name: "fastify-queues",
  fastify: ">= 5.2",
});
