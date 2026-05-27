import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transactions = sequelize.define('Transactions', {
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transfer_customer_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }
}, {
  tableName: 'transactions',
  timestamps: false,
});

export default Transactions;
