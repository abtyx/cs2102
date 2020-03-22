const db = require("../utils/db");

module.exports.users = async function(req, res) {
  const result = await db.any("SELECT * FROM users;");
  res.send(result);
};

module.exports.user = async function(req, res) {
  const result = await db.one(
    "SELECT * FROM users WHERE id = $1;",
    req.params.id
  );
  res.send(result);
};

module.exports.login = async function(req, res) {
  const { username, password } = req.body;
  const result = await db.one(
    `
    WITH ManagerUsers AS (
      SELECT U.id, 'manager' AS type FROM Managers M INNER JOIN Users U
      ON M.userId = U.id
    ),
    RiderUsers AS (
      SELECT U.id, 'rider' AS type FROM DeliveryRiders R INNER JOIN Users U
      ON R.userId = U.id
    ),
    RestaurantUsers AS (
      SELECT U.id, 'restaurant' AS type FROM Restaurants R INNER JOIN Users U
      ON R.userId = U.id
    ),
    CustomerUsers AS (
      SELECT U.id, 'customer' AS type FROM Customers C INNER JOIN Users U
      ON C.userId = U.id
    ),
    UserId AS (
      SELECT id FROM Users WHERE username = $1 AND password = $2 LIMIT 1
    )
    SELECT UI.id, type as userType FROM ManagerUsers MU INNER JOIN UserId UI ON MU.id = UI.id
    UNION
    SELECT UI.id, type as userType FROM CustomerUsers CU INNER JOIN UserId UI ON CU.id = UI.id
    UNION
    SELECT UI.id, type as userType FROM RiderUsers RU INNER JOIN UserId UI ON RU.id = UI.id
    UNION
    SELECT UI.id, type as userType FROM RestaurantUsers RU INNER JOIN UserId UI ON RU.id = UI.id
    `,
    [username, password]
  );
  res.send(result);
};
