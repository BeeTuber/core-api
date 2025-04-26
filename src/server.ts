import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifySensible from "@fastify/sensible";
import fastify, { FastifyError } from "fastify";
import { ZodError } from "zod";
import config from "./config";
import { models } from "./models";
import { authUser, fastifySequelize, organizationCheck } from "./plugins";
import { registerRoutes } from "./router";
import { ErrorResponseBody } from "./types";

const start = () => {
  // init app
  const app = fastify({
    logger: config.isProd
      ? true
      : {
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        },
  });

  // custom error response
  app.setErrorHandler(function (
    err: FastifyError & { issues: ZodError["issues"] },
    request,
    reply
  ) {
    this.log.error(err);
    const body: ErrorResponseBody = {
      code: err.statusCode ?? 10000,
      message: err.message ?? "Unexpected Error",
      ...(err.issues && { errors: err.issues }),
    };
    reply.status(err.statusCode ?? 500).send(body);
  });

  // plugins
  app.register(fastifySensible);
  app.register(fastifyHelmet);
  app.register(fastifyCors);
  app.register(organizationCheck);
  app.register(authUser);
  app.register(fastifySequelize, { ...config.db, models });

  // serve
  registerRoutes(app);
  app.listen(config.web, (err, addr) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    app.log.info(`Listening on ${addr}`);
  });
};

start();
