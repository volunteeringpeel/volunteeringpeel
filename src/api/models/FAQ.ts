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

@Table({ modelName: 'faq' })
export class FAQ extends Model<FAQ> {
  @PrimaryKey @Column faq_id: number;
  @AllowNull(false) @Default(100) @Column priority: number;
  @AllowNull(false) @Column(DataType.TEXT) question: string;
  @AllowNull(false) @Column(DataType.TEXT) answer: string;
}
