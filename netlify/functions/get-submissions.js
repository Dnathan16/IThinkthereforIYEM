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
    let tableName = 'Photos'; // default

    // Determine which table to query
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