import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LoanAccountDetails = sequelize.define('LoanAccountDetails', {
  loan_account_number: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_class: { type: DataTypes.STRING, allowNull: true },
  loan_type: { type: DataTypes.STRING, allowNull: true },
  loan_scheme: { type: DataTypes.STRING, allowNull: true },
  loan_amount: { type: DataTypes.FLOAT, allowNull: true },
  loan_tenure: { type: DataTypes.STRING, allowNull: true },
  interest_type: { type: DataTypes.STRING, allowNull: true },
  repayment_mode: { type: DataTypes.STRING, allowNull: true },
  repayment_frequency: { type: DataTypes.STRING, allowNull: true },
  has_coapplicant: { type: DataTypes.BOOLEAN, defaultValue: false },
  coapplicant_name: { type: DataTypes.STRING, allowNull: true },
  has_collateral: { type: DataTypes.BOOLEAN, defaultValue: false },
  collateral_type: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'loan_account_details',
  timestamps: false,
});

export default LoanAccountDetails;
