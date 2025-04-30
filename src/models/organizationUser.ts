import "reflect-metadata";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Organization } from "./organization";
import { Role } from "./role";

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

  @Column(DataType.UUIDV4)
  @ForeignKey(() => Role)
  role_id!: string;

  /**
   * relations
   */
  @BelongsTo(() => Organization)
  organization?: Organization;

  @HasOne(() => Role)
  role?: Role;
}
