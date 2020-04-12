var pgp = require("pg-promise")({});
const db = pgp(process.env.DATABASE_URL);

class Database {
  // Executes a query that returns a variable number of rows.
  static any(query, parameters) {
    return db.any(query, parameters);
  }

  // Executes a query that returns one row.
  static one(query, parameters) {
    return db.one(query, parameters);
  }

  // Executes a query that returns one or no rows.
  static oneOrNone(query, parameters) {
    return db.oneOrNone(query, parameters);
  }

  // Executes a query that returns no rows.
  static none(query, parameters) {
    return db.none(query, parameters);
  }

  // Executes a task - a sequence of queries where the connection is shared
  // See pg-promise documentation for details on when this is used
  static task(callback) {
    return db.task(callback);
  }

  // Executes a batch of transactions.
  // See pg-promise documentation on how this is used
  static tx(callback) {
    return db.tx(callback);
  }
}

module.exports = Database;
