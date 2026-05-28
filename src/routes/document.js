import express from 'express';
import { TempVerificationRecord } from '../models/index.js';
import { uploadVerificationDocument, deleteVerificationDocument } from '../utils/cloudinary.js';

const router = express.Router();

router.post('/verifyDocument', async (req, res) => {
  const { document_type, document_category, document_id_number, document_file, name } = req.body;

  if (!document_type || !document_category || !document_id_number || !document_file || !name) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  let cloudinaryUpload = null;
  let tempRecord = null;

  try {
    // 1. Upload to Cloudinary
    cloudinaryUpload = await uploadVerificationDocument(document_file);
    if (!cloudinaryUpload) {
      return res.status(500).json({ success: false, message: 'Failed to upload document.' });
    }

    // 2. Create Temporary DB Record
    tempRecord = await TempVerificationRecord.create({
      document_type,
      document_category,
      document_id_number,
      document_url: cloudinaryUpload.secure_url,
      public_id: cloudinaryUpload.public_id
    });

    // 3. Prepare payload for Python Service
    const pythonPayload = {
      document_type,
      document_category,
      document_id_number,
      name,
      document_file: cloudinaryUpload.secure_url // Send URL instead of base64
    };

    const pythonServiceBaseUrl = process.env.PYTHON_SERVICE_URL;
    if (!pythonServiceBaseUrl) {
      throw new Error('PYTHON_SERVICE_URL is not defined in environment variables.');
    }
    const pythonServiceUrl = `${pythonServiceBaseUrl}/verifyDocument`;

    // 4. Hit Python Service with 1 minute timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 1 minute timeout

    let pythonResponse;
    try {
      const response = await fetch(pythonServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pythonPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Python service returned status ${response.status}`);
      }

      pythonResponse = await response.json();
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Determine if it was a timeout or network error
      if (fetchError.name === 'AbortError') {
        console.error('Python service request timed out.');
      } else {
        console.error('Python service request failed:', fetchError);
      }
      
      // Cleanup
      await deleteVerificationDocument(cloudinaryUpload.public_id);
      await tempRecord.destroy();

      return res.status(500).json({ success: false, message: 'Failed to verify' });
    }

    // 5. Success - Cleanup
    await deleteVerificationDocument(cloudinaryUpload.public_id);
    await tempRecord.destroy();

    // Forward the python service response back to frontend
    return res.status(200).json({
      success: true,
      message: 'Document verification completed',
      data: pythonResponse
    });

  } catch (error) {
    console.error('Verification Route Error:', error);
    
    // Attempt cleanup if something failed unexpectedly
    if (cloudinaryUpload && cloudinaryUpload.public_id) {
      await deleteVerificationDocument(cloudinaryUpload.public_id).catch(() => {});
    }
    if (tempRecord) {
      await tempRecord.destroy().catch(() => {});
    }

    return res.status(500).json({ success: false, message: 'An internal error occurred.' });
  }
});

router.post('/generateDocument', async (req, res) => {
  try {
    const payload = req.body;
    const pythonServiceBaseUrl = process.env.PYTHON_SERVICE_URL;
    if (!pythonServiceBaseUrl) {
      throw new Error('PYTHON_SERVICE_URL is not defined in environment variables.');
    }
    const pythonServiceUrl = `${pythonServiceBaseUrl}/generateDocument`;

    const response = await fetch(pythonServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Python service returned status ${response.status}`);
    }

    const pythonResponse = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Documents generated successfully',
      data: pythonResponse
    });
  } catch (error) {
    console.error('Generate Document Route Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate documents' });
  }
});

export default router;
