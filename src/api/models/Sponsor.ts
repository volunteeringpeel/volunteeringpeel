/* tslint:disable:no-console no-var-requires variable-name member-access */
import { AllowNull, Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Sponsor extends Model<Sponsor> {
  @PrimaryKey @Column sponsor_id: number;
  @AllowNull(false) @Column name: string;
  @Column image: string;
  @Column website: string;
  @AllowNull(false) @Default(100) @Column priority: number;
}
