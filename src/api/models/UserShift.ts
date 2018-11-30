/* tslint:disable:no-console no-var-requires variable-name member-access */
import * as _ from 'lodash';
import {
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import * as Utilities from '@api/utilities';

import { ConfirmLevel } from '@api/models/ConfirmLevel';
import { Role } from '@api/models/Role';
import { Shift } from '@api/models/Shift';
import { User } from '@api/models/User';

@Table({ modelName: 'user_shift' })
export class UserShift extends Model<UserShift> {
  // pick a random exec to get assigned to this instance
  @BeforeCreate
  static async assignExec(instance: UserShift) {
    const execs = await User.findAll({
      attributes: ['user_id'],
      include: [{ model: Role, where: { role_id: Utilities.ROLE_EXECUTIVE } }],
    });
    const unlucky = _.sample(execs);
    instance.assigned_exec = unlucky.user_id;
    return instance;
  }

  // if the overrides = originals, set overrides to null
  @BeforeUpdate
  static async resetOverrides(instance: UserShift) {
    const shift = await Shift.findByPrimary(instance.shift_id, {
      attributes: ['start_time', 'end_time'],
    });
    if (instance.start_override === shift.start_time) instance.start_override = null;
    if (instance.end_override === shift.end_time) instance.end_override = null;
    return instance;
  }

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
