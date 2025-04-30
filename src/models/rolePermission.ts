import "reflect-metadata";
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Permission } from "./permission";
import { Role } from "./role";

/**
 * Primary table
 */
@Table({
  tableName: "role_permissions",
  timestamps: true,
  underscored: true,
})
export class RolePermission extends Model {
  @PrimaryKey
  @ForeignKey(() => Role)
  @Column(DataType.UUID)
  role_id!: string;

  @PrimaryKey
  @ForeignKey(() => Permission)
  @Column(DataType.STRING)
  permission_id!: string;
}
