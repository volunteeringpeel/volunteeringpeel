/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Event } from '@api/models/Event';
import { User } from '@api/models/User';
import { UserShift } from '@api/models/UserShift';

@Table({ modelName: 'shift' })
export class Shift extends Model<Shift> {
  @PrimaryKey @Column shift_id: number;
  @BelongsTo(() => Event, 'event_id') event: Event;

  @AllowNull(false) @Column shift_num: number;
  @AllowNull(false) @Column(DataType.DATE) start_time: string;
  @AllowNull(false) @Column(DataType.DATE) end_time: string;
  @AllowNull(false) @Column max_spots: number;
  @Column(DataType.ENUM('breakfast', 'lunch', 'dinner', 'snack')) meals: string;
  @AllowNull(false) @Column(DataType.TEXT) notes: string;

  @BelongsToMany(() => User, () => UserShift)
  users: User[];
}
