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
  @PrimaryKey @Column event_id: number;
  @AllowNull(false) @Column name: string;
  @AllowNull(false) @Column address: string;
  @Default(null) @Column transport: string;
  @AllowNull(false) @Column(DataType.TEXT) description: string;
  @AllowNull(false) @Default(false) @Column active: boolean;
  @AllowNull(false) @Default(false) @Column add_info: boolean;
  @Column letter: string;
}
