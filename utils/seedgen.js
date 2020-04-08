const faker = require("faker");
const mom = require("moment");
const db = require("./db");
const seedDb = require("./seed");

const fmtTimestamp = date => mom(date).format("YYYY-MM-DD HH:mm:ss");
const fmtDate = date => mom(date).format("YYYY-MM-DD");
const range = i => [...Array(i).keys()];
const srange = (i, j) => [...Array(j - i).keys()].map(x => x + i);
const genCC = i => {
  return [...Array(4)]
    .map(_ => {
      const n = `${faker.random.number(999)}${i}`;
      return `000${n}`.slice(-4);
    })
    .join("");
};

class User {
  constructor(id) {
    this.id = id;
    this.name = faker.name.firstName();
    this.password = "password";
  }

  get username() {
    return `${this.name.toLowerCase()}${this.id}`;
  }

  get manager() {
    return {
      id: this.id,
      username: this.username
    };
  }

  get customer() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      loyaltyPoints: faker.random.number(),
      signupDate: fmtTimestamp(faker.date.past()),
      addresses: range(faker.random.number({ min: 1, max: 7 })).map(_ =>
        faker.address.streetAddress(true)
      ),
      creditCards: range(faker.random.number({ min: 1, max: 5 })).map(i => ({
        custUsername: this.username,
        number: genCC(i),
        cvv: `00${faker.random.number(999)}`.slice(-3),
        name: this.name,
        expiry: fmtDate(
          mom()
            .add(faker.random.number({ min: 1, max: 5 }), "years")
            .add(faker.random.number(12), "months")
        )
      }))
    };
  }

  get rider() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      bankAccount: faker.finance.account(),
      contact: faker.phone.phoneNumber()
    };
  }

  generateWages(fixedWage) {
    const fee = 3.5;
    return range(faker.random.number(20)).map(i => {
      const isBigPay = i % 5 === 0;
      return {
        riderUsername: this.username,
        amount: isBigPay ? fixedWage : fee,
        isPaidOut: faker.random.boolean(),
        createdAt: fmtTimestamp(faker.date.past())
      };
    });
  }

  generateWorkmonthFT() {
    const startDOW = faker.random.number(2); // start on 0th - 2nd day
    const workingDays = range(5).map(x => x + startDOW);
    const startDate = mom()
      .subtract(1, "month")
      .subtract(mom().day())
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    const ws = workingDays.reduce((ws, dow) => {
      // 2 workshifts of 4 hours each
      // at least 1 hour in between break
      // means latest start hour is 1pm: 1-5pm, 6-10pm
      const startHour = faker.random.number({ min: 10, max: 13 });
      const endHour = startHour + 4;
      // check hours to end of day minus 1 hour mandatory break + 4 hours ws
      const hoursLeft = 22 - endHour - 5;
      const offset = faker.random.number(hoursLeft);
      const startHourTwo = endHour + 1 + offset;
      const endHourTwo = startHourTwo + 4;

      // fill in only one month of ws before today
      for (let i = 0; i < 4; i++) {
        const date = startDate
          .clone()
          .day(dow)
          .add(i * 7, "days");
        const start = date.clone().hours(startHour);
        const end = date.clone().hours(endHour);

        ws.push({
          riderUsername: this.username,
          startDate: fmtTimestamp(start),
          endDate: fmtTimestamp(end)
        });

        ws.push({
          riderUsername: this.username,
          startDate: fmtTimestamp(date.clone().hours(startHourTwo)),
          endDate: fmtTimestamp(date.clone().hours(endHourTwo))
        });
      }

      return ws;
    }, []);

    return ws;
  }

  get fulltimeRider() {
    const wage = faker.finance.amount() * 4;
    return {
      ...this.rider,
      monthlyBaseSalary: wage,
      workSchedules: this.generateWorkmonthFT(),
      wages: this.generateWages(wage)
    };
  }

  get parttimeRider() {
    const wage = faker.finance.amount();
    return {
      ...this.rider,
      weeklyBaseSalary: wage,
      workSchedules: this.generateWorkmonthFT(),
      wages: this.generateWages(wage)
    };
  }

  generateFood() {
    const maxLimit = faker.random.number({ min: 10, max: 100 });
    return {
      name: `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
      price: faker.finance.amount(5, 20, 2),
      maxLimit,
      stock: maxLimit - faker.random.number({ min: 0, max: maxLimit }),
      restUsername: this.username
    };
  }

  get restaurant() {
    const restName = `${
      this.name
    }'s ${faker.company.catchPhraseAdjective().toLowerCase()} Restaurant`;
    return {
      name: restName,
      username: this.username,
      minOrder: faker.finance.amount(0, 10, 2),
      menu: range(faker.random.number({ min: 2, max: 10 })).map(_ =>
        this.generateFood()
      )
    };
  }
}

