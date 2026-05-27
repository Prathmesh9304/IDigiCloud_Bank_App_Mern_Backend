import express from 'express';
import { sequelize, CustomerDetails, Transactions } from '../models/index.js';

const router = express.Router();

router.post('/transaction', async (req, res) => {
  // Support both request body and query parameters in case the frontend sends it via params
  const payload = { ...(req.query || {}), ...(req.body || {}) };
  const { customer_id, transaction_type, transaction_amount, currency, transfer_customer_id } = payload;

  // Basic Validations
  if (!customer_id || !transaction_type || !transaction_amount || !currency) {
    return res.status(400).json({
      success: false,
      message: 'customer_id, transaction_type, transaction_amount, and currency are required fields'
    });
  }

  const validTypes = ['Deposit', 'Withdraw', 'Transfer'];
  if (!validTypes.includes(transaction_type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid transaction_type. Must be one of: ${validTypes.join(', ')}`
    });
  }

  const amount = parseFloat(transaction_amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'transaction_amount must be a valid positive number'
    });
  }

  const t = await sequelize.transaction();

  try {
    let createdTransaction;

    if (transaction_type === 'Deposit') {
      const customer = await CustomerDetails.findByPk(customer_id, { transaction: t });
      if (!customer) {
        throw new Error(`Customer with ID ${customer_id} not found`);
      }

      if (!customer.accounts || !customer.accounts.casa) {
        throw new Error(`Customer with ID ${customer_id} does not have an active CASA account`);
      }

      // Add to balance
      const existingBalance = parseFloat(customer.accounts.casa.balance || 0);
      customer.accounts.casa.balance = parseFloat((existingBalance + amount).toFixed(2));
      customer.changed('accounts', true);
      await customer.save({ transaction: t });

      // Create transaction log
      createdTransaction = await Transactions.create({
        customer_id,
        transaction_type,
        transaction_amount: amount,
        currency,
        transfer_customer_id: null,
        transaction_date: new Date(),
        created_at: new Date()
      }, { transaction: t });

    } else if (transaction_type === 'Withdraw') {
      const customer = await CustomerDetails.findByPk(customer_id, { transaction: t });
      if (!customer) {
        throw new Error(`Customer with ID ${customer_id} not found`);
      }

      if (!customer.accounts || !customer.accounts.casa) {
        throw new Error(`Customer with ID ${customer_id} does not have an active CASA account`);
      }

      const existingBalance = parseFloat(customer.accounts.casa.balance || 0);
      if (existingBalance < amount) {
        throw new Error(`Insufficient balance. Current balance: ${existingBalance}`);
      }

      // Deduct from balance
      customer.accounts.casa.balance = parseFloat((existingBalance - amount).toFixed(2));
      customer.changed('accounts', true);
      await customer.save({ transaction: t });

      // Create transaction log
      createdTransaction = await Transactions.create({
        customer_id,
        transaction_type,
        transaction_amount: amount,
        currency,
        transfer_customer_id: null,
        transaction_date: new Date(),
        created_at: new Date()
      }, { transaction: t });

    } else if (transaction_type === 'Transfer') {
      if (!transfer_customer_id) {
        throw new Error('transfer_customer_id is required for a Transfer transaction');
      }

      if (customer_id === transfer_customer_id) {
        throw new Error('Source and destination customer IDs cannot be the same');
      }

      // Fetch sender and receiver
      const sender = await CustomerDetails.findByPk(customer_id, { transaction: t });
      const receiver = await CustomerDetails.findByPk(transfer_customer_id, { transaction: t });

      if (!sender) {
        throw new Error(`Sender customer with ID ${customer_id} not found`);
      }
      if (!receiver) {
        throw new Error(`Recipient customer with ID ${transfer_customer_id} not found`);
      }

      if (!sender.accounts || !sender.accounts.casa) {
        throw new Error(`Sender customer with ID ${customer_id} does not have an active CASA account`);
      }
      if (!receiver.accounts || !receiver.accounts.casa) {
        throw new Error(`Recipient customer with ID ${transfer_customer_id} does not have an active CASA account`);
      }

      const senderBalance = parseFloat(sender.accounts.casa.balance || 0);
      if (senderBalance < amount) {
        throw new Error(`Insufficient balance for transfer. Current balance: ${senderBalance}`);
      }

      // Perform transfer
      sender.accounts.casa.balance = parseFloat((senderBalance - amount).toFixed(2));
      sender.changed('accounts', true);
      await sender.save({ transaction: t });

      const receiverBalance = parseFloat(receiver.accounts.casa.balance || 0);
      receiver.accounts.casa.balance = parseFloat((receiverBalance + amount).toFixed(2));
      receiver.changed('accounts', true);
      await receiver.save({ transaction: t });

      // Create transaction log
      createdTransaction = await Transactions.create({
        customer_id,
        transaction_type,
        transaction_amount: amount,
        currency,
        transfer_customer_id,
        transaction_date: new Date(),
        created_at: new Date()
      }, { transaction: t });
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      message: `${transaction_type} transaction successfully processed`,
      data: createdTransaction
    });

  } catch (error) {
    await t.rollback();
    console.error('Transaction processing failure pipeline trace:', error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
