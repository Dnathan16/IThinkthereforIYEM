// Simple helper function: Get Airtable photos with pagination (proven to work)
async function getAirtablePhotosOnly() {
  let allRecords = [];
  let offset = null;
  
  do {
    let airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Photos?sort[0][field]=Submitted At&sort[0][direction]=desc&maxRecords=100`;
    if (offset) {
      airtableUrl += `&offset=${offset}`;
    }
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Airtable error: ${response.status}`);
    }
    
    const data = await response.json();
    const formatted = data.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));
    
    allRecords = allRecords.concat(formatted);
    offset = data.offset || null;
    
  } while (offset);
  
  return allRecords;
}

// Simple helper function: Get Cloudinary photos (minimal approach)
async function getCloudinaryPhotosSimple() {
  // Only import/configure Cloudinary when actually needed
  const { v2: cloudinary } = require('cloudinary');
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  const result = await cloudinary.search
    .expression('resource_type:image')
    .sort_by('created_at', 'desc')
    .max_results(500) // Get first 500, simple approach
    .execute();
  
  return result.resources.map(photo => ({
    id: photo.public_id,
    'Photo URL': photo.secure_url,
    'Name': 'Photo Contributor',
    'Description': `Photo from ${new Date(photo.created_at).toLocaleDateString()}`,
    'Submitted At': photo.created_at,
  }));
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

    // SPECIAL HANDLING FOR PHOTOS - Try to get ALL photos for your friend!
    if (type === 'photos' || !type) {
      console.log('Attempting to load ALL photos for your friend...');
      
      try {
        // Step 1: Always get Airtable photos first (guaranteed to work)
        const airtablePhotos = await getAirtablePhotosOnly();
        console.log(`Got ${airtablePhotos.length} photos from Airtable`);
        
        // Step 2: Try to get additional Cloudinary photos (with fallback)
        let allPhotos = [...airtablePhotos];
        
        try {
          const cloudinaryPhotos = await getCloudinaryPhotosSimple();
          console.log(`Got ${cloudinaryPhotos.length} photos from Cloudinary`);
          
          // Merge them - add Cloudinary photos that aren't already in Airtable
          const airtableUrls = new Set(airtablePhotos.map(p => p['Photo URL']));
          const newCloudinaryPhotos = cloudinaryPhotos.filter(p => !airtableUrls.has(p['Photo URL']));
          
          allPhotos = [...airtablePhotos, ...newCloudinaryPhotos];
          console.log(`Final total: ${allPhotos.length} photos (${airtablePhotos.length} from Airtable + ${newCloudinaryPhotos.length} additional from Cloudinary)`);
          
        } catch (cloudinaryError) {
          console.warn('Cloudinary failed, using Airtable only:', cloudinaryError.message);
          // Continue with just Airtable photos
        }
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: true,
            submissions: allPhotos,
            total: allPhotos.length,
            source: allPhotos.length > airtablePhotos.length ? 'airtable+cloudinary' : 'airtable-only'
          }),
        };
        
      } catch (error) {
        console.error('Photo loading failed completely:', error);
        // Fall through to regular Airtable handling
      }
    }

    // Regular handling for other types or if photo handling failed
    let tableName = 'Photos'; // default
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