const seedDb = require('../utils/seed');
module.exports = async function(req, res, next) {
  await seedDb();
  res.send('OK');
};
