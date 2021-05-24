const {Pool} = require('pg');
let pool;

exports.handler = async(event, context, callback) => {
    console.log(event);
    pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    });

    //pass in variable into get guests info from the query parameters
    let adminCondition = event.queryStringParameters.adminCondition;
    console.log(adminCondition);
    let guestsData = await getGuestsData(adminCondition);

    await pool.end();

    callback(null, {
        isBase64Encoded: false,
		statusCode: 200,
		body: JSON.stringify({
            guestsData: guestsData
        }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          }
    });

    async function getGuestsData (adminCondition) { 
        const query = 'SELECT rp.id, rsvp_id, person_id, p.name , rp.meal_id, meals.name as MealName, allergy, is_attending, covid_status ' +
            'FROM public.rsvp_person rp ' +
            'join people p on rp.person_id = p.id ' + 
            'left join meals on rp.meal_id = meals.id '+
            (adminCondition === 'no respond' ? 'where is_attending IS NULL;' : `where is_attending= ${adminCondition}`);

        let data;
        try {
            data = (await pool.query(query)).rows;
        } catch (err) {
            if (err){
                throw new Error(`Ooops... ${err}`);
            }
        }
        return data;
    }
}