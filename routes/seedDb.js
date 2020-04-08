const seedDb = require("../utils/seed");
const seedGen = require("../utils/seedgen");

module.exports.initialize = async function(req, res, next) {
  await seedDb();
  res.send("OK");
};

module.exports.seed = async function(req, res) {
  await seedGen();
  res.send("OK");
};
