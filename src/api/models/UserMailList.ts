/* tslint:disable:no-console no-var-requires variable-name member-access */
import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { MailList } from '@api/models/MailList';
import { User } from '@api/models/User';

@Table({ modelName: 'user_mail_list' })
export class UserMailList extends Model<UserMailList> {
  @PrimaryKey @Column user_mail_list_id: number;
  @ForeignKey(() => User) @Column user_id: number;
  @ForeignKey(() => MailList) @Column mail_list_id: number;
}
