import crypto from 'crypto';

/**
 * Generates a cryptographically secure 12-digit random number as a string.
 * It ensures the number is between 100000000000 and 999999999999.
 * @returns {string} 12-digit unique ID
 */
export function generate12DigitId() {
  const min = 100000000000;
  const max = 999999999999;
  const num = crypto.randomInt(min, max + 1);
  return num.toString();
}

/**
 * Generates a cryptographically secure 16-digit random number as a string for debit cards.
 * @returns {string} 16-digit unique ID
 */
export function generate16DigitId() {
  let id = '';
  for (let i = 0; i < 16; i++) {
    const min = (i === 0) ? 1 : 0;
    id += crypto.randomInt(min, 10).toString();
  }
  return id;
}

/**
 * A simple encryption utility if IDs need to be encrypted before sending to the frontend.
 * Uses AES-256-CBC. In a real app, use a secure secret from .env.
 */
const ENCRYPTION_KEY = crypto.scryptSync(process.env.ADMIN_PASSWORD || 'secret', 'salt', 32);
const IV_LENGTH = 16;

export function encryptId(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptId(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
