const db = require("../utils/db");

module.exports.getCustomers = async function(req, res) {
  const result = await db.any(`
    SELECT username, name, loyaltyPoints as "loyaltyPoints", signupDate as "signupDate"
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

  const customer = await db.oneOrNone(
    `
      SELECT username, name, loyaltyPoints as "loyaltyPoints", signupDate as "signupDate"
      FROM Customers
      WHERE username = $1;
    `,
    username
  );

  if (!customer) {
    res.sendStatus(404);
    return;
  }

  const orderAndReviews = await db.any(
    `
      SELECT 
        O.id,
        O.restUsername,
        O.custUsername,
        O.riderUsername,
        A.address,
        A.areaName,
        O.promotionCode,
        O.timeCreated,
        O.fee,
        O.status,
        O.timeCollection,
        O.timeArrival,
        O.timeDeparture,
        O.timeDelivered,
        O.modeOfPayment,
        RR.description AS restaurantReviewDescription,
        RR.rating AS restaurantReviewRating,
        RRT.description AS riderReviewDescription,
        RRT.rating AS riderReviewRating
      FROM Orders O
      INNER JOIN Addresses A
      ON O.addressId = A.id
      LEFT JOIN RestaurantReviews RR
      ON O.id = RR.orderId
      LEFT JOIN RiderReviews RRT
      ON O.id = RRT.orderId;
    `
  );

  const serializedOrders = orderAndReviews.map(order => ({
    id: order.id,
    restUsername: order.restusername,
    custUsername: order.custusername,
    address: order.address,
    areaName: order.areaname,
    promotionCode: order.promotionCode,
    timeCreated: order.timecreated,
    timeCollection: order.timecollection,
    timeDeparture: order.timedeparture,
    timeDelivered: order.timedelivered,
    fee: order.fee,
    status: order.status,
    modeOfPayment: order.modeofpayment,
    restaurantReview:
      order.restaurantreviewrating !== null
        ? {
            description: order.restaurantreviewdescription,
            rating: order.restaurantreviewrating
          }
        : null,
    riderReview:
      order.riderreviewrating !== null
        ? {
            description: order.riderreviewdescription,
            rating: order.riderreviewrating
          }
        : null
  }));

  res.send({
    ...customer,
    orders: serializedOrders
  });
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
