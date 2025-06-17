import { z } from "zod";
import { Organization, OrganizationUser } from "~/models";
import { Controller, Handler } from "~/types";

/**
 * Define schemas
 */
const CreateOrganizationRequestSchema = z.object({
  name: z.string().max(100),
});

const CreateOrganizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof CreateOrganizationRequestSchema>,
  z.infer<typeof CreateOrganizationResponseSchema>
> = async (request, reply) => {
  // check max number of created organizations
  const orgCount = await Organization.count({
    where: { created_by: request.userId },
  });
  if (orgCount > 3) {
    return reply.code(400).send({
      code: 10011,
      message: "Max 3 organizations per user",
    });
  }

  // store new org in DB
  const org = await Organization.create(
    {
      name: request.body.name,
      created_by: request.userId,
      updated_by: request.userId,
    },
    { returning: true }
  );

  // add user to the org as owner
  const ou = await OrganizationUser.create(
    {
      organization_id: org.id,
      user_id: request.userId,
      role_id: "bb588713-19ef-4604-94f5-0cec1bc77b7f",
      updated_by: request.userId,
    },
    { returning: true }
  );
  console.log(ou);

  return reply.code(201).send(org);
};

/**
 * Define route
 */
export const createOrganizationController: Controller = {
  handler: handler,
  schema: {
    body: CreateOrganizationRequestSchema,
    response: {
      200: CreateOrganizationResponseSchema,
    },
  },
  config: {
    bypassOrganizationCheck: true,
  },
};
