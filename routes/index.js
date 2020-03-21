const express = require('express');
const router = express.Router();
const seedDbHandler = require('./seedDb');
const usersHandlers = require('./users');

/* GET home page. */

router.get('/users', usersHandlers.users);
router.get('/users/:id', usersHandlers.user);
router.get('/seed', seedDbHandler);

module.exports = router;
