import { SequelizeOptions } from "sequelize-typescript";
import { Connection } from "./connection";
import { Organization } from "./organization";
import { OrganizationInvite } from "./organizationInvite";
import { OrganizationUser } from "./organizationUser";
import { Permission } from "./permission";
import { Role } from "./role";
import { RolePermission } from "./rolePermission";
import { StreamCategory } from "./streamCategory";
import { StreamPreset } from "./streamPreset";
import { StreamPresetConnection } from "./streamPresetConnection";

/**
 * clean exports
 */
export * from "./connection";
export * from "./organization";
export * from "./organizationInvite";
export * from "./organizationUser";
export * from "./permission";
export * from "./role";
export * from "./rolePermission";
export * from "./streamCategory";
export * from "./streamPreset";
export * from "./streamPresetConnection";

/**
 * all models
 */
export const models: SequelizeOptions["models"] = [
  Connection,
  Organization,
  OrganizationUser,
  OrganizationInvite,
  Permission,
  Role,
  RolePermission,
  StreamCategory,
  StreamPreset,
  StreamPresetConnection,
];
