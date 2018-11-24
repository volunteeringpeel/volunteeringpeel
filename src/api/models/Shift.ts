/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Event } from '@api/models/Event';

@Table
export class Shift extends Model<Shift> {
  @Column @PrimaryKey shift_id: number;
  @Column @BelongsTo(() => Event) event: Event;

  @Column @AllowNull(false) shift_num: number;
  @Column(DataType.DATE) @AllowNull(false) start_time: string;
  @Column(DataType.DATE) @AllowNull(false) end_time: string;
  @Column @AllowNull(false) max_spots: number;
  @Column(DataType.ENUM('breakfast', 'lunch', 'dinner', 'snack')) meals: string;
  @Column(DataType.TEXT) @AllowNull(false) notes: string;
}
