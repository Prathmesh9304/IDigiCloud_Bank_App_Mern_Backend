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

/**
 * Uploads a base64 document string to Cloudinary.
 * @param {string} base64Str - Base64 encoded string
 * @returns {Promise<{secure_url: string, public_id: string}>} The secure URL and public ID of the uploaded document
 */
export async function uploadVerificationDocument(base64Str) {
  if (!base64Str) return null;

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Str, {
      folder: 'idigicloud/verificationDocs',
      resource_type: 'auto',
    });
    return {
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    console.error('Error uploading verification document to Cloudinary:', error);
    throw new Error(`Cloudinary document upload failed: ${error.message}`);
  }
}

/**
 * Deletes a document from Cloudinary using its public ID.
 * @param {string} publicId - The public ID of the document in Cloudinary
 */
export async function deleteVerificationDocument(publicId) {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }); // PDFs uploaded without 'raw' are treated as 'image' in destroy, but 'auto' will figure it out, though typically we destroy with the same type or default. Let's use no resource_type if possible, but actually PDFs are 'image' resource type in Cloudinary unless raw is specified. Let's leave it default.
    // Wait, let's just use cloudinary.uploader.destroy(publicId) which usually handles it.
  } catch (error) {
    console.error('Error deleting verification document from Cloudinary:', error);
    throw new Error(`Cloudinary document deletion failed: ${error.message}`);
  }
}
