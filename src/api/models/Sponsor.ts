/* tslint:disable:no-console no-var-requires variable-name member-access */
import { AllowNull, Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Sponsor extends Model<Sponsor> {
  @Column @PrimaryKey sponsor_id: number;
  @Column @AllowNull(false) name: string;
  @Column image: string;
  @Column website: string;
  @Column @AllowNull(false) @Default(100) priority: number;
}
