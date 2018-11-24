/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { ConfirmLevel } from '@api/models/ConfirmLevel';
import { Shift } from '@api/models/Shift';
import { User } from '@api/models/User';

@Table
export class UserShift extends Model<UserShift> {
  @Column @PrimaryKey user_mail_list_id: number;
  @Column @ForeignKey(() => User) user_id: number;
  @Column @ForeignKey(() => Shift) shift_id: number;
  @Column(DataType.DATE) start_override: string;
  @Column(DataType.DATE) end_override: string;
  @Column(DataType.TIME) hours_override: string;
  @Column(DataType.TEXT) add_info: string;

  @Column
  @HasOne(() => ConfirmLevel, { foreignKey: { allowNull: false, defaultValue: 0 } })
  confirm_level: ConfirmLevel;
  @Column @HasOne(() => User, 'assigned_exec') assigned_exec: User;
}
