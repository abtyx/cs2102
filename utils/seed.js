const db = require("./db");
const fs = require("fs").promises;
const path = require("path");

const seedDb = async () => {
  try {
    await seed("init");
    await seed("triggers");
    // await seed("Users");
    // await seed("Managers");
    // await seed("Area");
    // await seed("Categories");
    // await seed("Customers");
    // await seed("CreditCards");
    // await seed("Addresses");
    // await seed("DeliveryRiders");
    // await seed("Discounts");
    // await seed("Restaurants");
    // await seed("FoodItems");
    // await seed("FoodItemBelongsTo");
    // await seed("Orders");
    // await seed("OrderItems");
    // await seed("PromotionCampaigns");
    // await seed("FirstCustomerPromotions");
    // await seed("RestaurantPromotions");
    // await seed("ReturningCustomerPromotions");
    // await seed("SalarySlips");
    // await seed("RiderReviews");
    // await seed("PartTimeRiders");
    // await seed("FullTimeRiders");
    // await seed("WorkSchedules");
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
};

const seed = async filename => {
  const buffer = await fs.readFile(
    path.resolve(__dirname, "seeds", filename + ".sql")
  );
  const contents = buffer.toString();

  await db.none(contents);
};

module.exports = seedDb;
