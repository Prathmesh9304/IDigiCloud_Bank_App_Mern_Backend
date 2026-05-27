import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RdAccountDetails = sequelize.define('RdAccountDetails', {
  rd_account_number: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_class: { type: DataTypes.STRING, allowNull: true },
  rd_installment_amount: { type: DataTypes.FLOAT, allowNull: true },
  rd_tenure: { type: DataTypes.STRING, allowNull: true },
  rd_start_date: { type: DataTypes.DATEONLY, allowNull: true },
  installment_date: { type: DataTypes.STRING, allowNull: true },
  payment_mode: { type: DataTypes.STRING, allowNull: true },
  maturity_instruction: { type: DataTypes.STRING, allowNull: true },
  has_nominee: { type: DataTypes.BOOLEAN, defaultValue: false },
  nominee_name: { type: DataTypes.STRING, allowNull: true },
  nominee_relationship: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'rd_account_details',
  timestamps: false,
});

export default RdAccountDetails;
