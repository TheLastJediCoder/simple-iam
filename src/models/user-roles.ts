export interface UserRoleMapping {
    id: number;
    role_id: number;
    user_id: number;
  }

  import { DataTypes } from 'sequelize';
  import { sequelize } from '../config/database';
  
  export const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      underscored: true,
    },
  );

