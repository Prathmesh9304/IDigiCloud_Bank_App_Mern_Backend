import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TempVerificationRecord = sequelize.define('TempVerificationRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  document_type: { type: DataTypes.STRING, allowNull: true },
  document_category: { type: DataTypes.STRING, allowNull: true },
  document_id_number: { type: DataTypes.STRING, allowNull: true },
  document_url: { type: DataTypes.STRING, allowNull: true },
  public_id: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'temp_verification_records',
  timestamps: true,
});

export default TempVerificationRecord;
