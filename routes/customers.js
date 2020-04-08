const db = require("../utils/db");

module.exports.getCustomers = async function(req, res) {
  const result = await db.any(`
    SELECT username, name, loyaltyPoints, signupDate
    FROM Customers;
  `);
  res.send(result);
};

module.exports.getCustomer = async function(req, res) {
  const username = req.params.username;
  if (!username) {
    res.sendStatus(404);
    return;
  }

  const result = await db.oneOrNone(
    `
      SELECT username, name, loyaltyPoints, signupDate
      FROM Customers;
    `,
    username
  );

  if (!result) {
    res.sendStatus(404);
    return;
  }

  res.send(result);
};

module.exports.createCustomer = async function(req, res) {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
    res.sendStatus(400);
    return;
  }

  const params = [username, password, name];
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
      INSERT INTO Customers (username, name, loyaltyPoints, signupDate)
      VALUES ($1, $3, 0, NOW()::timestamp);
    `,
      params
    );
    return t.batch([q1, q2]);
  });

  res.send("OK");
};

module.exports.updateCustomer = async function(req, res) {
  const username = req.params.username;
  const { password, name } = req.body;

  const params = {
    username,
    name,
    password
  };
  await db.tx(t => {
    const updateTxs = [];
    if (password) {
      // update password
      updateTxs.push(
        t.none(
          `
      UPDATE Users
      SET password = $(password)
      WHERE username = $(username)
      AND EXISTS(
        SELECT 1 FROM Customers WHERE username = $(username)
      );
    `,
          params
        )
      );
    }
    if (name) {
      updateTxs.push(
        t.none(
          `
      UPDATE Customers
      SET name = $(name)
      WHERE username = $(username);
    `,
          params
        )
      );
    }
    return t.batch(updateTxs);
  });

  res.send("OK");
};

module.exports.deleteCustomer = async function(req, res) {
  const username = req.params.username;
  if (!username) {
    res.sendStatus(404);
    return;
  }

  await db.none(
    `
    DELETE FROM Users
    WHERE username = $1
    AND EXISTS(
      SELECT 1
      FROM Customers
      WHERE username = $1
    );
  `,
    username
  );

  res.send("OK");
};
