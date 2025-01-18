import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export enum ScopeType {
  get,
  list,
  create,
  update,
  delete,
}

export const Scope = sequelize.define(
  'Scope',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.keys(ScopeType),
      allowNull: false,
    },
  },
  {
    underscored: true,
  },
);
