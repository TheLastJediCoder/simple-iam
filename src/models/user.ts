import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { UserRoles } from './user-roles';
import Role from './role';

const User = sequelize.define(
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
    },
  },
  {
    underscored: true,
  },
);

User.belongsToMany(Role, { through: UserRoles });

export default User;
