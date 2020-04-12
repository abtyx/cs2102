const db = require("../utils/db");

module.exports.getCategories = async function(req, res) {
  const result = await db.any(`
    SELECT * FROM Categories;
  `);

  res.send(result);
};

module.exports.getAreas = async function(req, res) {
  const result = await db.any(`
    SELECT * FROM Area;
  `);

  res.send(result);
};

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
    SELECT F.id, F.name, F.price, F.maxLimit as "maxLimit", F.stock, R.username as "restUsername", R.name as "restName"
    FROM QueryFood F
    INNER JOIN 
    Restaurants R
    ON R.username = F.restUsername
    WHERE EXISTS (
      SELECT 1
      FROM CategoryFood
      WHERE foodItemId = F.id
    );
  `,
    [query, category]
  );

  res.send(result);
};
