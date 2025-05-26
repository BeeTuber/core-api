import { FastifyContextConfig, FastifyReply, FastifyRequest } from "fastify";
import { ZodSchema } from "zod";

export type ErrorResponseBody = {
  code: number;
  message: string;
  errors?: object[];
};

export class CustomError extends Error {
  code: number;
  errors?: object[];

  constructor(message: string, code: number, errors?: object[]) {
    super(message);
    this.code = code;
    this.errors = errors;
  }
}

export type Handler<RequestBody, ReplyBody = any> = (
  request: FastifyRequest<{
    Body: RequestBody;
  }>,
  reply: FastifyReply<{
    Body: ReplyBody | ErrorResponseBody;
  }>
) => Promise<ReplyBody | ErrorResponseBody>;

export type Controller = {
  handler: Handler<any>;
  schema: {
    querystring?: ZodSchema;
    params?: ZodSchema;
    body?: ZodSchema;
    response: Record<number, ZodSchema>;
  };
  config?: FastifyContextConfig;
};
