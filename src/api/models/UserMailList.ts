/* tslint:disable:no-console no-var-requires variable-name member-access */
import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { MailList } from '@api/models/MailList';
import { User } from '@api/models/User';

@Table
export class UserMailList extends Model<UserMailList> {
  @Column @PrimaryKey user_mail_list_id: number;
  @Column @ForeignKey(() => User) user_id: number;
  @Column @ForeignKey(() => MailList) mail_list_id: number;
}
