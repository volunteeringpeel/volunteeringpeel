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
  @PrimaryKey @Column confirm_level_id: number;
  @AllowNull(false) @Unique @Column name: string;
  @Column(DataType.TEXT) description: string;
}
