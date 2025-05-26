import "reflect-metadata";
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Connection } from "./connection";
import { Organization } from "./organization";
import { StreamCategory } from "./streamCategory";
import { StreamPresetConnection } from "./streamPresetConnection";

@Table({
  tableName: "stream_presets",
  timestamps: true,
  underscored: true,
})
export class StreamPreset extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Organization)
  @Column(DataType.UUID)
  organization_id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags!: string[];

  @AllowNull
  @ForeignKey(() => StreamCategory)
  @Column(DataType.UUID)
  category_id?: string;

  @Column(DataType.BOOLEAN)
  set_twitch!: boolean;

  /**
   * Relations
   */
  @BelongsTo(() => Organization)
  organization?: Organization;

  @BelongsTo(() => StreamCategory)
  category?: StreamCategory;

  @BelongsToMany(() => Connection, () => StreamPresetConnection)
  connections?: Connection[];
}
