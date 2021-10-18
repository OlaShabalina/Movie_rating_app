  // Loading and initializing the library:
  const pgp = require('pg-promise')();

  // Preparing the connection details:
  const cn = {
    connectionString: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/movie_rating_db`,
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
  }
  
  // Creating a new database instance from the connection details:
  const db = pgp(cn);

  // Exporting the database object for shared use:
  module.exports = db;