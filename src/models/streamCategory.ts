import "reflect-metadata";
import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { StreamPreset } from "./streamPreset";

@Table({
  tableName: "stream_categories",
  timestamps: true,
  underscored: true,
})
export class StreamCategory extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING)
  name!: string;

  @AllowNull
  @Column(DataType.STRING)
  twitch_id?: string;

  @AllowNull
  @Column(DataType.STRING)
  igdb_id?: string;

  /**
   * Relations
   */
  @HasMany(() => StreamPreset)
  streamPresets?: StreamPreset[];
}
