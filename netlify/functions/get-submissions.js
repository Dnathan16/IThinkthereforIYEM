const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Handle photos by fetching ALL from Cloudinary + metadata from Airtable
async function handlePhotosWithCloudinaryFallback() {
  console.log('Fetching ALL photos from Cloudinary + metadata from Airtable...');
  
  try {
    // Step 1: Fetch ALL photos from Cloudinary
    let allCloudinaryPhotos = [];
    let nextCursor = null;
    
    do {
      const result = await cloudinary.search
        .expression('resource_type:image')
        .sort_by('created_at', 'desc')
        .max_results(500)
        .execute();
      
      console.log(`Fetched ${result.resources.length} photos from Cloudinary`);
      allCloudinaryPhotos = allCloudinaryPhotos.concat(result.resources);
      nextCursor = result.next_cursor || null;
      
    } while (nextCursor);
    
    console.log(`Total photos from Cloudinary: ${allCloudinaryPhotos.length}`);
    
    // Step 2: Fetch user metadata from Airtable
    let airtablePhotos = [];
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
        console.log(`Fetched ${data.records.length} photos with metadata from Airtable`);
        airtablePhotos = airtablePhotos.concat(data.records);
        offset = data.offset || null;
      } else {
        console.warn('Failed to fetch from Airtable, continuing with Cloudinary-only data');
        break;
      }
      
    } while (offset);
    
    console.log(`Total photos with metadata from Airtable: ${airtablePhotos.length}`);
    
    // Step 3: Create lookup map from Airtable photos by URL
    const airtableMetadata = {};
    airtablePhotos.forEach(record => {
      const photoUrl = record.fields['Photo URL'];
      if (photoUrl) {
        airtableMetadata[photoUrl] = {
          name: record.fields.Name || 'Anonymous',
          description: record.fields.Description || '',
          submittedAt: record.fields['Submitted At'] || record.fields.created_at
        };
      }
    });
    
    // Step 4: Merge Cloudinary photos with Airtable metadata
    const submissions = allCloudinaryPhotos.map((photo, index) => {
      const metadata = airtableMetadata[photo.secure_url];
      
      return {
        id: photo.public_id,
        'Photo URL': photo.secure_url,
        'Name': metadata ? metadata.name : 'Photo Contributor',
        'Description': metadata ? metadata.description : `Uploaded ${new Date(photo.created_at).toLocaleDateString()}`,
        'Submitted At': metadata ? metadata.submittedAt : photo.created_at,
        'Source': metadata ? 'airtable+cloudinary' : 'cloudinary-only'
      };
    });
    
    const withMetadata = submissions.filter(p => p.Source === 'airtable+cloudinary').length;
    const cloudinaryOnly = submissions.filter(p => p.Source === 'cloudinary-only').length;
    
    console.log(`Final result: ${submissions.length} total photos (${withMetadata} with user metadata, ${cloudinaryOnly} Cloudinary-only)`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        submissions,
        total: submissions.length,
        withMetadata,
        cloudinaryOnly,
        source: 'hybrid'
      }),
    };
    
  } catch (error) {
    console.error('Hybrid photo fetch error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        source: 'hybrid-error'
      }),
    };
  }
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

    // Special handling for photos - fetch ALL from Cloudinary + metadata from Airtable
    if (type === 'photos' || !type) {
      return await handlePhotosWithCloudinaryFallback();
    }

    // For other types, use Airtable only
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