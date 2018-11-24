/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table
export class ConfirmLevel extends Model<ConfirmLevel> {
  @Column @PrimaryKey confirm_level_id: number;
  @Column @AllowNull(false) @Unique name: string;
  @Column(DataType.TEXT) description: string;
}
