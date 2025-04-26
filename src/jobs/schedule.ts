import { Queue } from "bullmq";
import { hoursToMillis } from "../helpers";
import {
  twitchCategoriesJob,
  twitchCategoriesJobName,
} from "./dataSync/twitchCategories";

const addJob = async (queue: Queue, name: string, everyHours: number) => {
  await queue.upsertJobScheduler(name, {
    every: hoursToMillis(everyHours),
  });
};

export const scheduleJobs: Record<string, () => Promise<void>> = {
  [twitchCategoriesJobName]: twitchCategoriesJob,
};

export const registerSchedule = async () => {
  const dataSyncQueue = new Queue("data-sync");

  await addJob(dataSyncQueue, twitchCategoriesJobName, 6);
};
