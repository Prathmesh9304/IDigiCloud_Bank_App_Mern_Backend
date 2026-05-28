import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IDigiCloud Bank App API',
      version: '1.0.0',
      description: 'API documentation for the IDigiCloud Banking Application Backend.',
      contact: {
        name: 'Developer support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        LoginRequest: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'admin' },
            password: { type: 'string', example: 'pass123' },
          },
          required: ['username', 'password'],
        },
        NewAccountRequest: {
          type: 'object',
          properties: {
            product_class: { type: 'string', enum: ['CASA', 'LOAN', 'TD', 'RD'], example: 'CASA' },
            linked_customer_id: { type: 'string', description: 'Required only for LOAN, TD, and RD', example: '136318763022' },
            first_name: { type: 'string', example: 'John' },
            middle_name: { type: 'string', example: 'M.' },
            last_name: { type: 'string', example: 'Doe' },
            contact_number: { type: 'string', example: '+919876543210' },
            email_address: { type: 'string', example: 'johndoe@example.com' },
            profile_img: { type: 'string', description: 'Base64 image string' },
            branch_code: { type: 'string', example: 'IDIGI001' },
            branch_name: { type: 'string', example: 'Mumbai Main' },
            preferred_currency: { type: 'string', example: 'INR' },
            feature_atm_pos: { type: 'boolean', default: false },
            feature_internet_banking: { type: 'boolean', default: false },
            feature_cheque_book: { type: 'boolean', default: false },
            feature_passbook: { type: 'boolean', default: false },
            feature_sweep_in: { type: 'boolean', default: false },
            feature_sweep_out: { type: 'boolean', default: false },
            feature_reverse_sweep_in: { type: 'boolean', default: false },
            feature_mobile_banking: { type: 'boolean', default: false },
            feature_phone_banking: { type: 'boolean', default: false },
            feature_inward_direct_debit: { type: 'boolean', default: false },
            feature_business_collection: { type: 'boolean', default: false },
            feature_periodic_debit: { type: 'boolean', default: false },
            feature_periodic_credit: { type: 'boolean', default: false },
            feature_branch: { type: 'boolean', default: false },
            feature_debit_card: { type: 'boolean', default: false },
            interest_acknowledgement: { type: 'boolean', default: false },
            mode_of_operation: { type: 'string', example: 'Self' },
            has_co_applicant: { type: 'boolean', default: false },
            debit_card_variant: { type: 'string', example: 'Classic' },
            document_type: { type: 'string', example: 'Aadhaar' },
            document_category: { type: 'string', example: 'Identity' },
            document_id_number: { type: 'string', example: '1234-5678-9012' },
            residential_address: {
              type: 'object',
              properties: {
                line1: { type: 'string', example: 'Flat 101, building A' },
                line2: { type: 'string', example: 'Andheri West' },
                city: { type: 'string', example: 'Mumbai' },
                state: { type: 'string', example: 'Maharashtra' },
                country: { type: 'string', example: 'India' },
                pincode: { type: 'string', example: '400053' },
              },
            },
            cheque_book_standard_10_leaves: { type: 'boolean', default: false },
            cheque_book_dispatch: { type: 'string', example: 'Courier' },
            statement_delivery_mode: { type: 'string', example: 'Email' },
            has_nominee: { type: 'boolean', default: false },
            nominee: {
              type: 'object',
              properties: {
                is_existing_customer: { type: 'boolean', default: false },
                first_name: { type: 'string', example: 'Jane' },
                middle_name: { type: 'string', example: 'A.' },
                last_name: { type: 'string', example: 'Doe' },
                relationship: { type: 'string', example: 'Spouse' },
                address: {
                  type: 'object',
                  properties: {
                    line1: { type: 'string', example: 'Flat 101, building A' },
                    line2: { type: 'string', example: 'Andheri West' },
                    city: { type: 'string', example: 'Mumbai' },
                    state: { type: 'string', example: 'Maharashtra' },
                    country: { type: 'string', example: 'India' },
                    pincode: { type: 'string', example: '400053' },
                  },
                },
              },
            },
            loan_type: { type: 'string', example: 'Home Loan' },
            loan_scheme: { type: 'string', example: 'Standard Floating' },
            loan_amount: { type: 'number', example: 5000000 },
            loan_tenure: { type: 'string', example: '15 years' },
            interest_type: { type: 'string', example: 'Floating' },
            repayment_mode: { type: 'string', example: 'ECS' },
            repayment_frequency: { type: 'string', example: 'Monthly' },
            has_coapplicant: { type: 'boolean', default: false },
            coapplicant_name: { type: 'string', example: 'Jane Doe' },
            has_collateral: { type: 'boolean', default: false },
            collateral_type: { type: 'string', example: 'Property' },
            deposit_type: { type: 'string', example: 'Cumulative' },
            deposit_amount: { type: 'number', example: 100000 },
            deposit_tenure: { type: 'string', example: '1 year' },
            interest_payout: { type: 'string', example: 'On Maturity' },
            maturity_instruction: { type: 'string', example: 'Auto-Renew' },
            rd_installment_amount: { type: 'number', example: 5000 },
            rd_tenure: { type: 'string', example: '2 years' },
            rd_start_date: { type: 'string', format: 'date', example: '2026-06-01' },
            installment_date: { type: 'string', example: 'Monthly' },
            payment_mode: { type: 'string', example: 'SI' },
          },
          required: ['product_class'],
        },
        TransactionRequest: {
          type: 'object',
          properties: {
            customer_id: { type: 'string', example: '136318763022' },
            transaction_type: { type: 'string', enum: ['Deposit', 'Withdraw', 'Transfer'], example: 'Deposit' },
            transaction_amount: { type: 'string', example: '1000' },
            currency: { type: 'string', example: 'INR' },
            transfer_customer_id: { type: 'string', example: '987654321098', description: 'Required only for Transfer' },
          },
          required: ['customer_id', 'transaction_type', 'transaction_amount', 'currency'],
        },
        CustomerDetails: {
          type: 'object',
          properties: {
            customer_id: { type: 'string', primaryKey: true, example: '136318763022' },
            first_name: { type: 'string', example: 'John' },
            middle_name: { type: 'string', example: 'M.' },
            last_name: { type: 'string', example: 'Doe' },
            contact_number: { type: 'string', unique: true, example: '+919876543210' },
            email_address: { type: 'string', unique: true, example: 'johndoe@example.com' },
            profile_img: { type: 'string', example: 'https://res.cloudinary.com/dxz1b4uju/image/upload/v12345/idigicloud/profileImages/abc.jpg' },
            accounts: {
              type: 'object',
              properties: {
                casa: {
                  type: 'object',
                  properties: {
                    account_number: { type: 'string', example: '123456789012' },
                    balance: { type: 'number', example: 0 },
                    debit_card_number: { type: 'string', example: '1234567890123456' },
                    debit_card_varient: { type: 'string', example: 'Classic' },
                    currency: { type: 'string', example: 'INR' }
                  }
                },
                loan: {
                  type: 'object',
                  properties: {
                    account_number: { type: 'string', example: '123456789013' },
                    balance: { type: 'number', example: 5000000 }
                  }
                },
                td: {
                  type: 'object',
                  properties: {
                    account_number: { type: 'string', example: '123456789014' },
                    balance: { type: 'number', example: 100000 }
                  }
                },
                rd: {
                  type: 'object',
                  properties: {
                    account_number: { type: 'string', example: '123456789015' },
                    balance: { type: 'number', example: 0 }
                  }
                }
              }
            }
          }
        },
        CasaAccountDetails: {
          type: 'object',
          properties: {
            casa_account_number: { type: 'string', primaryKey: true, example: '123456789012' },
            product_class: { type: 'string', example: 'CASA' },
            first_name: { type: 'string', example: 'John' },
            middle_name: { type: 'string', example: 'M.' },
            last_name: { type: 'string', example: 'Doe' },
            contact_number: { type: 'string', example: '+919876543210' },
            email_address: { type: 'string', example: 'johndoe@example.com' },
            profile_img: { type: 'string', example: 'https://res.cloudinary.com/dxz1b4uju/image/upload/v12345/idigicloud/profileImages/abc.jpg' },
            branch_code: { type: 'string', example: 'IDIGI001' },
            branch_name: { type: 'string', example: 'Mumbai Main' },
            preferred_currency: { type: 'string', example: 'INR' },
            feature_atm_pos: { type: 'boolean', default: false },
            feature_internet_banking: { type: 'boolean', default: false },
            feature_cheque_book: { type: 'boolean', default: false },
            feature_passbook: { type: 'boolean', default: false },
            feature_sweep_in: { type: 'boolean', default: false },
            feature_sweep_out: { type: 'boolean', default: false },
            feature_reverse_sweep_in: { type: 'boolean', default: false },
            feature_mobile_banking: { type: 'boolean', default: false },
            feature_phone_banking: { type: 'boolean', default: false },
            feature_inward_direct_debit: { type: 'boolean', default: false },
            feature_business_collection: { type: 'boolean', default: false },
            feature_periodic_debit: { type: 'boolean', default: false },
            feature_periodic_credit: { type: 'boolean', default: false },
            feature_branch: { type: 'boolean', default: false },
            feature_debit_card: { type: 'boolean', default: false },
            interest_acknowledgement: { type: 'boolean', default: false },
            mode_of_operation: { type: 'string', example: 'Self' },
            has_co_applicant: { type: 'boolean', default: false },
            coapplicant_customer_id: { type: 'string', example: '' },
            coapplicant_name: { type: 'string', example: '' },
            coapplicant_role: { type: 'string', example: '' },
            debit_card_variant: { type: 'string', example: 'Classic' },
            document_type: { type: 'string', example: 'Aadhaar' },
            document_category: { type: 'string', example: 'Identity' },
            document_id_number: { type: 'string', example: '1234-5678-9012' },
            residential_address: {
              type: 'object',
              properties: {
                line1: { type: 'string', example: 'Flat 101, building A' },
                line2: { type: 'string', example: 'Andheri West' },
                city: { type: 'string', example: 'Mumbai' },
                state: { type: 'string', example: 'Maharashtra' },
                country: { type: 'string', example: 'India' },
                pincode: { type: 'string', example: '400053' },
              }
            },
            contact_otp_verified: { type: 'boolean', default: false },
            email_otp_verified: { type: 'boolean', default: false },
            cheque_book_standard_10_leaves: { type: 'boolean', default: false },
            cheque_book_dispatch: { type: 'string', example: 'Courier' },
            statement_delivery_mode: { type: 'string', example: 'Email' },
            has_nominee: { type: 'boolean', default: false },
            nominee: {
              type: 'object',
              properties: {
                is_existing_customer: { type: 'boolean', default: false },
                first_name: { type: 'string', example: 'Jane' },
                middle_name: { type: 'string', example: 'A.' },
                last_name: { type: 'string', example: 'Doe' },
                relationship: { type: 'string', example: 'Spouse' },
                address: {
                  type: 'object',
                  properties: {
                    line1: { type: 'string', example: 'Flat 101, building A' },
                    line2: { type: 'string', example: 'Andheri West' },
                    city: { type: 'string', example: 'Mumbai' },
                    state: { type: 'string', example: 'Maharashtra' },
                    country: { type: 'string', example: 'India' },
                    pincode: { type: 'string', example: '400053' },
                  }
                }
              }
            }
          }
        },
        LoanAccountDetails: {
          type: 'object',
          properties: {
            loan_account_number: { type: 'string', primaryKey: true, example: '123456789013' },
            product_class: { type: 'string', example: 'LOAN' },
            loan_type: { type: 'string', example: 'Home Loan' },
            loan_scheme: { type: 'string', example: 'Standard Floating' },
            loan_amount: { type: 'number', example: 5000000 },
            loan_tenure: { type: 'string', example: '15 years' },
            interest_type: { type: 'string', example: 'Floating' },
            repayment_mode: { type: 'string', example: 'ECS' },
            repayment_frequency: { type: 'string', example: 'Monthly' },
            has_coapplicant: { type: 'boolean', default: false },
            coapplicant_name: { type: 'string', example: 'Jane Doe' },
            has_collateral: { type: 'boolean', default: false },
            collateral_type: { type: 'string', example: 'Property' }
          }
        },
        TdAccountDetails: {
          type: 'object',
          properties: {
            td_account_number: { type: 'string', primaryKey: true, example: '123456789014' },
            product_class: { type: 'string', example: 'TD' },
            deposit_type: { type: 'string', example: 'Cumulative' },
            deposit_amount: { type: 'number', example: 100000 },
            deposit_tenure: { type: 'string', example: '1 year' },
            interest_payout: { type: 'string', example: 'On Maturity' },
            interest_type: { type: 'string', example: 'Fixed' },
            maturity_instruction: { type: 'string', example: 'Auto-Renew' },
            has_nominee: { type: 'boolean', default: false },
            nominee_name: { type: 'string', example: 'Jane Doe' },
            nominee_relationship: { type: 'string', example: 'Spouse' }
          }
        },
        RdAccountDetails: {
          type: 'object',
          properties: {
            rd_account_number: { type: 'string', primaryKey: true, example: '123456789015' },
            product_class: { type: 'string', example: 'RD' },
            rd_installment_amount: { type: 'number', example: 5000 },
            rd_tenure: { type: 'string', example: '2 years' },
            rd_start_date: { type: 'string', format: 'date', example: '2026-06-01' },
            installment_date: { type: 'string', example: 'Monthly' },
            payment_mode: { type: 'string', example: 'SI' },
            maturity_instruction: { type: 'string', example: 'Auto-Close' },
            has_nominee: { type: 'boolean', default: false },
            nominee_name: { type: 'string', example: 'Jane Doe' },
            nominee_relationship: { type: 'string', example: 'Spouse' }
          }
        },
        Transactions: {
          type: 'object',
          properties: {
            transaction_id: { type: 'string', format: 'uuid', primaryKey: true, example: 'd3b07384-d113-4ec5-a587-343d2c3cf8fa' },
            customer_id: { type: 'string', example: '136318763022' },
            transaction_type: { type: 'string', enum: ['Deposit', 'Withdraw', 'Transfer'], example: 'Deposit' },
            transaction_amount: { type: 'number', example: 1000 },
            currency: { type: 'string', example: 'INR' },
            transfer_customer_id: { type: 'string', example: '987654321098' },
            transaction_date: { type: 'string', format: 'date-time', example: '2026-05-27T04:24:58.000Z' },
            created_at: { type: 'string', format: 'date-time', example: '2026-05-27T04:24:58.000Z' }
          }
        },
        Otp: {
          type: 'object',
          properties: {
            identifier: { type: 'string', example: 'email' },
            otp_code: { type: 'string', example: '123456' },
            attempt_count: { type: 'integer', example: 0 },
            is_verified: { type: 'boolean', default: false },
            expires_at: { type: 'string', format: 'date-time', example: '2026-05-27T04:30:00.000Z' },
            created_at: { type: 'string', format: 'date-time', example: '2026-05-27T04:25:00.000Z' }
          }
        },
        VerifyDocumentRequest: {
          type: 'object',
          properties: {
            document_type: { type: 'string', example: 'Aadhaar Card' },
            document_category: { type: 'string', example: 'ID Proof' },
            document_id_number: { type: 'string', example: '234' },
            name: { type: 'string', example: 'Prathmesh Prabhakar Bhoir' },
            document_file: { type: 'string', description: 'Base64 PDF string (e.g., data:application/pdf;base64,...)' }
          },
          required: ['document_type', 'document_category', 'document_id_number', 'name', 'document_file'],
        }
      },
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'Secure login endpoint',
          description: 'Authenticates admin credentials, sets an HttpOnly cookie, or auto-logs in using a valid session cookie.',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful authentication',
            },
            401: {
              description: 'Invalid credentials',
            },
          },
        },
      },
      '/api/newAccount': {
        post: {
          summary: 'Create a new account',
          description: 'Generates a new CASA account + customer, or connects a secondary account (LOAN, TD, RD) to an existing customer atomically using transaction checks.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NewAccountRequest',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Account created successfully',
            },
            400: {
              description: 'Bad Request (validation error, size limits, constraint mismatch)',
            },
          },
        },
      },
      '/api/getCustomer': {
        get: {
          summary: 'Get all customers details',
          description: 'Retrieves all registered customer profiles from the database.',
          responses: {
            200: {
              description: 'A list of customers with nested CASA/LOAN/TD/RD accounts metadata.',
            },
            500: {
              description: 'Internal server error',
            },
          },
        },
      },
      '/api/transaction': {
        post: {
          summary: 'Process a new financial transaction',
          description: 'Performs Deposits, Withdrawals, or Transfers atomically inside a database transaction, updating respective customer balances and returning the transaction log.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TransactionRequest',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Transaction successfully processed and recorded',
            },
            400: {
              description: 'Invalid fields, insufficient funds, or missing parameters',
            },
          },
        },
      },
      '/api/verifyDocument': {
        post: {
          summary: 'Verify a customer document',
          description: 'Uploads a document to Cloudinary and forwards details to a Python service for verification.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/VerifyDocumentRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Document verification completed successfully',
            },
            400: {
              description: 'Missing required fields',
            },
            500: {
              description: 'Failed to verify or Internal server error',
            },
          },
        },
      },
      '/api/generateDocument': {
        post: {
          summary: 'Generate passbook, chequebook, and debit card PDFs',
          description: 'Forwards customer data to the Python service to generate PDF documents.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'Any valid customer/account object payload'
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Documents generated successfully',
            },
            500: {
              description: 'Failed to generate documents',
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
