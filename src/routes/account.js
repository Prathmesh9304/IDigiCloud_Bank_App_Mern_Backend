import express from 'express';
import { sequelize, CustomerDetails, CasaAccountDetails, LoanAccountDetails, TdAccountDetails, RdAccountDetails } from '../models/index.js';
import { generate12DigitId, generate16DigitId } from '../utils/generateId.js';
import { uploadProfileImage } from '../utils/cloudinary.js';

const router = express.Router();

router.post('/newAccount', async (req, res) => {
  const { product_class, linked_customer_id, document_file, ...accountData } = req.body;

  if (!product_class) {
    return res.status(400).json({ success: false, message: 'product_class is required' });
  }

  // Start a transaction to ensure atomic operations
  const t = await sequelize.transaction();

  try {
    // Sanitize boolean fields: if they are empty strings "", null, or string representation of booleans, convert them
    const booleanFields = [
      'feature_atm_pos', 'feature_internet_banking', 'feature_cheque_book', 'feature_passbook',
      'feature_sweep_in', 'feature_sweep_out', 'feature_reverse_sweep_in', 'feature_mobile_banking',
      'feature_phone_banking', 'feature_inward_direct_debit', 'feature_business_collection',
      'feature_periodic_debit', 'feature_periodic_credit', 'feature_branch', 'feature_debit_card',
      'interest_acknowledgement', 'has_co_applicant', 'has_coapplicant', 'has_collateral', 'contact_otp_verified', 'email_otp_verified',
      'cheque_book_standard_10_leaves', 'has_nominee'
    ];

    for (const key of Object.keys(accountData)) {
      if (booleanFields.includes(key) || key.startsWith('feature_')) {
        if (accountData[key] === '' || accountData[key] === null || accountData[key] === undefined) {
          accountData[key] = false;
        } else if (accountData[key] === 'true') {
          accountData[key] = true;
        } else if (accountData[key] === 'false') {
          accountData[key] = false;
        }
      }
    }

    if (product_class === 'CASA') {
      // If a profile image (e.g. base64 string) is provided, upload it to Cloudinary
      if (accountData.profile_img) {
        const cloudinaryUrl = await uploadProfileImage(accountData.profile_img);
        accountData.profile_img = cloudinaryUrl;
      }

      // 1. CASA Account Creation implies a new Customer
      const customer_id = generate12DigitId();
      const casa_account_number = generate12DigitId();
      const debit_card_number = generate16DigitId();

      // Create the CASA account record
      const newCasaAccount = await CasaAccountDetails.create({
        casa_account_number,
        product_class,
        ...accountData
      }, { transaction: t });

      // Create the Customer Details record
      const newCustomer = await CustomerDetails.create({
        customer_id,
        first_name: accountData.first_name,
        middle_name: accountData.middle_name,
        last_name: accountData.last_name,
        contact_number: accountData.contact_number,
        email_address: accountData.email_address,
        profile_img: accountData.profile_img,
        accounts: {
          casa: {
            account_number: casa_account_number,
            balance: 0,
            debit_card_number: debit_card_number,
            debit_card_varient: accountData.debit_card_variant,
            currency: accountData.preferred_currency
          }
        }
      }, { transaction: t });

      await t.commit();
      return res.status(201).json({ 
        success: true, 
        message: 'CASA account created successfully', 
        data: { customer_id, casa_account_number } 
      });

    } else if (['LOAN', 'TD', 'RD'].includes(product_class)) {
      // 2. LOAN, TD, RD Accounts require an existing Customer
      if (!linked_customer_id) {
        throw new Error('linked_customer_id is required for LOAN, TD, and RD accounts');
      }

      // Verify that the customer exists
      const customer = await CustomerDetails.findByPk(linked_customer_id, { transaction: t });
      if (!customer) {
        throw new Error('Customer not found with the provided linked_customer_id');
      }

      let newAccount;
      let accountTypeKey;
      let accountJsonData;

      // Handle the specific account type creation
      if (product_class === 'LOAN') {
        const loan_account_number = generate12DigitId();
        newAccount = await LoanAccountDetails.create({
          loan_account_number,
          product_class,
          ...accountData
        }, { transaction: t });
        
        accountTypeKey = 'loan';
        accountJsonData = {
          account_number: loan_account_number,
          balance: accountData.loan_amount || 0
        };
      } else if (product_class === 'TD') {
        const td_account_number = generate12DigitId();
        newAccount = await TdAccountDetails.create({
          td_account_number,
          product_class,
          ...accountData
        }, { transaction: t });

        accountTypeKey = 'td';
        accountJsonData = {
          account_number: td_account_number,
          balance: accountData.deposit_amount || 0
        };
      } else if (product_class === 'RD') {
        const rd_account_number = generate12DigitId();
        newAccount = await RdAccountDetails.create({
          rd_account_number,
          product_class,
          ...accountData
        }, { transaction: t });

        accountTypeKey = 'rd';
        accountJsonData = {
          account_number: rd_account_number,
          balance: 0
        };
      }

      // Update the customer's accounts JSONB object
      // We merge with existing accounts to prevent overwriting other active accounts (e.g., CASA)
      const existingAccounts = customer.accounts || {};
      const updatedAccounts = {
        ...existingAccounts,
        [accountTypeKey]: accountJsonData
      };

      customer.accounts = updatedAccounts;
      customer.changed('accounts', true);
      await customer.save({ transaction: t });

      await t.commit();
      return res.status(201).json({ 
        success: true, 
        message: `${product_class} account created successfully`, 
        data: newAccount 
      });

    } else {
      throw new Error('Invalid product_class provided');
    }
  } catch (error) {
    await t.rollback();
    console.error('Account creation failure pipeline trace:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/getCustomer', async (req, res) => {
  try {
    const customers = await CustomerDetails.findAll();
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
