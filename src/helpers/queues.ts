import {
  EmailTemplates,
  SendEmailJob,
  sendEmailJobName,
} from "../jobs/sendEmail";
import { app } from "../server";

export const queueSendEmail = async (
  template: EmailTemplates,
  data?: Record<string, string>
) => {
  const { queues } = app;
  const job: SendEmailJob = {
    templateName: template,
    data: data ?? {},
  };
  await queues.default.add(sendEmailJobName, job, { priority: 100 });
};
