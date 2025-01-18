export interface UserRoleMapping {
  id: number;
  role_id: number;
  user_id: number;
}

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export const UserRoles = sequelize.define(
  'UserRoles',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
  },
  {
    underscored: true,
  },
);
