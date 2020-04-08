const db = require("../utils/db");

module.exports.getRestaurantSummary = async function(req, res) {
  const { username } = req.params;
  const { month, year } = req.query;
  const result = await db.one(
    `
    WITH MonthOrders AS (
      SELECT *
      FROM Orders
      WHERE EXTRACT(MONTH FROM timeCreated) = $(month)
      AND EXTRACT(YEAR FROM timeCreated) = $(year)
      AND restUsername = $(username)
    ),
    MonthOrderItems AS (
      SELECT foodId, SUM(qty) as qty, AVG(pricePerQty) as price_per_qty
      FROM OrderItems
      WHERE EXISTS(
        SELECT 1
        FROM MonthOrders
        WHERE OrderItems.orderId = id
      )
      GROUP BY foodId
    )
    SELECT (
      SELECT COUNT(*)
      FROM MonthOrders
    ) AS orderCount, (
      SELECT COALESCE(SUM(qty * price_per_qty), 0)
      FROM MonthOrderItems
    ) AS totalCost;
  `,
    { username, month, year }
  );

  const topOrders = await db.any(
    `
    WITH MonthOrders AS (
      SELECT *
      FROM Orders
      WHERE EXTRACT(MONTH FROM timeCreated) = $(month)
      AND EXTRACT(YEAR FROM timeCreated) = $(year)
      AND restUsername = $(username)
    ),
    MonthOrderItems AS (
      SELECT foodId, SUM(qty) as qty, AVG(pricePerQty) as price_per_qty
      FROM OrderItems
      WHERE EXISTS(
        SELECT 1
        FROM MonthOrders
        WHERE OrderItems.orderId = id
      )
      GROUP BY foodId
    )
    SELECT F.id, F.name, F.price, M.qty FROM MonthOrderItems M
    INNER JOIN FoodItems F
    ON F.id = foodId
    ORDER BY qty DESC
    LIMIT 5 
  `,
    { username, month, year }
  );

  console.log(result);
  console.log(topOrders);

  const clientResult = {
    orderCount: result.ordercount,
    totalCost: result.totalcost,
    topSellers: topOrders
  };

  res.send(clientResult);
};

module.exports.getRestaurantPromotions = async function(req, res) {
  const { username } = req.params;
  const result = await db.any(
    `
    SELECT PC.code, RP.restUsername, RP.minOrder, PC.name,
      PC.description, PC.startDate, PC.endDate,
      D.type, D.value
    FROM RestaurantPromotions RP
    INNER JOIN PromotionCampaigns PC
    ON RP.campaignCode = PC.code
    INNER JOIN Discounts D
    ON PC.discountId = D.id
    WHERE restUsername = $1
  `,
    username
  );

  res.send(result);
};

module.exports.getRestaurantPromotion = async function(req, res) {
  const { username, promoCode } = req.params;
  const result = await db.oneOrNone(
    `
    SELECT PC.code, RP.restUsername, RP.minOrder, PC.name,
      PC.description, PC.startDate, PC.endDate,
      D.type, D.value,
      (
        SELECT COUNT(*)
        FROM Orders
        WHERE restUsername = $1
        AND timeCreated >= RP.startDate
        AND timeCreated <= RP.endDate
      ) AS orderCount
    FROM RestaurantPromotions RP
    INNER JOIN PromotionCampaigns PC
    ON RP.campaignCode = PC.code
    INNER JOIN Discounts D
    ON PC.discountId = D.id
    WHERE restUsername = $1 AND
        PC.code = $2;
  `,
    [username, promoCode]
  );

  res.send(result);
};
