import "reflect-metadata";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Organization } from "./organization";

export enum Roles {
  Owner = "owner",
  Admin = "admin",
  Editor = "editor",
  Moderator = "moderator",
}

@Table({
  tableName: "organization_users",
  timestamps: true,
  underscored: true,
})
export class OrganizationUser extends Model {
  @PrimaryKey
  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  organization_id!: string;

  @PrimaryKey
  @Column(DataType.STRING)
  user_id!: string;

  @Column(DataType.ENUM(...Object.values(Roles)))
  role!: Roles;

  @Column(DataType.BOOLEAN)
  is_default!: boolean;

  @Column(DataType.BOOLEAN)
  is_pending!: boolean;

  /**
   * relations
   */
  @BelongsTo(() => Organization)
  organization!: Organization;
}
