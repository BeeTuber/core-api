export * from "./queues";
export * from "./vault";

export const isProd = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const hoursToMillis = (hours: number): number => {
  return hours * 60 * 60 * 1000;
};
