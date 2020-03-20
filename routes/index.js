var pgp = require('pg-promise')({})
var db = pgp('postgres://ash:burn@localhost:5432/customers')

db.connect().then(obj => {
  console.log('connected')
}).catch(console.log)

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  db.one('SELECT * FROM names')
  .then(function (data) {
    console.log('DATA:', data.name)
  })
  res.render('index', { title: 'Express' });
});

module.exports = router;
