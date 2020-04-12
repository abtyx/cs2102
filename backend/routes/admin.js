const db = require("../utils/db");

module.exports.getAdminSummary = async function(req, res) {
  const { month, year } = req.query;
  const result = await db.oneOrNone(
    `
    WITH NewCustomerCount AS (
      SELECT COUNT(*)
      FROM Customers
      WHERE EXTRACT(MONTH FROM signupDate) = $1
      AND EXTRACT(YEAR FROM signupDate) = $2
    ),
    MonthOrders AS (
      SELECT *
      FROM Orders
      WHERE EXTRACT(MONTH FROM timeCreated) = $1
      AND EXTRACT(YEAR FROM timeCreated) = $2
    ),
    MonthOrderItems AS (
      SELECT *
      FROM OrderItems
      WHERE EXISTS(
        SELECT 1
        FROM MonthOrders
        WHERE OrderItems.orderId = id
      ) 
    )
    SELECT (
      SELECT count AS "newCustomerCount" FROM NewCustomerCount
    ), (
      SELECT COUNT(*) AS "orderCount" FROM MonthOrders
    ), COALESCE(SUM(MOI.qty * MOI.pricePerQty), 0) as "totalCost"
    FROM MonthOrderItems MOI
  `,
    [month, year]
  );

  res.send({
    newCustomerCount: result.newCustomerCount,
    orderCount: result.orderCount,
    totalOrderCost: result.totalCost
  });
};

module.exports.getCustomerInformation = async function(req, res) {
  const username = req.params.username;
  const { month, year } = req.query;

  const result = await db.one(
    `
    WITH OrdersByCust AS (
      SELECT *
      FROM Orders
      WHERE EXTRACT(MONTH FROM timeCreated) = $2
      AND EXTRACT(YEAR FROM timeCreated) = $3
      AND custUsername = $1
    ),
    OrderItemsByCust AS (
      SELECT *
      FROM OrderItems
      WHERE EXISTS(
        SELECT 1
        FROM OrdersByCust
        WHERE OrderItems.orderId = id
      ) 
    )
    SELECT 
      (SELECT COUNT(*) FROM OrdersByCust) AS "orderCount", 
      COALESCE(SUM(qty * pricePerQty), 0) AS "totalCost"
    FROM OrderItemsByCust;
  `,
    [username, month, year]
  );

  res.send(result);
};

module.exports.getAreaSummary = async function(req, res) {
  // date in 'YYYY-MM-DD' format
  // hour in 0-24 format
  const { hour, date, area } = req.query;

  const start = `${date} ${parseInt(hour)}:00:00`;
  const end = `${date} ${parseInt(hour) + 1}:00:00`;
  const result = await db.one(
    `
    WITH QueriedOrders AS (
      SELECT *
      FROM Orders
      WHERE timeCreated >= $1
      AND timeCreated <= $2
    )
    SELECT COUNT(*) FROM QueriedOrders QO
    INNER JOIN Addresses A
    ON QO.addressId = A.id
    WHERE A.areaName = $3
  `,
    [start, end, area]
  );

  res.send(result);
};

module.exports.getRiderSummary = async function(req, res) {
  const { month, year } = req.query;
  const { username } = req.params;

  const result = await db.one(
    `
    WITH OrdersDelivered AS (
      SELECT *
      FROM Orders
      WHERE EXTRACT(MONTH FROM timeCreated) = $(month)
      AND EXTRACT(YEAR FROM timeCreated) = $(year)
      AND riderUsername = $(username)
    ),
    TotalWorkHours AS (
      SELECT COALESCE(SUM(EXTRACT(HOUR from endDate) - EXTRACT(HOUR from startDate)), 0)
      FROM WorkSchedules
      WHERE EXTRACT(MONTH FROM startDate) = $(month)
      AND EXTRACT(YEAR FROM startDate) = $(year)
      AND riderUsername = $(username)
    ),
    TotalSalary AS (
      SELECT COALESCE(SUM(amount), 0)
      FROM Wages
      WHERE EXTRACT(MONTH FROM createdAt) = $(month)
      AND EXTRACT(YEAR FROM createdAt) = $(year)
      AND riderUsername = $(username)
    ),
    RatingsReceived AS (
      SELECT COUNT(*), COALESCE(AVG(rating), 0) AS avg
      FROM RiderReviews RR
      INNER JOIN OrdersDelivered O
      ON RR.orderId = O.id
      WHERE O.riderUsername = $(username)
    )
    SELECT (
      SELECT COUNT(*) FROM OrdersDelivered
    ) AS "ordersDelivered",
    (
      SELECT * FROM TotalWorkHours
    ) AS "totalWorkHours",
    (
      SELECT * FROM TotalSalary
    ) AS "totalSalary",
    (
      SELECT COALESCE(AVG(EXTRACT(MINUTE FROM timeDelivered - timeCreated)), 0)
      FROM OrdersDelivered
    ) AS "averageDeliveryTime",
    count as "ratingCount",
    avg as "averageRating"
    FROM RatingsReceived;
  `,
    { month, year, username }
  );

  res.send(result);
};
