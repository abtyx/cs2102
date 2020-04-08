const db = require("../utils/db");

module.exports.login = async function(req, res) {
  const { username, password } = req.body;
  const result = await db.oneOrNone(
    `
    WITH AuthenticatedUser AS (
      SELECT username FROM Users
      WHERE username = $1 AND password = $2
    ),
    ManagerUsers AS (
      SELECT U.username, 'manager' AS userType FROM Managers M INNER JOIN AuthenticatedUser U
      ON M.username = U.username
    ),
    RiderUsers AS (
      SELECT U.username, 'rider' AS userType FROM DeliveryRiders R INNER JOIN AuthenticatedUser U
      ON R.username = U.username
    ),
    RestaurantUsers AS (
      SELECT U.username, 'restaurant' AS userType FROM Restaurants R INNER JOIN AuthenticatedUser U
      ON R.username = U.username
    ),
    CustomerUsers AS (
      SELECT U.username, 'customer' AS userType FROM Customers C INNER JOIN AuthenticatedUser U
      ON C.username = U.username
    )
    SELECT * FROM ManagerUsers
    UNION
    SELECT * FROM RiderUsers
    UNION
    SELECT * FROM RestaurantUsers
    UNION
    SELECT * FROM CustomerUsers;
    `,
    [username, password]
  );

  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.send(result);
};
