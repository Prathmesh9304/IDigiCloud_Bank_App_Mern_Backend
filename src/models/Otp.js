import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Otp = sequelize.define('Otp', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  identifier: {
    type: DataTypes.ENUM('phone', 'email'),
    allowNull: false,
  },
  otp_code: {
    type: DataTypes.STRING, // 6 digits
    allowNull: false,
  },
  attempt_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'otps',
  timestamps: false,
});

export default Otp;
