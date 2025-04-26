import { Worker } from "bullmq";
import { registerSchedule, scheduleJobs } from "./jobs/schedule";


const startWorker = new Worker("data-sync", async (job: { name: any }) => {

  const scheduleJobsNames = Object.keys(scheduleJobs)
  if (scheduleJobsNames.includes(job.name)) {
    await scheduleJobs[job.name]();
    return;
  }

  switch (job.name) {
    default:
      throw new Error(`unknown job type: ${job.name}`);
  }
});

// CLI entry point
(async () => {
  await registerSchedule();
  startWorker();
})();