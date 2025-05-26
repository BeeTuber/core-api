import { Worker } from "bullmq";
import { registerSchedule, scheduleJobs } from "./jobs/";
import { sendEmailJob, sendEmailJobName } from "./jobs/sendEmail";

const startDefaultWorker = () =>
  new Worker("default", async (job: { name: string; data: any }) => {
    // schedule jobs
    const scheduleJobsNames = Object.keys(scheduleJobs);
    if (scheduleJobsNames.includes(job.name)) {
      await scheduleJobs[job.name]();
      return;
    }

    // normal jobs
    switch (job.name) {
      case sendEmailJobName:
        await sendEmailJob(job.data);
        break;
      default:
        throw new Error(`unknown job type: ${job.name}`);
    }
  });

// CLI entry point
(async () => {
  // queue schedules jobs
  const queues = initQueues();
  await registerSchedule(queues);

  // start workers
  const workers = [startDefaultWorker()];

  // graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, closing server...`);
    await Promise.all(workers.map((worker) => worker.close()));
    process.exit(0);
  };
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
})();
