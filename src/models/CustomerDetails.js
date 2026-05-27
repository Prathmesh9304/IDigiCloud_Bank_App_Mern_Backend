import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CustomerDetails = sequelize.define('CustomerDetails', {
  customer_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: false },
  contact_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  email_address: { type: DataTypes.STRING, allowNull: false, unique: true },
  profile_img: { type: DataTypes.STRING, allowNull: true },
  accounts: {
    type: DataTypes.JSONB,
    allowNull: true,
  }
}, {
  tableName: 'customer_details',
  timestamps: false,
});

export default CustomerDetails;
