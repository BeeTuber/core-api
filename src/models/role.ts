import "reflect-metadata";
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Organization } from "./organization";
import { OrganizationUser } from "./organizationUser";
import { Permission } from "./permission";
import { RolePermission } from "./rolePermission";

/**
 * Primary table
 */
@Table({
  tableName: "roles",
  timestamps: true,
  underscored: true,
})
export class Role extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull
  @ForeignKey(() => Organization)
  @Column(DataType.UUIDV4)
  organization_id?: string;

  @Column(DataType.BOOLEAN)
  is_global!: boolean;

  /**
   * Relations
   */
  @BelongsTo(() => Organization)
  organization?: Organization;

  @HasMany(() => OrganizationUser)
  organizationUsers?: OrganizationUser[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions?: Permission[];
}
