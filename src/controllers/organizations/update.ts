import { z } from "zod";
import { checkPermission } from "~/helpers";
import { Organization } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const UpdateOrganizationRequestSchema = z.object({
  name: z.string().max(100),
});

const UpdateOrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof UpdateOrganizationRequestSchema>,
  z.infer<typeof UpdateOrganizationResponseSchema>
> = async (request, reply) => {
  if (!(await checkPermission(request, "organization.update"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  // store new org in DB
  const org = await Organization.create(
    {
      name: request.body.name,
      created_by: request.userId,
    },
    { returning: true }
  );

  return reply.code(201).send(org);
};

/**
 * Define route
 */
export const createOrganizationPresetController: Controller = {
  handler: handler,
  schema: {
    body: UpdateOrganizationRequestSchema,
    response: {
      200: UpdateOrganizationResponseSchema,
    },
  },
};
