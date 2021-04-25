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
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
	}); 
}

async function getRSVPData(code) {
  const query = 'select rsvp_person.*, rsvp.responded, people.name, people.age, meals.name as mealName from rsvp ' +
    'join rsvp_person on rsvp.id = rsvp_person.rsvp_id ' +
    'join people on rsvp_person.person_id = people.id ' +
    'left join meals on rsvp_person.meal_id = meals.id ' +
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