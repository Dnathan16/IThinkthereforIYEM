// Import Cloudinary for photo fetching
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function: Get all photos from Airtable (with user metadata)
async function getAllAirtablePhotos() {
  let allRecords = [];
  let offset = null;
  
  do {
    let airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Photos?sort[0][field]=Submitted At&sort[0][direction]=desc&maxRecords=100`;
    if (offset) {
      airtableUrl += `&offset=${offset}`;
    }
    
    const airtableResponse = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      },
    });
    
    if (airtableResponse.ok) {
      const data = await airtableResponse.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset || null;
    } else {
      console.warn('Failed to fetch from Airtable, continuing...');
      break;
    }
  } while (offset);
  
  return allRecords;
}

// Helper function: Get all photos from Cloudinary
async function getAllCloudinaryPhotos() {
  let allPhotos = [];
  let nextCursor = null;
  
  do {
    const result = await cloudinary.search
      .expression('resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();
    
    allPhotos = allPhotos.concat(result.resources);
    nextCursor = result.next_cursor || null;
  } while (nextCursor);
  
  return allPhotos;
}

// Helper function: Organize photos - those with messages first, then those without
function organizePhotos(airtablePhotos, cloudinaryPhotos) {
  // Create a map of Airtable photos by URL for quick lookup
  const airtableByUrl = {};
  airtablePhotos.forEach(record => {
    const photoUrl = record.fields['Photo URL'];
    if (photoUrl) {
      airtableByUrl[photoUrl] = record;
    }
  });
  
  const photosWithMessages = [];
  const photosWithoutMessages = [];
  
  cloudinaryPhotos.forEach(cloudinaryPhoto => {
    const airtableRecord = airtableByUrl[cloudinaryPhoto.secure_url];
    
    if (airtableRecord) {
      // Photo has user metadata - add to "with messages" section
      photosWithMessages.push({
        id: airtableRecord.id,
        ...airtableRecord.fields,
        source: 'airtable+cloudinary'
      });
    } else {
      // Photo doesn't have user metadata - add to "without messages" section
      photosWithoutMessages.push({
        id: cloudinaryPhoto.public_id,
        'Photo URL': cloudinaryPhoto.secure_url,
        'Name': 'Photo Contributor',
        'Description': `Uploaded ${new Date(cloudinaryPhoto.created_at).toLocaleDateString()}`,
        'Submitted At': cloudinaryPhoto.created_at,
        source: 'cloudinary-only'
      });
    }
  });
  
  // Return photos with messages first, then photos without messages
  return [...photosWithMessages, ...photosWithoutMessages];
}

exports.handler = async (event, context) => {
  // Allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { type } = event.queryStringParameters || {};

    // Special handling for photos - load ALL from both Airtable AND Cloudinary
    if (type === 'photos' || !type) {
      console.log('Loading ALL photos: Airtable (with messages) + Cloudinary (all photos)');
      
      // Step 1: Get all Airtable photos (with user messages/metadata)
      const airtablePhotos = await getAllAirtablePhotos();
      console.log(`Airtable photos with metadata: ${airtablePhotos.length}`);
      
      // Step 2: Get all Cloudinary photos
      const cloudinaryPhotos = await getAllCloudinaryPhotos();
      console.log(`Total Cloudinary photos: ${cloudinaryPhotos.length}`);
      
      // Step 3: Merge and organize them
      const organizedPhotos = organizePhotos(airtablePhotos, cloudinaryPhotos);
      console.log(`Final result: ${organizedPhotos.length} photos organized`);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          submissions: organizedPhotos,
          total: organizedPhotos.length,
          source: 'hybrid-airtable-cloudinary'
        }),
      };
    }

    // For other types (videos, messages, predictions), use Airtable only
    let tableName;
    switch (type) {
      case 'videos':
        tableName = 'Videos';
        break;
      case 'messages':
        tableName = 'Messages';
        break;
      case 'predictions':
        tableName = 'Setlist Predictions';
        break;
      default:
        tableName = 'Photos';
    }

    // Debug logging
    console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
    console.log('Token exists:', !!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN);
    console.log('Table name:', tableName);

    // Fetch all records from Airtable using pagination
    let allRecords = [];
    let offset = null;

    do {
      // Build URL with pagination
      let airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableName}?sort[0][field]=Submitted At&sort[0][direction]=desc&maxRecords=300`;
      if (offset) {
        airtableUrl += `&offset=${offset}`;
      }

      console.log('Airtable URL:', airtableUrl);

      const airtableResponse = await fetch(airtableUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        },
      });

      console.log('Airtable response status:', airtableResponse.status);

      if (!airtableResponse.ok) {
        const errorText = await airtableResponse.text();
        console.error('Airtable error:', errorText);
        throw new Error(`Failed to fetch from Airtable: ${airtableResponse.status} - ${errorText}`);
      }

      const data = await airtableResponse.json();
      console.log(`Fetched ${data.records.length} records. Offset: ${data.offset || 'none'}`);

      // Add records to our collection
      allRecords = allRecords.concat(data.records);

      // Set offset for next page, or null if no more pages
      offset = data.offset || null;

    } while (offset); // Continue until no more pages

    console.log(`Total records fetched: ${allRecords.length}`);

    // Format the response
    const submissions = allRecords.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        submissions,
      }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};