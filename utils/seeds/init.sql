DROP TABLE IF EXISTS Managers CASCADE;
DROP TABLE IF EXISTS RestaurantPromotions CASCADE;
DROP TABLE IF EXISTS ReturningCustomerPromotions CASCADE;
DROP TABLE IF EXISTS FirstCustomerPromotions CASCADE;
DROP TABLE IF EXISTS PromotionCampaigns CASCADE;
DROP TABLE IF EXISTS Discounts CASCADE;
DROP TABLE IF EXISTS WorkSchedules CASCADE;
DROP TABLE IF EXISTS SalarySlips CASCADE;
DROP TABLE IF EXISTS PartTimeRiders CASCADE;
DROP TABLE IF EXISTS FullTimeRiders CASCADE;
DROP TABLE IF EXISTS RiderReviews CASCADE;
DROP TABLE IF EXISTS RestaurantReviews CASCADE;
DROP TABLE IF EXISTS CreditCards CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Addresses CASCADE;
DROP TABLE IF EXISTS Area CASCADE;
DROP TABLE IF EXISTS OrderItems CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS DeliveryRiders CASCADE;
DROP TABLE IF EXISTS FoodItemBelongsTo CASCADE;
DROP TABLE IF EXISTS FoodItems CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

CREATE TABLE Restaurants (
  id serial PRIMARY KEY,
  userId integer,
  minOrder numeric(16, 2)
);

CREATE TABLE FoodItems (
  id serial PRIMARY KEY,
  name varchar(128),
  price numeric(16, 2),
  maxLimit integer,
  stock integer,
  availability boolean,
  restId integer
);

CREATE TABLE FoodItemBelongsTo (
  foodItemId integer,
  categoryName varchar(55)
);

CREATE TABLE Categories (
  name varchar(55) PRIMARY KEY
);

CREATE TABLE Orders (
  id serial PRIMARY KEY,
  custId integer,
  riderId integer,
  addressId integer,
  timeCreated timestamp,
  fee numeric(16, 2),
  status varchar(16),
  timeCollection timestamp,
  timeArrival timestamp,
  timeDeparture timestamp,
  timeDelivered timestamp,
  modeOfPayment varchar(8)
);

CREATE TABLE OrderItems (
  foodId integer,
  orderId integer,
  qty integer,
  pricePerQty numeric(16, 2),
  PRIMARY KEY (foodId, orderId)
);

CREATE TABLE Customers (
  id serial PRIMARY KEY,
  userId integer,
  name text,
  loyaltyPoints integer,
  signupDate timestamp
);

CREATE TABLE Addresses (
  id serial PRIMARY KEY,
  custId integer,
  area varchar(128),
  address text
);

CREATE TABLE Area (
  name varchar(128) PRIMARY KEY
);

CREATE TABLE CreditCards (
  id serial,
  custId integer,
  number varchar(55),
  name text,
  expiry date,
  cvv varchar(3),
  PRIMARY KEY (id, custId)
);

CREATE TABLE RestaurantReviews (
  id serial PRIMARY KEY,
  custId integer,
  orderId integer,
  restaurantId integer,
  description text,
  rating integer
);

CREATE TABLE RiderReviews (
  id serial PRIMARY KEY,
  custId integer,
  orderId integer,
  riderId integer,
  description text,
  rating integer
);

CREATE TABLE DeliveryRiders (
  id serial PRIMARY KEY,
  userId integer,
  name text,
  bankAccount varchar(55),
  contact varchar(55)
);

CREATE TABLE FullTimeRiders (
  riderId integer PRIMARY KEY,
  monthlyBaseSalary numeric(16, 2)
);

CREATE TABLE PartTimeRiders (
  riderId integer PRIMARY KEY,
  weeklyBaseSalary numeric(16, 2)
);

CREATE TABLE SalarySlips (
  id serial PRIMARY KEY,
  riderId integer,
  amount numeric(16, 2),
  isPaidOut boolean,
  createdAt timestamp
);

CREATE TABLE WorkSchedules (
  id serial PRIMARY KEY,
  riderId integer,
  startDate timestamp,
  endDate timestamp
);

CREATE TABLE PromotionCampaigns (
  code varchar(55) PRIMARY KEY,
  discountId integer,
  name text,
  description text,
  startDate timestamp,
  endDate timestamp
);

