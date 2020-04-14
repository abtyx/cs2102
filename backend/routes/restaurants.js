const db = require("../utils/db");

module.exports.getRestaurants = async function(req, res) {
  const result = await db.any(`
    SELECT username, name, minOrder as "minOrder"
    FROM Restaurants;
  `);

  res.send(result);
};

module.exports.getRestaurant = async function(req, res) {
  const username = req.params.username;
  if (!username) {
    res.sendStatus(404);
    return;
  }

  const restaurant = await db.oneOrNone(
    `
      SELECT 
        username, 
        name, 
        minOrder as "minOrder"
      FROM Restaurants
      WHERE username = $1
    `,
    username
  );

  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  const foodItems = await db.any(
    `
      SELECT
        id,
        name,
        price,
        maxLimit as "maxLimit",
        stock
      FROM FoodItems
      WHERE restUsername = $1
    `,
    username
  );

  const ordersAndReviews = await db.any(
    `
    SELECT
      O.id,
      O.status,
      RR.description as "reviewDescription",
      RR.rating as "reviewRating"
    FROM Orders O
    LEFT JOIN RestaurantReviews RR
    ON O.id = RR.orderId
    WHERE restUsername = $1;
  `,
    username
  );

  for (let obj of ordersAndReviews) {
    const orderItems = await db.any(
      `
      SELECT
        foodId as "foodId",
        orderId as "orderId",
        qty,
        pricePerQty as "pricePerQty"
      FROM OrderItems
      WHERE orderId = $1;
    `,
      obj.id
    );

    obj.orderItems = orderItems;
  }

  res.send({
    ...restaurant,
    foodItems,
    orders: ordersAndReviews
  });
};

module.exports.updateRestaurant = async function(req, res) {
  const username = req.params.username;
  const { password, name, minOrder } = req.body;

  const params = {
    username,
    password,
    name,
    minOrder
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
          SELECT 1 FROM Restaurants WHERE username = $(username)
        );
      `,
          params
        )
      );
    }

    if (name && minOrder) {
      updateTxs.push(
        t.none(
          `
        UPDATE Restaurants
        SET name = $(name), minOrder = $(minOrder)
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

module.exports.createRestaurant = async function(req, res) {
  const { username, password, name, minOrder } = req.body;
  if (!username || !name || minOrder === undefined) {
    res.sendStatus(400);
    return;
  }

  const params = [username, password, name, minOrder];
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
      INSERT INTO Restaurants (username, name, minOrder)
      VALUES ($1, $3, $4);
    `,
      params
    );

    return t.batch([q1, q2]);
  });

  res.send("OK");
};

module.exports.deleteRestaurant = async function(req, res) {
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
        FROM Restaurants
        WHERE username = $1
      );
    `,
    username
  );

  res.send("OK");
};
