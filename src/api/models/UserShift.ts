/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { ConfirmLevel } from '@api/models/ConfirmLevel';
import { Shift } from '@api/models/Shift';
import { User } from '@api/models/User';

@Table({ modelName: 'user_shift' })
export class UserShift extends Model<UserShift> {
  @PrimaryKey @AutoIncrement @Column user_shift_id: number;
  @ForeignKey(() => User) @Column user_id: number;
  @ForeignKey(() => Shift) @Column shift_id: number;
  @Column(DataType.DATE) start_override: string;
  @Column(DataType.DATE) end_override: string;
  @Column(DataType.TIME) hours_override: string;
  @Column(DataType.TEXT) add_info: string;

  // don't use @HasOne because it breaks things since this is a join table
  @AllowNull(false) @Default(0) @ForeignKey(() => ConfirmLevel) @Column confirm_level_id: number;
  @ForeignKey(() => User) @Column assigned_exec: number;
}
