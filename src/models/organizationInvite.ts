import "reflect-metadata";
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Organization } from "./organization";
import { Role } from "./role";

@Table({
  tableName: "organization_invite",
  timestamps: true,
  underscored: true,
})
export class OrganizationInvite extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  organization_id!: string;

  @ForeignKey(() => Role)
  @Column(DataType.UUID)
  role_id!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.DATE)
  expires_at!: Date;

  /**
   * relations
   */
  @BelongsTo(() => Organization)
  organization?: Organization;
}
