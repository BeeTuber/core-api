import { FastifyInstance, FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import {
  createClient,
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";

/**
 * Shim plugin type
 */
declare module "fastify" {
  interface FastifyInstance {
    redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
  }
}

/**
 * Options
 */
type RedisPluginOptions = RedisClientOptions;
const defaultOpts: Partial<RedisPluginOptions> = {};

/**
 * Plugin
 */
const fastifyRedis: FastifyPluginCallback<RedisPluginOptions> = async (
  fastifyInstance: FastifyInstance,
  options: RedisPluginOptions
) => {
  const opts = { ...defaultOpts, ...options };
  const redis = createClient(opts);

  // Assign the Sequelize instance to Fastify instance
  fastifyInstance.decorate("redis", redis);

  // Test database connection
  await redis.connect();
  console.log("Redis connected successfully.");

  // Clean up on server close
  fastifyInstance.addHook("onClose", async () => {
    try {
      await fastifyInstance.redis.disconnect();
      fastifyInstance.log.info("Redis connection closed.");
    } catch (error) {
      fastifyInstance.log.error("Error closing Redis connection:", error);
    }
  });
};

/**
 * Register Plugin
 */
export default fastifyPlugin(fastifyRedis, {
  name: "fastify-redis",
  fastify: ">= 5.2",
});
