const express = require("express");
const wrap = require("./wrap");
const router = express.Router();
const seedDbHandler = require("./seedDb");
const usersHandlers = require("./users");

/* GET home page. */

router.get("/users", wrap(usersHandlers.users));
router.get("/users/:id", wrap(usersHandlers.user));
router.post("/login", wrap(usersHandlers.login));
router.get("/seed", wrap(seedDbHandler));

module.exports = router;
