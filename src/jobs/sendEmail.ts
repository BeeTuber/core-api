import { Liquid } from "liquidjs";
import mjml from "mjml";
import { readFile } from "node:fs/promises";
import { join as pathJoin } from "node:path";

export enum EmailTemplates {
  InviteUser = "invite-user",
}

export type SendEmailJob = {
  templateName: EmailTemplates;
  data: Record<string, string>;
};

export const sendEmailJobName = "send-email";

export const sendEmailJob = async (job: SendEmailJob) => {
  const { templateName, data } = job;

  // load template
  let rawTemplate: string;
  try {
    rawTemplate = await readFile(
      pathJoin(__dirname, "../emailTemplates", `${templateName}.mjml`),
      "utf-8"
    );
  } catch (err) {
    console.error(`Failed to load email template: ${templateName}`);
  }

  // render template variables
  const globalContext = { currentYear: new Date().getFullYear() };
  const liquid = new Liquid();
  const template = await liquid.parseAndRender(rawTemplate!, {
    ...globalContext,
    ...data,
  });

  // render template to html
  const html = mjml(template);

  // TODO: send email
};
