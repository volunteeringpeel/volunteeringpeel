/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import { User } from '@api/models/User';
import { UserMailList } from '@api/models/UserMailList';

@Table
export class MailList extends Model<MailList> {
  @Column @PrimaryKey mail_list_id: number;
  @Column @Unique @AllowNull(false) display_name: string;
  @Column(DataType.TEXT) description: string;
  @Column @AllowNull(false) @Default(false) system: boolean;

  @BelongsToMany(() => User, () => UserMailList)
  users: User[];
}
