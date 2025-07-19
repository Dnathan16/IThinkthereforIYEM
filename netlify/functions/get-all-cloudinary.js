const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async (event, context) => {
  // Allow GET requests only
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    console.log('Fetching ALL photos from Cloudinary...');
    
    // Get ALL photos from Cloudinary with pagination
    let allPhotos = [];
    let nextCursor = null;
    
    do {
      console.log('Fetching batch from Cloudinary...');
      
      const result = await cloudinary.search
        .expression('resource_type:image')
        .sort_by('created_at', 'desc')
        .max_results(500) // Max per request
        .execute();
      
      console.log(`Fetched ${result.resources.length} photos`);
      
      // Add all photos from this batch
      allPhotos = allPhotos.concat(result.resources);
      
      // Check if there are more photos
      nextCursor = result.next_cursor || null;
      
    } while (nextCursor);
    
    console.log(`TOTAL PHOTOS: ${allPhotos.length}`);
    
    // Format for frontend (simple format)
    const submissions = allPhotos.map((photo, index) => ({
      id: photo.public_id,
      'Photo URL': photo.secure_url,
      'Name': `Photo ${index + 1}`,
      'Description': `Uploaded ${new Date(photo.created_at).toLocaleDateString()}`,
      'Submitted At': photo.created_at
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
        total: submissions.length,
        source: 'cloudinary-all'
      }),
    };
  } catch (error) {
    console.error('Cloudinary error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        source: 'cloudinary-error'
      }),
    };
  }
};
