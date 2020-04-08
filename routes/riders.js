const db = require("../utils/db");

module.exports.getRiders = async function(req, res) {
  const result = await db.any(`
    WITH FullTimers AS (
      SELECT DR.username, 
        DR.name, 
        DR.bankAccount, 
        DR.contact,
        FR.monthlyBaseSalary as salary,
        'fulltime' AS type
      FROM DeliveryRiders DR
      INNER JOIN FullTimeRiders FR
      ON DR.username = FR.riderUsername
    ),
    PartTimers AS (
      SELECT DR.username, 
        DR.name, 
        DR.bankAccount, 
        DR.contact,
        PR.weeklyBaseSalary as salary,
        'parttime' AS type
      FROM DeliveryRiders DR
      INNER JOIN PartTimeRiders PR
      ON DR.username = PR.riderUsername
    )
    SELECT * FROM FullTimers
    UNION
    SELECT * FROM PartTimers;
  `);

  res.send(result);
};

module.exports.getRider = async function(req, res) {
  const username = req.params.username;
  if (!username) {
    res.sendStatus(404);
    return;
  }

  const rider = await db.oneOrNone(
    `
      WITH FullTimers AS (
        SELECT DR.username, 
          DR.name, 
          DR.bankAccount, 
          DR.contact,
          FR.monthlyBaseSalary as salary,
          'fulltime' AS type
        FROM DeliveryRiders DR
        INNER JOIN FullTimeRiders FR
        ON DR.username = riderUsername
        WHERE DR.username = $1
      ),
      PartTimers AS (
        SELECT DR.username, 
          DR.name, 
          DR.bankAccount, 
          DR.contact,
          PR.weeklyBaseSalary as salary,
          'parttime' AS type
        FROM DeliveryRiders DR
        INNER JOIN PartTimeRiders PR
        ON DR.username = riderUsername
        WHERE DR.username = $1
      )
      SELECT * FROM FullTimers
      UNION
      SELECT * FROM PartTimers
    `,
    username
  );

  if (!rider) {
    res.sendStatus(404);
    return;
  }

  res.send(rider);
};

module.exports.updateRider = async function(req, res) {
  const username = req.params.username;
  const { password, name, bankAccount, contact, salary } = req.body;

  const params = {
    username,
    name,
    password,
    bankAccount,
    contact,
    salary
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
          SELECT 1 FROM DeliveryRiders WHERE username = $(username)
        );
      `,
          params
        )
      );
    }

    if (name && bankAccount && contact) {
      updateTxs.push(
        t.none(
          `
        UPDATE DeliveryRiders
        SET name = $(name), bankAccount = $(bankAccount), contact = $(contact)
        WHERE username = $(username);
      `,
          params
        )
      );
    }

    if (salary !== undefined) {
      // Updating both tables should only update 1 of them, since
      // the constraint is such that a rider can only be either a
      // full timer or part timer
      updateTxs.push(
        t.none(
          `
            UPDATE PartTimeRiders
            SET weeklyBaseSalary = $(salary)
            WHERE riderUsername = $(username)
          `,
          params
        )
      );
      updateTxs.push(
        t.none(
          `
            UPDATE FullTimeRiders
            SET monthlyBaseSalary = $(salary)
            WHERE riderUsername = $(username)
          `,
          params
        )
      );
    }

    return t.batch(updateTxs);
  });

  res.send("OK");
};

module.exports.createRider = async function(req, res) {
  const {
    username,
    password,
    name,
    bankAccount,
    contact,
    salary,
    type
  } = req.body;

  const params = {
    username,
    password,
    name,
    bankAccount,
    contact,
    salary
  };

  await db.tx(t => {
    const txs = [];
    txs.push(
      t.none(
        `
      INSERT INTO Users (username, password)
      VALUES ($(username), $(password));
    `,
        params
      )
    );

    txs.push(
      t.none(
        `
      INSERT INTO DeliveryRiders (username, name, bankAccount, contact)
      VALUES ($(username), $(name), $(bankAccount), $(contact));
    `,
        params
      )
    );

    if (type === "fulltime") {
      txs.push(
        t.none(
          `
        INSERT INTO FullTimeRiders (riderUsername, monthlyBaseSalary)
        VALUES ($(username), $(salary));
      `,
          params
        )
      );
    } else if (type === "parttime") {
      txs.push(
        t.none(
          `
        INSERT INTO PartTimeRiders (riderUsername, weeklyBaseSalary)
        VALUES ($(username), $(salary));
      `,
          params
        )
      );
    } else {
      // invalid rider type, null this tx
      return;
    }

    return t.batch(txs);
  });

  res.send("OK");
};

module.exports.deleteRider = async function(req, res) {
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
        FROM DeliveryRiders
        WHERE username = $1
      );
    `,
    username
  );

  res.send("OK");
};
