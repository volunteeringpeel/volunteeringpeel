/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({ modelName: 'confirm_level' })
export class ConfirmLevel extends Model<ConfirmLevel> {
  @PrimaryKey @AutoIncrement @Column confirm_level_id: number;
  @AllowNull(false) @Unique @Column name: string;
  @Column(DataType.TEXT) description: string;
}