CREATE TABLE Discounts (
  id serial PRIMARY KEY,
  type varchar(8),
  value numeric(16, 2)
);

CREATE TABLE FirstCustomerPromotions (
  campaignCode varchar(55) PRIMARY KEY
);

CREATE TABLE ReturningCustomerPromotions (
  campaignCode varchar(55) PRIMARY KEY,
  daysWithoutOrder integer
);

CREATE TABLE RestaurantPromotions (
  campaignCode varchar(55) PRIMARY KEY,
  restId integer,
  minOrder numeric(16, 2)
);

CREATE TABLE Users (
  id serial PRIMARY KEY,
  username varchar(128) UNIQUE,
  password varchar(64)
);

CREATE TABLE Managers (
  userId integer
);

ALTER TABLE Restaurants ADD FOREIGN KEY (userId) REFERENCES Users (id);

ALTER TABLE FoodItems ADD FOREIGN KEY (restId) REFERENCES Restaurants (id);

ALTER TABLE FoodItemBelongsTo ADD FOREIGN KEY (foodItemId) REFERENCES FoodItems (id);

ALTER TABLE FoodItemBelongsTo ADD FOREIGN KEY (categoryName) REFERENCES Categories (name);

ALTER TABLE Orders ADD FOREIGN KEY (custId) REFERENCES Customers (id);

ALTER TABLE Orders ADD FOREIGN KEY (riderId) REFERENCES DeliveryRiders (id);

ALTER TABLE Orders ADD FOREIGN KEY (addressId) REFERENCES Addresses (id);

ALTER TABLE OrderItems ADD FOREIGN KEY (foodId) REFERENCES FoodItems (id);

ALTER TABLE OrderItems ADD FOREIGN KEY (orderId) REFERENCES Orders (id);

ALTER TABLE Customers ADD FOREIGN KEY (userId) REFERENCES Users (id);

ALTER TABLE Addresses ADD FOREIGN KEY (custId) REFERENCES Customers (id);

ALTER TABLE Addresses ADD FOREIGN KEY (area) REFERENCES Area (name);

ALTER TABLE CreditCards ADD FOREIGN KEY (custId) REFERENCES Customers (id);

ALTER TABLE RestaurantReviews ADD FOREIGN KEY (custId) REFERENCES Customers (id);

ALTER TABLE RestaurantReviews ADD FOREIGN KEY (orderId) REFERENCES FoodItems (id);

ALTER TABLE RestaurantReviews ADD FOREIGN KEY (restaurantId) REFERENCES Restaurants (id);

ALTER TABLE RiderReviews ADD FOREIGN KEY (custId) REFERENCES Customers (id);

ALTER TABLE RiderReviews ADD FOREIGN KEY (orderId) REFERENCES Orders (id);

ALTER TABLE RiderReviews ADD FOREIGN KEY (riderId) REFERENCES DeliveryRiders (id);

ALTER TABLE DeliveryRiders ADD FOREIGN KEY (userId) REFERENCES Users (id);

ALTER TABLE FullTimeRiders ADD FOREIGN KEY (riderId) REFERENCES DeliveryRiders (id);

ALTER TABLE PartTimeRiders ADD FOREIGN KEY (riderId) REFERENCES DeliveryRiders (id);

ALTER TABLE SalarySlips ADD FOREIGN KEY (riderId) REFERENCES DeliveryRiders (id);

ALTER TABLE WorkSchedules ADD FOREIGN KEY (riderId) REFERENCES DeliveryRiders (id);

ALTER TABLE PromotionCampaigns ADD FOREIGN KEY (discountId) REFERENCES Discounts (id);

ALTER TABLE FirstCustomerPromotions ADD FOREIGN KEY (campaignCode) REFERENCES PromotionCampaigns (code);

ALTER TABLE ReturningCustomerPromotions ADD FOREIGN KEY (campaignCode) REFERENCES PromotionCampaigns (code);

ALTER TABLE RestaurantPromotions ADD FOREIGN KEY (campaignCode) REFERENCES PromotionCampaigns (code);

ALTER TABLE RestaurantPromotions ADD FOREIGN KEY (restId) REFERENCES Restaurants (id);

ALTER TABLE Managers ADD FOREIGN KEY (userId) REFERENCES Users (id);
