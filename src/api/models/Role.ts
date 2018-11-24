/* tslint:disable:no-console no-var-requires variable-name member-access */
import { AllowNull, Column, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table
export class Role extends Model<Role> {
  @Column @PrimaryKey role_id: number;
  @Column @AllowNull(false) @Unique name: string;
}
