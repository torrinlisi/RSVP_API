const { Pool } = require('pg');
let pool;

exports.handler = async (event, context, callback) => {
	pool = new Pool({
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: process.env.PGPORT
	});

  let rsvpData = await getRSVPData(event.queryStringParameters.rsvpCode);

  let  mealData = await getMealData();

  await pool.end();

	callback(null, {
		isBase64Encoded: false,
		statusCode: 200,
		body: JSON.stringify({
      rsvpData: rsvpData,
      meals: mealData
    })
	}); 
}

async function getRSVPData(code) {
  const query = 'select * from rsvp ' +
    'join rsvp_person on rsvp.id = rsvp_person.rsvp_id ' +
    'join people on rsvp_person.person_id = people.id ' +
    `where code='${code}'`;

  let data;
  try {
    data = (await pool.query(query)).rows;
  } catch (err) {
    if (err) {
      throw new Error(`Something went wrong... ${err}`);
    }
  }

  return data;
}

async function getMealData() {
  const query = 'select * from meals'

  let data;
  try {
    data = (await pool.query(query)).rows;
  } catch (err) {
    if (err) {
      throw new Error(`Something went wrong... ${err}`);
    }
  }

  return data;
}