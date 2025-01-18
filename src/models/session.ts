export interface AccessToken {
  id: number;
  access_token: string;
  expires_at: Date;
  user_id: number;
}

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export const Session = sequelize.define(
  'Session',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    accessToken: {
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
