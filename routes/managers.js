const db = require("../utils/db");

module.exports.getManagers = async function(req, res) {
  const result = await db.any(`
    SELECT username
    FROM Managers;
  `);
  res.send(result);
};

module.exports.getManager = async function(req, res) {
  const username = req.params.username;
  const result = await db.oneOrNone(
    `
      SELECT username FROM Managers
      WHERE username = $1;
    `,
    username
  );

  if (!result) {
    res.sendStatus(404);
    return;
  }

  res.send(result);
};

module.exports.createManager = async function(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    req.sendStatus(400);
    return;
  }

  const params = [username, password];
  await db.tx(t => {
    const q1 = t.none(
      `
      INSERT INTO Users (username, password)
      VALUES ($1, $2);
    `,
      params
    );
    const q2 = t.none(
      `
      INSERT INTO Managers (username)
      VALUES ($1)
    `,
      params
    );
    return t.batch([q1, q2]);
  });

  res.send("OK");
};

module.exports.updateManager = async function(req, res) {
  const username = req.params.username;
  const { password } = req.body;

  await db.none(
    `
    UPDATE Users
    SET password = $2
    WHERE username = $1
    AND EXISTS(
      SELECT 1 FROM Managers WHERE username = $1
    )
  `,
    [username, password]
  );

  res.send("OK");
};

module.exports.deleteManager = async function(req, res) {
  const username = req.params.username;
  await db.none(
    `
      DELETE FROM Users
      WHERE username = $1
      AND EXISTS(
        SELECT 1
        FROM Managers 
        WHERE username = $1
      );
    `,
    username
  );

  res.send("OK");
};
