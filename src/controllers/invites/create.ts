import { DateTime } from "luxon";
import { z } from "zod";
import { websiteBaseUrl } from "../../config";
import { queueSendEmail } from "../../helpers";
import { checkPermission } from "../../helpers/auth";
import { EmailTemplates } from "../../jobs/sendEmail";
import { OrganizationInvite } from "../../models";
import { Controller, Handler } from "../../types";

/**
 * Define schemas
 */
const CreateInviteRequestSchema = z.object({
  email: z.string().email(),
  expiryDays: z.number().int().min(1).max(30),
});

const CreateInviteResponseSchema = z.undefined();

/**
 * Handler
 */
const handler: Handler<
  z.infer<typeof CreateInviteRequestSchema>,
  z.infer<typeof CreateInviteResponseSchema>
> = async (request, reply) => {
  if (!(await checkPermission(request, "users.invite"))) {
    return reply.code(403).send({ error: "Permission denied" });
  }

  // create invite in DB
  const expires = DateTime.now().plus({ days: request.body.expiryDays });
  const invite = await OrganizationInvite.create(
    {
      organization_id: request.organizationId,
      email: request.body.email,
      expires_at: expires,
    },
    { returning: true }
  );

  // send invite email
  const url = `${websiteBaseUrl}/invite/${invite.id}`;
  await queueSendEmail(EmailTemplates.InviteUser, { url, expires: expires.toRelative() });

  return reply.code(204).send();
};

/**
 * Define route
 */
export const listUsersController: Controller = {
  handler: handler,
  schema: {
    body: CreateInviteRequestSchema,
    response: {
      204: CreateInviteResponseSchema,
    },
  },
};
