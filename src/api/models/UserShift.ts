/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  HasOne,
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

  @HasOne(() => ConfirmLevel, {
    foreignKey: { name: 'confirm_level_id', allowNull: false, defaultValue: 0 },
  })
  confirm_level: ConfirmLevel;
  @HasOne(() => User, 'assigned_exec') assigned_exec: User;
}
