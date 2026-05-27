import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CasaAccountDetails = sequelize.define('CasaAccountDetails', {
  casa_account_number: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_class: { type: DataTypes.STRING, allowNull: true },
  first_name: { type: DataTypes.STRING, allowNull: true },
  middle_name: { type: DataTypes.STRING, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: true },
  contact_number: { type: DataTypes.STRING, allowNull: true },
  email_address: { type: DataTypes.STRING, allowNull: true },
  profile_img: { type: DataTypes.STRING, allowNull: true },
  branch_code: { type: DataTypes.STRING, allowNull: true },
  branch_name: { type: DataTypes.STRING, allowNull: true },
  preferred_currency: { type: DataTypes.STRING, allowNull: true },

  feature_atm_pos: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_internet_banking: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_cheque_book: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_passbook: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_sweep_in: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_sweep_out: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_reverse_sweep_in: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_mobile_banking: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_phone_banking: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_inward_direct_debit: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_business_collection: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_periodic_debit: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_periodic_credit: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_branch: { type: DataTypes.BOOLEAN, defaultValue: false },
  feature_debit_card: { type: DataTypes.BOOLEAN, defaultValue: false },

  interest_acknowledgement: { type: DataTypes.BOOLEAN, defaultValue: false },
  mode_of_operation: { type: DataTypes.STRING, allowNull: true },
  has_co_applicant: { type: DataTypes.BOOLEAN, defaultValue: false },
  coapplicant_customer_id: { type: DataTypes.STRING, allowNull: true },
  coapplicant_name: { type: DataTypes.STRING, allowNull: true },
  coapplicant_role: { type: DataTypes.STRING, allowNull: true },
  debit_card_variant: { type: DataTypes.STRING, allowNull: true },
  document_type: { type: DataTypes.STRING, allowNull: true },
  document_category: { type: DataTypes.STRING, allowNull: true },
  document_id_number: { type: DataTypes.STRING, allowNull: true },

  residential_address: {
    type: DataTypes.JSONB,
    allowNull: true,
  },

  contact_otp_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  email_otp_verified: { type: DataTypes.BOOLEAN, defaultValue: false },

  cheque_book_standard_10_leaves: { type: DataTypes.BOOLEAN, defaultValue: false },
  cheque_book_dispatch: { type: DataTypes.STRING, allowNull: true },
  statement_delivery_mode: { type: DataTypes.STRING, allowNull: true },

  has_nominee: { type: DataTypes.BOOLEAN, defaultValue: false },
  nominee: {
    type: DataTypes.JSONB,
    allowNull: true,
  }
}, {
  tableName: 'casa_account_details',
  timestamps: false,
});

export default CasaAccountDetails;
