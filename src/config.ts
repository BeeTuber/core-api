import { S3ClientConfig } from "@aws-sdk/client-s3";
import "dotenv/config";
import { SequelizeOptions } from "sequelize-typescript";

/**
 * Helper for safely parsing an integer value
 */
const parseInt = (value?: string) => {
  const num = Number(value);
  if (!Number.isSafeInteger(num)) return undefined;
  return num;
};

/**
 * Database config
 */
export const db: SequelizeOptions = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) ?? 5432,
  database: process.env.DB_DATABASE ?? "beetuber",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

export const vault = {
  address: process.env.VAULT_ADDRESS!,
  mount: process.env.VAULT_MOUNT_ORGS ?? "organizations",
};

export const redis = {
  url: process.env.REDIS_URL,
};

/**
 * Storage config
 */
export const s3: { client: S3ClientConfig; buckets: Record<string, string> } = {
  client: {
    endpoint: process.env.S3_ENDPOINT,
    region:
      process.env.S3_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true, // required for minio
  },
  buckets: {
    assets: process.env.S3_BUCKET ?? "beetuber",
  },
};

/**
 * Web server config
 */
export const web = {
  host: process.env.WEB_HOST ?? "localhost",
  port: parseInt(process.env.WEB_PORT) ?? 1337,
};

/**
 * Misc.
 */
export const isProd = process.env.NODE_ENV === "production";
export const websiteBaseUrl = process.env.WEBSITE_BASE_URL || "https://beetuber.com"

/**
 * export as one object
 */
export default {
  db,
  s3,
  web,
  redis,
  vault,
  isProd,
};
