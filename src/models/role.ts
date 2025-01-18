import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Scope } from './scope';
import { RoleScopes } from './role-scopes';

const Role = sequelize.define(
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
      unique: true,
    },
  },
  {
    underscored: true,
  },
);

Role.belongsToMany(Scope, { through: RoleScopes });

export default Role;
