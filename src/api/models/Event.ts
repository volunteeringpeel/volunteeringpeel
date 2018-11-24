/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class Event extends Model<Event> {
  @Column @PrimaryKey event_id: number;
  @Column @AllowNull(false) name: string;
  @Column @AllowNull(false) address: string;
  @Column @Default(null) transport: string;
  @Column(DataType.TEXT) @AllowNull(false) description: string;
  @Column @AllowNull(false) @Default(false) active: boolean;
  @Column @AllowNull(false) @Default(false) add_info: boolean;
  @Column letter: string;
}
