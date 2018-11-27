/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { MailList } from '@api/models/MailList';
import { Role } from '@api/models/Role';
import { Shift } from '@api/models/Shift';
import { UserMailList } from '@api/models/UserMailList';
import { UserShift } from '@api/models/UserShift';

@Table({ modelName: 'user' })
export class User extends Model<User> {
  @PrimaryKey @AutoIncrement @Column user_id: number;
  @AllowNull(false) @Column email: string;
  @AllowNull(false) @Default(DataType.NOW) @Column signup_time: Date;
  @BelongsTo(() => Role, 'role_id') role: Role;
  @AllowNull(false) @Column first_name: string;
  @AllowNull(false) @Column last_name: string;
  @AllowNull(false) @Column phone_1: string;
  @AllowNull(false) @Column phone_2: string;
  @AllowNull(false) @Column school: string;
  @AllowNull(false) @Column title: string;
  @AllowNull(false) @Column(DataType.TEXT) bio: string;
  @AllowNull(false) @Column pic: string;
  @AllowNull(false) @Default(true) @Column show_exec: boolean;

  @BelongsToMany(() => MailList, () => UserMailList)
  mail_lists: MailList[];
  @BelongsToMany(() => Shift, () => UserShift)
  userShifts: Shift[];
}
