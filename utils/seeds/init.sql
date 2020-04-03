CREATE TABLE "Restaurants" (
  "id" serial PRIMARY KEY,
  "username" varchar(128),
  "minOrder" numeric(16, 2)
);

CREATE TABLE "FoodItems" (
  "id" serial PRIMARY KEY,
  "name" varchar(128),
  "price" numeric(16, 2),
  "maxLimit" integer,
  "stock" integer,
  "availability" boolean,
  "restId" integer
);

CREATE TABLE "FoodItemBelongsTo" (
  "foodItemId" integer,
  "categoryName" varchar(55)
);

CREATE TABLE "Categories" (
  "name" varchar(55) PRIMARY KEY
);

CREATE TABLE "Orders" (
  "id" serial PRIMARY KEY,
  "restId" integer,
  "custUsername" varchar(128),
  "riderUsername" varchar(128),
  "addressId" integer,
  "timeCreated" timestamp,
  "fee" numeric(16, 2),
  "status" varchar(8),
  "timeCollection" timestamp,
  "timeArrival" timestamp,
  "timeDeparture" timestamp,
  "timeDelivered" timestamp,
  "modeOfPayment" varchar(8)
);

CREATE TABLE "OrderItems" (
  "foodId" integer,
  "orderId" integer,
  "qty" integer,
  "pricePerQty" numeric(16, 2),
  PRIMARY KEY ("foodId", "orderId")
);

CREATE TABLE "Customers" (
  "username" varchar(128) PRIMARY KEY,
  "name" text,
  "loyaltyPoints" integer,
  "signupDate" timestamp
);

CREATE TABLE "Addresses" (
  "id" serial PRIMARY KEY,
  "custUsername" varchar(128),
  "areaName" varchar(128),
  "address" text
);

CREATE TABLE "Area" (
  "name" varchar(128) PRIMARY KEY
);

CREATE TABLE "CreditCards" (
  "custUsername" varchar(128),
  "number" varchar(16),
  "name" text,
  "expiry" date,
  "cvv" varchar(3),
  PRIMARY KEY ("custUsername", "number")
);

CREATE TABLE "RestaurantReviews" (
  "orderId" integer PRIMARY KEY,
  "description" text,
  "rating" integer
);

CREATE TABLE "RiderReviews" (
  "orderId" integer PRIMARY KEY,
  "description" text,
  "rating" integer
);

CREATE TABLE "DeliveryRiders" (
  "username" varchar(128) PRIMARY KEY,
  "name" text,
  "bankAccount" varchar(55),
  "contact" varchar(55)
);

CREATE TABLE "FullTimeRiders" (
  "riderUsername" varchar(128) PRIMARY KEY,
  "monthlyBaseSalary" numeric(16, 2)
);

CREATE TABLE "PartTimeRiders" (
  "riderUsername" varchar(128) PRIMARY KEY,
  "weeklyBaseSalary" numeric(16, 2)
);

CREATE TABLE "Wages" (
  "id" serial PRIMARY KEY,
  "riderUsername" varchar(128),
  "amount" numeric(16, 2),
  "isPaidOut" boolean,
  "createdAt" timestamp
);

CREATE TABLE "WorkSchedules" (
  "id" serial PRIMARY KEY,
  "riderUsername" varchar(128),
  "startDate" timestamp,
  "endDate" timestamp
);

CREATE TABLE "PromotionCampaigns" (
  "code" varchar(55) PRIMARY KEY,
  "discountId" integer,
  "name" text,
  "description" text,
  "startDate" timestamp,
  "endDate" timestamp
);

CREATE TABLE "Discounts" (
  "id" serial PRIMARY KEY,
  "type" varchar(16),
  "value" numeric(16, 2)
);

CREATE TABLE "FirstCustomerPromotions" (
  "campaignCode" varchar(55) PRIMARY KEY
);

CREATE TABLE "ReturningCustomerPromotions" (
  "campaignCode" varchar(55) PRIMARY KEY,
  "daysWithoutOrder" integer
);

