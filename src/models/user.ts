import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Role } from './role';

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
    }
  },
  {
    underscored: true,
  },
);

User.belongsToMany(Role, { through: 'User_Roles' });

export default User;