import Knex from 'knex';


export default callback => {

  const pg = new Knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_DB,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    },
    searchPath: ['status_page'],
  });

	// connect to a database if needed, then pass it to `callback`:
	callback(pg);
}
