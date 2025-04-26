import { SequelizeOptions } from "sequelize-typescript";
import { Organization } from "./organization";
import { OrganizationUser } from "./organizationUser";
import { StreamCategory } from "./streamCategory";
import { StreamPreset } from "./streamPreset";

/**
 * clean exports
 */
export * from "./organization";
export * from "./organizationUser";
export * from "./streamCategory";
export * from "./streamPreset";

/**
 * all models
 */
export const models: SequelizeOptions["models"] = [
  Organization,
  OrganizationUser,
  StreamCategory,
  StreamPreset,
];
