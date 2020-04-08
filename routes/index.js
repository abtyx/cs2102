const express = require("express");
const wrap = require("./wrap");
const router = express.Router();
const seedDbHandler = require("./seedDb");
const usersHandlers = require("./users");
const customerHandlers = require("./customers");
const restHandlers = require("./restaurants");
const managerHandlers = require("./managers");
const riderHandlers = require("./riders");
const foodItemHandlers = require("./fooditems");
const adminHandlers = require("./admin");
const restAdminHandlers = require("./restaurant-admin");
const riderAdminHandlers = require("./rider-admin");

// Customer handlers
router.get("/customers", wrap(customerHandlers.getCustomers));
router.get("/customers/:username", wrap(customerHandlers.getCustomer));
router.put("/customers/:username", wrap(customerHandlers.updateCustomer));
router.post("/customers", wrap(customerHandlers.createCustomer));
router.delete("/customers/:username", wrap(customerHandlers.deleteCustomer));

// Restaurant handlers
router.get("/restaurants", wrap(restHandlers.getRestaurants));
router.get("/restaurants/:username", wrap(restHandlers.getRestaurant));
router.put("/restaurants/:username", wrap(restHandlers.updateRestaurant));
router.post("/restaurants", wrap(restHandlers.createRestaurant));
router.delete("/restaurants/:username", wrap(restHandlers.deleteRestaurant));

// Manager handlers
router.get("/managers", wrap(managerHandlers.getManagers));
router.get("/managers/:username", wrap(managerHandlers.getManager));
router.put("/managers/:username", wrap(managerHandlers.updateManager));
router.post("/managers", wrap(managerHandlers.createManager));
router.delete("/managers/:username", wrap(managerHandlers.deleteManager));

// Rider handlers
router.get("/riders", wrap(riderHandlers.getRiders));
router.get("/riders/:username", wrap(riderHandlers.getRider));
router.put("/riders/:username", wrap(riderHandlers.updateRider));
router.post("/riders", wrap(riderHandlers.createRider));
router.delete("/riders/:username", wrap(riderHandlers.deleteRider));

// Food Search handler
router.get("/food/search", wrap(foodItemHandlers.foodSearch));

// Login handler
router.post("/login", wrap(usersHandlers.login));

// FDS Admin handlers
router.get("/admin/summary", wrap(adminHandlers.getAdminSummary));
router.get(
  "/admin/customer/:username",
  wrap(adminHandlers.getCustomerInformation)
);
router.get("/admin/area-summary/", wrap(adminHandlers.getAreaSummary));
router.get("/admin/rider/:username", wrap(adminHandlers.getRiderSummary));

// Restaurant Admin handlers
router.get(
  "/restaurant-admin/summary/:username",
  wrap(restAdminHandlers.getRestaurantSummary)
);
router.get(
  "/restaurant-admin/promotions/:username",
  wrap(restAdminHandlers.getRestaurantPromotions)
);
router.get(
  "/restaurant-admin/promotions/:username/:promoCode",
  wrap(restAdminHandlers.getRestaurantPromotion)
);

// Rider Admin handlers
router.get(
  "/rider-admin/summary/:username",
  wrap(riderAdminHandlers.getRiderSummary)
);

// Seed handler -- for debug purposes
router.get("/init", wrap(seedDbHandler.initialize));
router.get("/seed", wrap(seedDbHandler.seed));

module.exports = router;
