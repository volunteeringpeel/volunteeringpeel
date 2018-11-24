/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { MailList } from '@api/models/MailList';
import { Role } from '@api/models/Role';
import { UserMailList } from '@api/models/UserMailList';

@Table
export class User extends Model<User> {
  @Column @PrimaryKey user_id: number;
  @Column @AllowNull(false) email: string;
  @Column @CreatedAt signup_time: Date;
  @Column @HasOne(() => Role) role: Role;
  @Column @AllowNull(false) first_name: string;
  @Column @AllowNull(false) last_name: string;
  @Column @AllowNull(false) phone_1: string;
  @Column @AllowNull(false) phone_2: string;
  @Column @AllowNull(false) school: string;
  @Column @AllowNull(false) title: string;
  @Column(DataType.TEXT) @AllowNull(false) bio: string;
  @Column @AllowNull(false) pic: string;
  @Column @AllowNull(false) @Default(true) show_exec: boolean;

  @BelongsToMany(() => MailList, () => UserMailList)
  mail_lists: MailList[];
}
