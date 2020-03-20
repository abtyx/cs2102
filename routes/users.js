var pgp = require('pg-promise')({})
var db = pgp('postgres://ash:burn@localhost:5432/customers')

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  const id = req.params.name;
  db.any('SELECT * FROM names WHERE id = $1', id)
  .then(function (data) {
    console.log('DATA:', data[0].name)
    res.send(data);
  })
});

module.exports = router;
