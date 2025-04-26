import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Connection } from "./connection";
import { StreamPreset } from "./streamPreset";

@Table({
  tableName: "stream_preset_connections",
  timestamps: true,
  underscored: true,
})
export class StreamPresetConnection extends Model {
  @ForeignKey(() => StreamPreset)
  @Column
  stream_preset_id!: number;

  @ForeignKey(() => Connection)
  @Column
  connection_id!: number;
}
