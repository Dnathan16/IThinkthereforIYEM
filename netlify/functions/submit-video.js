const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the form data
    const data = JSON.parse(event.body);
    const { name, email, showDate, venue, description, videoBase64 } = data;

    // Upload video to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(videoBase64, {
      folder: 'phish-journey/videos',
      resource_type: 'video',
    });

    // Save to Airtable
    const airtableData = {
      records: [
        {
          fields: {
            Name: name,
            Email: email,
            'Show Date': showDate,
            Venue: venue,
            Description: description,
            'Video URL': uploadResult.secure_url,
            'Submitted At': new Date().toISOString(),
          },
        },
      ],
    };

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Videos`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(airtableData),
      }
    );

    if (!airtableResponse.ok) {
      throw new Error('Failed to save to Airtable');
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        message: 'Video uploaded successfully!',
        videoUrl: uploadResult.secure_url,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to upload video',
      }),
    };
  }
};