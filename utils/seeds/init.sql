DROP SCHEMA public CASCADE;
CREATE SCHEMA PUBLIC;

CREATE TABLE Users (
  username varchar(128) PRIMARY KEY,
  password varchar(64)
);

CREATE TABLE Restaurants (
  username varchar(128) PRIMARY KEY REFERENCES Users ON DELETE CASCADE,
  name text,
  minOrder numeric(16, 2)
);

CREATE TABLE FoodItems (
  id serial PRIMARY KEY,
  name varchar(128),
  price numeric(16, 2),
  maxLimit integer,
  stock integer,
  restUsername varchar(128) REFERENCES Restaurants ON DELETE CASCADE
);

CREATE TABLE Categories (
  name varchar(55) PRIMARY KEY
);

CREATE TABLE FoodItemBelongsTo (
  foodItemId integer REFERENCES FoodItems ON DELETE CASCADE,
  categoryName varchar(55) REFERENCES Categories ON DELETE CASCADE
);

CREATE TABLE DeliveryRiders (
  username varchar(128) PRIMARY KEY REFERENCES Users ON DELETE CASCADE,
  name text,
  bankAccount varchar(55),
  contact varchar(55)
);

CREATE TABLE FullTimeRiders (
  riderUsername varchar(128) PRIMARY KEY REFERENCES DeliveryRiders ON DELETE CASCADE,
  monthlyBaseSalary numeric(16, 2)
);

CREATE TABLE PartTimeRiders (
  riderUsername varchar(128) PRIMARY KEY REFERENCES DeliveryRiders ON DELETE CASCADE,
  weeklyBaseSalary numeric(16, 2)
);

CREATE TABLE Customers (
  username varchar(128) PRIMARY KEY REFERENCES Users ON DELETE CASCADE,
  name text,
  loyaltyPoints integer,
  signupDate timestamp
);

CREATE TABLE Area (
  name varchar(128) PRIMARY KEY
);

CREATE TABLE Addresses (
  id serial PRIMARY KEY,
  custUsername varchar(128) REFERENCES Customers ON DELETE CASCADE,
  areaName varchar(128) REFERENCES Area ON DELETE SET NULL,
  address text
);

CREATE TABLE Discounts (
  id serial PRIMARY KEY,
  type varchar(16),
  value numeric(16, 2)
);

CREATE TABLE PromotionCampaigns (
  code varchar(55) PRIMARY KEY,
  discountId integer REFERENCES Discounts ON DELETE SET NULL,
  name text,
  description text,
  startDate timestamp,
  endDate timestamp
);

CREATE TABLE Orders (
  id serial PRIMARY KEY,
  restUsername varchar(128) REFERENCES Restaurants ON DELETE SET NULL,
  custUsername varchar(128) REFERENCES Customers ON DELETE SET NULL,
  riderUsername varchar(128) REFERENCES DeliveryRiders ON DELETE SET NULL,
  addressId integer REFERENCES Addresses ON DELETE SET NULL,
  promotionCode varchar(55) REFERENCES PromotionCampaigns ON DELETE SET NULL,
  timeCreated timestamp,
  fee numeric(16, 2),
  status varchar(8),
  timeCollection timestamp,
  timeArrival timestamp,
  timeDeparture timestamp,
  timeDelivered timestamp,
  modeOfPayment varchar(8)
);

CREATE TABLE OrderItems (
  foodId integer REFERENCES FoodItems ON DELETE SET NULL,
  orderId integer REFERENCES Orders ON DELETE CASCADE,
  qty integer,
  pricePerQty numeric(16, 2),
  PRIMARY KEY (foodId, orderId)
);

CREATE TABLE CreditCards (
  custUsername varchar(128) REFERENCES Customers ON DELETE CASCADE,
  number varchar(16),
  name text,
  expiry date,
  cvv varchar(3),
  PRIMARY KEY (custUsername, number)
);

CREATE TABLE RestaurantReviews (
  orderId integer PRIMARY KEY REFERENCES Orders ON DELETE CASCADE,
  description text,
  rating integer
);

CREATE TABLE RiderReviews (
  orderId integer PRIMARY KEY REFERENCES Orders ON DELETE CASCADE,
  description text,
  rating integer
);

CREATE TABLE Wages (
  id serial PRIMARY KEY,
  riderUsername varchar(128) REFERENCES DeliveryRiders ON DELETE CASCADE,
  amount numeric(16, 2),
  isPaidOut boolean,
  createdAt timestamp
);

CREATE TABLE WorkSchedules (
  id serial PRIMARY KEY,
  riderUsername varchar(128) REFERENCES DeliveryRiders ON DELETE CASCADE,
  startDate timestamp,
  endDate timestamp
);

CREATE TABLE FirstCustomerPromotions (
  campaignCode varchar(55) PRIMARY KEY REFERENCES PromotionCampaigns ON DELETE CASCADE
);

CREATE TABLE ReturningCustomerPromotions (
  campaignCode varchar(55) PRIMARY KEY REFERENCES PromotionCampaigns ON DELETE CASCADE,
  daysWithoutOrder integer
);

CREATE TABLE RestaurantPromotions (
  campaignCode varchar(55) PRIMARY KEY REFERENCES PromotionCampaigns ON DELETE CASCADE,
  restUsername varchar(128),
  minOrder numeric(16, 2)
);

CREATE TABLE Managers (
  username varchar(128) PRIMARY KEY REFERENCES Users ON DELETE CASCADE
);
