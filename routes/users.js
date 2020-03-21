const db = require('../utils/db');

module.exports.users = async function(req, res) {
  const result = await db.any('SELECT * FROM users;');
  res.send(result);
};

module.exports.user = async function(req, res) {
  const result = await db.one(
    'SELECT * FROM users WHERE id = $1;',
    req.params.id
  );
  res.send(result);
};
