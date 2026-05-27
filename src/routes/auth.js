import express from 'express';
import { encryptId, decryptId } from '../utils/generateId.js';

const router = express.Router();

// Helper to verify cookie token
const verifyToken = (token) => {
  if (!token) return null;
  try {
    const decrypted = decryptId(token);
    const [username, timestampStr] = decrypted.split(':');
    const timestamp = parseInt(timestampStr, 10);
    
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    
    // Check if username matches and timestamp is valid and within 24 hours
    if (username === adminUser && !isNaN(timestamp)) {
      const age = Date.now() - timestamp;
      if (age > 0 && age < 24 * 60 * 60 * 1000) {
        return username;
      }
    }
  } catch (error) {
    // Decryption failed or token was tampered with
  }
  return null;
};

// Unified Login Route (Checks cookie first, otherwise checks credentials)
router.post('/auth/login', (req, res) => {
  // 1. Try to log in by reading the browser cookie first
  const existingToken = req.cookies.token;
  const loggedInUser = verifyToken(existingToken);

  if (loggedInUser) {
    return res.status(200).json({
      success: true,
      message: 'Login successful (via session cookie)',
      user: { username: loggedInUser }
    });
  }

  // 2. If no valid cookie exists, fallback to verifying request body credentials
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'password123';

  if (username === adminUser && password === adminPass) {
    // Generate secure encrypted token: username + current timestamp
    const token = encryptId(`${adminUser}:${Date.now()}`);
    
    // Set the httpOnly secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { username: adminUser }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

export default router;
