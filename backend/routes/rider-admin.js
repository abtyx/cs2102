const db = require("../utils/db");

module.exports.getRiderSummary = async function(req, res) {
  const { month, year } = req.query;
  const { username } = req.params;

  try {
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
    )
    SELECT (
      SELECT COUNT(*) FROM OrdersDelivered
    ) AS ordersDelivered,
    (
      SELECT * FROM TotalWorkHours
    ) AS TotalWorkHours,
    (
      SELECT * FROM TotalSalary
    ) AS totalSalary;
  `,
      { month, year, username }
    );
    res.send(result);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
