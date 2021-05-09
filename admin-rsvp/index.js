const {Pool} = require('pg');
let pool;

exports.handler = async(event, context, callback) => {
    pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    });

    let attendanceData = await getAttendanceData();

    await pool.end();

    callback(null, {
        isBase64Encoded: false,
		statusCode: 200,
		body: JSON.stringify({
            attendancesData: attendanceData
        }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          }
    });

    async function getAttendanceData () {
        const query = 'SELECT rp.id, rsvp_id, person_id, p.name , meal_id, allergy, is_attending, covid_status ' +
            'FROM public.rsvp_person rp ' +
            'join people p on rp.person_id = p.id ' + 
            'where is_attending = true';
            
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