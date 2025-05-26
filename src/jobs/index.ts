import { Queue } from "bullmq";
import { hoursToMillis } from "../helpers";
import {
  twitchCategoriesJob,
  twitchCategoriesJobName,
} from "./dataSync/twitchCategories";

/**
 * Queues
 */
export type Queues = {
  default: Queue;
};

export const initQueues = (): Queues => ({
  default: new Queue("default"),
});

/**
 * Schedule
 */
const addJob = async (queue: Queue, name: string, everyHours: number) => {
  await queue.upsertJobScheduler(name, {
    every: hoursToMillis(everyHours),
  });
};

export const scheduleJobs: Record<string, () => Promise<void>> = {
  [twitchCategoriesJobName]: twitchCategoriesJob,
};

export const registerSchedule = async (queues: Queues) => {
  await addJob(queues.default, twitchCategoriesJobName, 6);
};
