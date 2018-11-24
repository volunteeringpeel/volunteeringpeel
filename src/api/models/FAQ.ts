/* tslint:disable:no-console no-var-requires variable-name member-access */
import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class FAQ extends Model<FAQ> {
  @Column @PrimaryKey faq_id: number;
  @Column @AllowNull(false) @Default(100) priority: number;
  @Column(DataType.TEXT) @AllowNull(false) question: string;
  @Column(DataType.TEXT) @AllowNull(false) answer: string;
}
