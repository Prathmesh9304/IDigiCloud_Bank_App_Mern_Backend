import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TdAccountDetails = sequelize.define('TdAccountDetails', {
  td_account_number: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_class: { type: DataTypes.STRING, allowNull: true },
  deposit_type: { type: DataTypes.STRING, allowNull: true },
  deposit_amount: { type: DataTypes.FLOAT, allowNull: true },
  deposit_tenure: { type: DataTypes.STRING, allowNull: true },
  interest_payout: { type: DataTypes.STRING, allowNull: true },
  interest_type: { type: DataTypes.STRING, allowNull: true },
  maturity_instruction: { type: DataTypes.STRING, allowNull: true },
  has_nominee: { type: DataTypes.BOOLEAN, defaultValue: false },
  nominee_name: { type: DataTypes.STRING, allowNull: true },
  nominee_relationship: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'td_account_details',
  timestamps: false,
});

export default TdAccountDetails;
