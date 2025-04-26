import "reflect-metadata";
import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Connection } from "./connection";
import { OrganizationUser } from "./organizationUser";
import { StreamPreset } from "./streamPreset";

/**
 * Primary table
 */
@Table({
  tableName: "organizations",
  timestamps: true,
  underscored: true,
})
export class Organization extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.UUIDV4)
  created_by!: string;

  /**
   * Relations
   */
  @HasMany(() => OrganizationUser)
  users?: OrganizationUser[];

  @HasMany(() => StreamPreset)
  streamPresets?: StreamPreset[];

  @HasMany(() => Connection)
  connections?: Connection[];
}
