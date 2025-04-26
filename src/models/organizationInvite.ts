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
import { Roles } from "./organizationUser";

@Table({
  tableName: "organization_invites",
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

  /**
   * relations
   */
  @BelongsTo(() => Organization)
  organization!: Organization;
}
