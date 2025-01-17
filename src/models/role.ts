import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  },
  {
    underscored: true,
  },
);