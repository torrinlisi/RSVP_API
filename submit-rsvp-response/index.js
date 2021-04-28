const { Pool } = require('pg');
let pool;

exports.handler = async (event, context, callback) => {
  let body = JSON.parse(event.body);

  if(body.people.length == 0)
    throw new Error("Invalid body.")

  pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  });

  body.people.forEach(async (element) => {
    if(element.isAttending)
      if(
        !/^[a-zA-Z0-9',&\s"]{0,250}$/.test(element.allergies) ||
        !/^[0-9]{0,5}$/.test(element.mealID)
      )
        throw new Error('Invalid body.');

    await saveSingleResponse(element);
  });


  await updateRSVPRecord(body.rsvpID);

  await pool.end();

	callback(null, {
		isBase64Encoded: false,
		statusCode: 200,
		body: 'Success!',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
	}); 
}

async function saveSingleResponse(saveObj) {
  const query = 'update rsvp_person ' + 
    `set meal_id = ${saveObj.mealID}, ` +
    `allergy = '${saveObj.allergies}', ` +
    `is_attending = ${saveObj.isAttending} ` +
    `where id = ${saveObj.rsvpPersonID}`;

  try {
    await pool.query(query);
  } catch (err) {
    if (err) {
      throw new Error(`Something went wrong... ${err}`);
    }
  }
}

async function updateRSVPRecord(id) {
  const query = 'update rsvp ' + 
    `set responded = true ` +
    `where id = ${id}`;

  try {
    await pool.query(query);
  } catch (err) {
    if (err) {
      throw new Error(`Something went wrong... ${err}`);
    }
  }
}