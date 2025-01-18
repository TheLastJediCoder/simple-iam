export interface RoleScopeMapping {
  id: number;
  scope_id: number;
  role_id: number;
}
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export const RoleScopes = sequelize.define(
  'RoleScopes',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    scopeId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    underscored: true,
  },
);