CREATE TABLE "RestaurantPromotions" (
  "campaignCode" varchar(55) PRIMARY KEY,
  "restId" integer,
  "minOrder" numeric(16, 2)
);

CREATE TABLE "Users" (
  "username" varchar(128) UNIQUE,
  "password" varchar(64)
);

CREATE TABLE "Managers" (
  "username" varchar(128)
);

ALTER TABLE "Restaurants" ADD FOREIGN KEY ("username") REFERENCES "Users" ("username");

ALTER TABLE "FoodItems" ADD FOREIGN KEY ("restId") REFERENCES "Restaurants" ("id");

ALTER TABLE "FoodItemBelongsTo" ADD FOREIGN KEY ("foodItemId") REFERENCES "FoodItems" ("id");

ALTER TABLE "FoodItemBelongsTo" ADD FOREIGN KEY ("categoryName") REFERENCES "Categories" ("name");

ALTER TABLE "Orders" ADD FOREIGN KEY ("restId") REFERENCES "Restaurants" ("id");

ALTER TABLE "Orders" ADD FOREIGN KEY ("custUsername") REFERENCES "Customers" ("username");

ALTER TABLE "Orders" ADD FOREIGN KEY ("riderUsername") REFERENCES "DeliveryRiders" ("username");

ALTER TABLE "Orders" ADD FOREIGN KEY ("addressId") REFERENCES "Addresses" ("id");

ALTER TABLE "OrderItems" ADD FOREIGN KEY ("foodId") REFERENCES "FoodItems" ("id");

ALTER TABLE "OrderItems" ADD FOREIGN KEY ("orderId") REFERENCES "Orders" ("id");

ALTER TABLE "Customers" ADD FOREIGN KEY ("username") REFERENCES "Users" ("username");

ALTER TABLE "Addresses" ADD FOREIGN KEY ("custUsername") REFERENCES "Customers" ("username");

ALTER TABLE "Addresses" ADD FOREIGN KEY ("areaName") REFERENCES "Area" ("name");

ALTER TABLE "CreditCards" ADD FOREIGN KEY ("custUsername") REFERENCES "Customers" ("username");

ALTER TABLE "RestaurantReviews" ADD FOREIGN KEY ("orderId") REFERENCES "Orders" ("id");

ALTER TABLE "RiderReviews" ADD FOREIGN KEY ("orderId") REFERENCES "Orders" ("id");

ALTER TABLE "DeliveryRiders" ADD FOREIGN KEY ("username") REFERENCES "Users" ("username");

ALTER TABLE "FullTimeRiders" ADD FOREIGN KEY ("riderUsername") REFERENCES "DeliveryRiders" ("username");

ALTER TABLE "PartTimeRiders" ADD FOREIGN KEY ("riderUsername") REFERENCES "DeliveryRiders" ("username");

ALTER TABLE "Wages" ADD FOREIGN KEY ("riderUsername") REFERENCES "DeliveryRiders" ("username");

ALTER TABLE "WorkSchedules" ADD FOREIGN KEY ("riderUsername") REFERENCES "DeliveryRiders" ("username");

ALTER TABLE "PromotionCampaigns" ADD FOREIGN KEY ("discountId") REFERENCES "Discounts" ("id");

ALTER TABLE "FirstCustomerPromotions" ADD FOREIGN KEY ("campaignCode") REFERENCES "PromotionCampaigns" ("code");

ALTER TABLE "ReturningCustomerPromotions" ADD FOREIGN KEY ("campaignCode") REFERENCES "PromotionCampaigns" ("code");

ALTER TABLE "RestaurantPromotions" ADD FOREIGN KEY ("campaignCode") REFERENCES "PromotionCampaigns" ("code");

ALTER TABLE "RestaurantPromotions" ADD FOREIGN KEY ("restId") REFERENCES "Restaurants" ("id");

ALTER TABLE "Managers" ADD FOREIGN KEY ("username") REFERENCES "Users" ("username");
