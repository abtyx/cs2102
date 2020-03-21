const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

const seedDb = async () => {
  const buffer = await fs.readFile(
    path.resolve(__dirname, 'seeds', 'users.sql')
  );
  const contents = buffer.toString();

  return db.none(contents);
};

module.exports = seedDb;
