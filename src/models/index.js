import CustomerDetails from './CustomerDetails.js';
import CasaAccountDetails from './CasaAccountDetails.js';
import LoanAccountDetails from './LoanAccountDetails.js';
import TdAccountDetails from './TdAccountDetails.js';
import RdAccountDetails from './RdAccountDetails.js';
import Transactions from './Transactions.js';
import Otp from './Otp.js';
import sequelize from '../config/database.js';

// Transactions explicitly have customer_id (foreign key from customerDetails)
CustomerDetails.hasMany(Transactions, { foreignKey: 'customer_id', as: 'transactions' });
Transactions.belongsTo(CustomerDetails, { foreignKey: 'customer_id', as: 'customerDetails' });

export {
  sequelize,
  CustomerDetails,
  CasaAccountDetails,
  LoanAccountDetails,
  TdAccountDetails,
  RdAccountDetails,
  Transactions,
  Otp
};
