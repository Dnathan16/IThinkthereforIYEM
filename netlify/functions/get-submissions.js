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

    // Fetch from Airtable
    const airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableName}?sort[0][field]=Submitted At&sort[0][direction]=desc&maxRecords=50`;
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
    console.log('Airtable data:', data);
    
    // Format the response
    const submissions = data.records.map(record => ({
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