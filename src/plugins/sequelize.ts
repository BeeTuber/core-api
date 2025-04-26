import { FastifyInstance, FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

/**
 * Shim plugin type
 */
declare module "fastify" {
  interface FastifyInstance {
    db: Sequelize;
  }
}

/**
 * Options
 */
type SequelizePluginOptions = SequelizeOptions;
const defaultOpts: Partial<SequelizePluginOptions> = {
  pool: {
    max: 20,
  },
};

/**
 * Plugin
 */
const fastifySequelize: FastifyPluginCallback<SequelizePluginOptions> = async (
  fastifyInstance: FastifyInstance,
  options: SequelizePluginOptions
) => {
  const opts = { ...defaultOpts, ...options };
  const db = new Sequelize(opts);

  // Assign the Sequelize instance to Fastify instance
  fastifyInstance.decorate("db", db);

  // Test database connection
  await db.authenticate();
  console.log("Database connected successfully.");

  // Clean up on server close
  fastifyInstance.addHook("onClose", async () => {
    try {
      await fastifyInstance.db.close();
      fastifyInstance.log.info("Database connection closed.");
    } catch (error) {
      fastifyInstance.log.error("Error closing database connection:", error);
    }
  });
};

/**
 * Register Plugin
 */
export default fastifyPlugin(fastifySequelize, {
  name: "fastify-sequelize",
  fastify: ">= 5.2",
});
