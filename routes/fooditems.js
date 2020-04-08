const db = require("../utils/db");

module.exports.foodSearch = async function(req, res) {
  const { query, category } = req.query;

  const result = await db.any(
    `
    WITH QueryFood AS (
      SELECT *
      FROM FoodItems
      WHERE name ILIKE '%$1:value%'
    ),
    CategoryFood AS (
      SELECT foodItemId
      FROM FoodItemBelongsTo
      WHERE categoryName = $2
    )
    SELECT id, name, price, maxLimit, stock, restUsername
    FROM QueryFood
    WHERE EXISTS (
      SELECT 1
      FROM CategoryFood
      WHERE foodItemId = QueryFood.id
    );
  `,
    [query, category]
  );

  res.send(result);
};