const MANAGER_COUNT = 10;
const CUSTOMER_COUNT = 500;
const FT_RIDER_COUNT = 50;
const PT_RIDER_COUNT = 50;
const RESTAURANT_COUNT = 50;
const TOTAL_USER_COUNT =
  MANAGER_COUNT +
  CUSTOMER_COUNT +
  FT_RIDER_COUNT +
  PT_RIDER_COUNT +
  RESTAURANT_COUNT;

const PROMO_COUNT = 1000;
const ORDER_COUNT = 1000;

const generate = async () => {
  // seed with tables first
  await seedDb();
  console.log("DB wiped and re-initialized.");

  // Generate users
  const users = [];
  for (let i = 0; i < TOTAL_USER_COUNT; i++) {
    users[i] = new User(i);
  }

  await db.tx(t => {
    const txArr = users.map(u =>
      t.none(
        `
      INSERT INTO Users (username, password)
      VALUES ($1, $2);
    `,
        [u.username, u.password]
      )
    );

    return t.batch(txArr);
  });

  console.log("Users seeded.");

  const managers = [];
  for (let i = 0; i < MANAGER_COUNT; i++) {
    managers[i] = users[i].manager;
  }

  await db.tx(t => {
    const txArr = managers.map(m =>
      t.none(
        `
      INSERT INTO Managers (username)
      VALUES ($1);
    `,
        m.username
      )
    );

    return t.batch(txArr);
  });

  console.log("Managers seeded.");

  const areas = ["West", "Central", "East", "South", "North", "Tekong"];

  await db.tx(t => {
    const txArr = areas.map(a =>
      t.none(
        `
      INSERT INTO Area (name) VALUES ($1);
    `,
        a
      )
    );
    return t.batch(txArr);
  });

  const customers = [];
  for (let i = 0; i < CUSTOMER_COUNT; i++) {
    const j = i + managers.length;
    customers[i] = users[j].customer;
  }

  await db.tx(t => {
    const txArr = [];

    customers.forEach(m => {
      txArr.push(
        t.none(
          `
        INSERT INTO Customers (username, name, loyaltyPoints, signupDate)
        VALUES ($1, $2, $3, $4);
      `,
          [m.username, m.name, m.loyaltyPoints, m.signupDate]
        )
      );

      m.addresses.forEach(a => {
        txArr.push(
          t.none(
            `
          INSERT INTO Addresses (custUsername, areaName, address)
          VALUES ($1, $2, $3)
        `,
            [m.username, faker.random.arrayElement(areas), a]
          )
        );
      });

      m.creditCards.forEach(cc => {
        txArr.push(
          t.none(
            `
            INSERT INTO CreditCards (custUsername, number, name, expiry, cvv)
            VALUES ($1, $2, $3, $4, $5)
          `,
            [cc.custUsername, cc.number, cc.name, cc.expiry, cc.cvv]
          )
        );
      });
    });

    return t.batch(txArr);
  });

  console.log("Customers seeded.");

  const ftRiders = [];
  const ptRiders = [];
  for (let i = 0; i < FT_RIDER_COUNT; i++) {
    const j = i + managers.length + customers.length;
    ftRiders[i] = users[j].fulltimeRider;
  }
  for (let i = 0; i < PT_RIDER_COUNT; i++) {
    const j = i + managers.length + customers.length + ftRiders.length;
    ptRiders[i] = users[j].parttimeRider;
  }

  await db.tx(t => {
    const txArr = [];
    ftRiders.forEach(r => {
      txArr.push(
        t.none(
          `
        INSERT INTO DeliveryRiders (username, name, bankAccount, contact)
        VALUES ($1, $2, $3, $4)
      `,
          [r.username, r.name, r.bankAccount, r.contact]
        )
      );
      txArr.push(
        t.none(
          `
        INSERT INTO FullTimeRiders (riderUsername, monthlyBaseSalary)
        VALUES ($1, $2)
      `,
          [r.username, r.monthlyBaseSalary]
        )
      );
      r.workSchedules.forEach(ws => {
        txArr.push(
          t.none(
            `
          INSERT INTO WorkSchedules (riderUsername, startDate, endDate)
          VALUES ($1, $2, $3)
        `,
            [r.username, ws.startDate, ws.endDate]
          )
        );
      });

      r.wages.forEach(w => {
        txArr.push(
          t.none(
            `
            INSERT INTO Wages (riderUsername, amount, isPaidOut, createdAt)
            VALUES ($1, $2, $3, $4)
          `,
            [r.username, w.amount, w.isPaidOut, w.createdAt]
          )
        );
      });
    });
    ptRiders.forEach(r => {
      txArr.push(
        t.none(
          `
        INSERT INTO DeliveryRiders (username, name, bankAccount, contact)
        VALUES ($1, $2, $3, $4)
      `,
          [r.username, r.name, r.bankAccount, r.contact]
        )
      );
      txArr.push(
        t.none(
          `
        INSERT INTO PartTimeRiders (riderUsername, weeklyBaseSalary)
        VALUES ($1, $2)
      `,
          [r.username, r.weeklyBaseSalary]
        )
      );
      r.workSchedules.forEach(ws => {
        txArr.push(
          t.none(
            `
          INSERT INTO WorkSchedules (riderUsername, startDate, endDate)
          VALUES ($1, $2, $3)
        `,
            [r.username, ws.startDate, ws.endDate]
          )
        );
      });
      r.wages.forEach(w => {
        txArr.push(
          t.none(
            `
            INSERT INTO Wages (riderUsername, amount, isPaidOut, createdAt)
            VALUES ($1, $2, $3, $4)
          `,
            [r.username, w.amount, w.isPaidOut, w.createdAt]
          )
        );
      });
    });

    return t.batch(txArr);
  });

  console.log("Riders seeded. (+ WS and wages)");

  const categories = [
    "Western",
    "Chinese",
    "Healthy",
    "Japanese",
    "Korean",
    "Indian",
    "Spicy",
    "Fusion"
  ];

  await db.tx(t => {
    const txArr = categories.map(name =>
      t.none(
        `
      INSERT INTO Categories (name)
      VALUES ($1);
    `,
        name
      )
    );

    return t.batch(txArr);
  });

  console.log("Categories seeded.");

  const rests = [];
  for (let i = 0; i < RESTAURANT_COUNT; i++) {
    const j =
      i +
      managers.length +
      customers.length +
      ftRiders.length +
      ptRiders.length;
    rests[i] = users[j].restaurant;
  }

  await db.tx(t => {
    const txArr = [];
    rests.forEach(r => {
      txArr.push(
        t.none(
          `
        INSERT INTO Restaurants (username, name, minOrder)
        VALUES ($1, $2, $3)
      `,
          [r.username, r.name, r.minOrder]
        )
      );

      r.menu.forEach(f => {
        txArr.push(
          t.none(
            `
          INSERT INTO FoodItems (name, price, maxLimit, stock, restUsername)
          VALUES ($1, $2, $3, $4, $5)
        `,
            [f.name, f.price, f.maxLimit, f.stock, f.restUsername]
          )
        );
      });
    });

    return t.batch(txArr);
  });

  console.log("Restaurants seeded. (+ food items)");

  const { count: rawFoodCount } = await db.one(
    `SELECT COUNT(*) FROM FoodItems;`
  );
  const foodItemCount = parseInt(rawFoodCount);

  await db.tx(t => {
    const txArr = [];
    for (let i = 0; i < foodItemCount * 2; i++) {
      txArr.push(
        t.none(
          `
        INSERT INTO FoodItemBelongsTo (foodItemId, categoryName)
        VALUES ($1, $2)
      `,
          [
            faker.random.number({ min: 1, max: foodItemCount }),
            faker.random.arrayElement(categories)
          ]
        )
      );
    }

    t.batch(txArr);
  });

  console.log("FoodItemBelongsTo seeded.");

  const discounts = [];
  for (let i = 0; i < PROMO_COUNT; i++) {
    const b = faker.random.boolean();
    const discountType = b ? "flat" : "percent";
    const value = b
      ? faker.random.number({ min: 2, max: 10 })
      : faker.random.number({ min: 10, max: 50 });

    discounts.push({
      discountType,
      value
    });
  }

  await db.tx(t => {
    const txArr = discounts.map(d =>
      t.none(
        `
      INSERT INTO Discounts (type, value) VALUES ($1, $2);
    `,
        [d.discountType, d.value]
      )
    );

    return t.batch(txArr);
  });

  const promos = [];
  for (let i = 0; i < PROMO_COUNT; i++) {
    const code = `${faker.random.alphaNumeric(4)}${`000${i}`.slice(-4)}`;
    const discountId = i + 1;
    const name = `${faker.company.companyName()} Promotion`;
    const description = faker.lorem.sentence();
    const startDate = mom()
      .hours(0)
      .minutes(0)
      .milliseconds(0)
      .add(faker.random.number({ min: -1000, max: 1000 }), "days");
    const endDate = startDate
      .clone()
      .add(faker.random.number({ min: 2, max: 5 }), "days");

    promos.push({
      code,
      discountId,
      name,
      description,
      startDate: fmtTimestamp(startDate),
      endDate: fmtTimestamp(endDate)
    });
  }

  await db.tx(t => {
    const txArr = promos.map(p =>
      t.none(
        `
      INSERT INTO PromotionCampaigns
      (code, discountId, name, description, startDate, endDate)
      VALUES
      ($(code), $(discountId), $(name), $(description), $(startDate), $(endDate))
    `,
        p
      )
    );

    return t.batch(txArr);
  });

  const restPromos = [];
  for (let i = 0; i < PROMO_COUNT / 3; i++) {
    const rest = faker.random.arrayElement(rests);
    const promoMinOrder =
      parseFloat(rest.minOrder) + parseFloat(faker.finance.amount(2, 10));
    restPromos.push({
      campaignCode: promos[i].code,
      restUsername: rest.username,
      minOrder: promoMinOrder
    });
  }

  await db.tx(t => {
    const txArr = restPromos.map(p =>
      t.none(
        `
      INSERT INTO RestaurantPromotions
      (campaignCode, restUsername, minOrder)
      VALUES
      ($(campaignCode), $(restUsername), $(minOrder))
    `,
        p
      )
    );

    return t.batch(txArr);
  });

  const fcPromos = [];
  for (let i = 0; i < PROMO_COUNT / 3; i++) {
    fcPromos.push({
      campaignCode: promos[i + restPromos.length].code
    });
  }

  await db.tx(t => {
    const txArr = fcPromos.map(p =>
      t.none(
        `
      INSERT INTO FirstCustomerPromotions
      (campaignCode)
      VALUES
      ($(campaignCode))
    `,
        p
      )
    );

    return t.batch(txArr);
  });

  const rcPromos = [];
  for (let i = 0; i < PROMO_COUNT - fcPromos.length - restPromos.length; i++) {
    rcPromos.push({
      campaignCode: promos[i + restPromos.length + fcPromos.length].code,
      daysWithoutOrder: faker.random.number({ min: 10, max: 100 })
    });
  }

  await db.tx(t => {
    const txArr = rcPromos.map(p =>
      t.none(
        `
      INSERT INTO ReturningCustomerPromotions
      (campaignCode, daysWithoutOrder)
      VALUES
      ($(campaignCode), $(daysWithoutOrder))
    `,
        p
      )
    );

    return t.batch(txArr);
  });

  const orders = [];
  const riders = ftRiders.concat(ptRiders);
  for (let i = 0; i < 1000; i++) {
    const rest = faker.random.arrayElement(rests);
    const rider = faker.random.arrayElement(riders);
    const customer = faker.random.arrayElement(customers);
    const addresses = (
      await db.any(
        "SELECT id FROM Addresses WHERE custUsername = $1",
        customer.username
      )
    ).map(x => x.id);
    const addressId = faker.random.arrayElement(addresses);
    const isUsingPromo = faker.random.boolean();
    const promoCode = isUsingPromo
      ? faker.random.arrayElement(promos).code
      : null;

    const timeCreated = mom(faker.date.past()).hour(
      faker.random.number({ min: 10, max: 21 })
    );
    const timeCollection = timeCreated
      .clone()
      .add(faker.random.number({ min: 3, max: 10 }), "minutes");
    const timeArrival = timeCollection
      .clone()
      .add(faker.random.number({ min: 2, max: 8 }), "minutes");
    const timeDeparture = timeArrival
      .clone()
      .add(faker.random.number({ min: 1, max: 5 }), "minutes");
    const timeDelivered = timeDeparture
      .clone()
      .add(faker.random.number({ min: 5, max: 20 }), "minutes");
    const modeOfPayment = faker.random.boolean() ? "card" : "cash";
    const status = "done";
    const fee = faker.finance.amount(2, 5, 2);

    const order = {
      restUsername: rest.username,
      custUsername: customer.username,
      riderUsername: rider.username,
      addressId: addressId,
      promotionCode: promoCode,
      timeCreated: fmtTimestamp(timeCreated),
      timeArrival: fmtTimestamp(timeArrival),
      timeCollection: fmtTimestamp(timeCollection),
      timeDeparture: fmtTimestamp(timeDeparture),
      timeDelivered: fmtTimestamp(timeDelivered),
      fee: fee,
      status,
      modeOfPayment,
      items: {}
    };
    // simulate picking of n menu items
    const menu = await db.any(
      `
      SELECT id, price FROM FoodItems WHERE restUsername = $1;
    `,
      rest.username
    );
    for (let j = 0; j < faker.random.number({ min: 1, max: 8 }); j++) {
      const item = faker.random.arrayElement(menu);
      if (!order.items[item.id]) {
        order.items[item.id] = {
          id: item.id,
          qty: 0,
          pricePerQty: item.price
        };
      }
      order.items[item.id].qty++;
    }

    orders.push(order);
  }

  orders.forEach(async order => {
    const { id } = await db.one(
      `
      INSERT INTO Orders (
        restUsername,
        custUsername,
        riderUsername,
        addressId,
        promotionCode,
        timeCreated,
        fee,
        status,
        timeCollection,
        timeArrival,
        timeDeparture,
        timeDelivered,
        modeOfPayment
      ) VALUES (
        $(restUsername),
        $(custUsername),
        $(riderUsername),
        $(addressId),
        $(promotionCode),
        $(timeCreated),
        $(fee),
        $(status),
        $(timeCollection),
        $(timeArrival),
        $(timeDeparture),
        $(timeDelivered),
        $(modeOfPayment)
      )
      RETURNING id;
    `,
      order
    );

    await db.tx(t => {
      const arr = Object.values(order.items).map(item =>
        db.none(
          `
          INSERT INTO OrderItems (foodId, orderId, qty, pricePerQty)
          VALUES ($1, $2, $3, $4);
        `,
          [item.id, id, item.qty, item.pricePerQty]
        )
      );
      t.batch(arr);
    });

    const restReview = {
      orderId: id,
      description: faker.lorem.paragraphs(
        faker.random.number({ min: 1, max: 3 })
      ),
      rating: faker.random.number({ min: 1, max: 5 })
    };

    const riderReview = {
      orderId: id,
      description: faker.lorem.paragraphs(
        faker.random.number({ min: 1, max: 3 })
      ),
      rating: faker.random.number({ min: 1, max: 5 })
    };

    await db.none(
      `
      INSERT INTO RestaurantReviews
      (orderId, description, rating)
      VALUES
      ($(orderId), $(description), $(rating))
    `,
      restReview
    );

    await db.none(
      `
      INSERT INTO RiderReviews
      (orderId, description, rating)
      VALUES
      ($(orderId), $(description), $(rating))
    `,
      riderReview
    );
  });

  console.log("Seeding complete!");
};

module.exports = generate;
