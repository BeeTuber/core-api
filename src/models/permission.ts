import "reflect-metadata";
import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Role } from "./role";
import { RolePermission } from "./rolePermission";

/**
 * Primary table
 */
@Table({
  tableName: "permissions",
  timestamps: true,
  underscored: true,
})
export class Permission extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  /**
   * Relations
   */
  @BelongsToMany(() => Role, () => RolePermission)
  roles?: Role[];
}
