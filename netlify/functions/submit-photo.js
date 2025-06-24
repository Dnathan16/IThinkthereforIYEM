const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_SECRET,  // These are swapped in .env
  api_secret: process.env.CLOUDINARY_API_KEY    // These are swapped in .env
});

// Configure Airtable
const AIRTABLE_TOKEN = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = 'Photos';

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, description, photoBase64 } = data;

    // Validate required fields
    if (!name || !photoBase64) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: name and photo are required' 
        })
      };
    }

    console.log('Uploading to Cloudinary...');

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(photoBase64, {
      folder: 'phish-journey',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('Cloudinary upload successful:', uploadResult.public_id);

    // Prepare data for Airtable
    const airtableData = {
      fields: {
        Name: name,
        'Photo URL': uploadResult.secure_url,
        Description: description || ''
      }
    };

    console.log('Saving to Airtable...');

    // Save to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.text();
      console.error('Airtable error:', errorData);
      throw new Error(`Airtable error: ${errorData}`);
    }

    const airtableResult = await airtableResponse.json();
    console.log('Airtable save successful:', airtableResult.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Photo uploaded successfully!',
        photoUrl: uploadResult.secure_url,
        recordId: airtableResult.id
      })
    };

  } catch (error) {
    console.error('Error in submit-photo:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to upload photo'
      })
    };
  }
};