import "reflect-metadata";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Organization } from "./organization";
import { StreamPreset } from "./streamPreset";
import { StreamPresetConnection } from "./streamPresetConnection";

export enum ConnectionType {
  Twitch = "twitch",
}

@Table({
  tableName: "connections",
  timestamps: true,
  underscored: true,
})
export class Connection extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  type!: ConnectionType;

  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  organization_id!: string;

  /**
   * Relations
   */
  @BelongsTo(() => Organization)
  organization?: Organization;

  @BelongsToMany(() => StreamPreset, () => StreamPresetConnection)
  streamPresets?: StreamPreset[];
}
