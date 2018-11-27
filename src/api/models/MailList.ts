/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  AutoIncrement,
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

@Table({ modelName: 'mail_list' })
export class MailList extends Model<MailList> {
  @PrimaryKey @AutoIncrement @Column mail_list_id: number;
  @Unique @AllowNull(false) @Column display_name: string;
  @Column(DataType.TEXT) description: string;
  @AllowNull(false) @Default(false) @Column system: boolean;

  @BelongsToMany(() => User, () => UserMailList)
  users: User[];
}
