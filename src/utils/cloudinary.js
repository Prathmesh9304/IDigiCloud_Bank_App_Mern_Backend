import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// The cloudinary SDK automatically picks up the CLOUDINARY_URL from process.env

/**
 * Uploads a base64 image string to Cloudinary.
 * @param {string} base64Str - Base64 encoded image string (e.g. "data:image/png;base64,...")
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
export async function uploadProfileImage(base64Str) {
  if (!base64Str) return null;

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Str, {
      folder: 'idigicloud/profileImages',
      resource_type: 'image',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}
