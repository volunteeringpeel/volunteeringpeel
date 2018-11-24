/* tslint:disable:no-console no-var-requires variable-name member-access */
import { AllowNull, Column, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table({ modelName: 'role' })
export class Role extends Model<Role> {
  @PrimaryKey @Column role_id: number;
  @AllowNull(false) @Unique @Column name: string;
}
