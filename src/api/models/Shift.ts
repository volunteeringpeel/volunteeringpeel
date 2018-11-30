/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import { Event } from '@api/models/Event';
import { User } from '@api/models/User';
import { UserShift } from '@api/models/UserShift';

@DefaultScope({
  attributes: {
    include: [
      // define hours column as difference between start and end
      [Sequelize.fn('TIMEDIFF', Sequelize.col('end_time'), Sequelize.col('start_time')), 'hours'],
    ],
  },
})
@Table({ modelName: 'shift' })
export class Shift extends Model<Shift> {
  @PrimaryKey @AutoIncrement @Column shift_id: number;
  @BelongsTo(() => Event, 'event_id') event: Event;

  @AllowNull(false) @Column shift_num: number;
  @AllowNull(false) @Column start_time: string;
  @AllowNull(false) @Column end_time: string;
  @AllowNull(false) @Column max_spots: number;
  @Column(DataType.ENUM('breakfast', 'lunch', 'dinner', 'snack')) meals: string;
  @AllowNull(false) @Column(DataType.TEXT) notes: string;

  @BelongsToMany(() => User, () => UserShift, 'shift_id', 'user_id')
  users: User[];
}
