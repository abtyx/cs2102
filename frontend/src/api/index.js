import http from './http';

import * as urls from './urls';

export const getCategories = () => {
  return http.get(urls.GET_CATEGORIES_URL);
};

export const getAreas = () => {
  return http.get(urls.GET_AREAS_URL);
};

// Login
export const login = async ({ username, password }) => {
  return http.post(urls.LOGIN_URL, { username, password });
};

// Customer endpoints
export const register = async ({ username, password, name }) => {
  return http.post(urls.CREATE_CUSTOMER_URL, { username, password, name });
};

export const getCustomers = async () => {
  return http.get(urls.GET_CUSTOMERS_URL);
};

export const getCustomer = async username => {
  return http.get(urls.GET_CUSTOMER_TMP(username));
};

export const updateCustomer = async ({ username, password, name }) => {
  return http.put(urls.UPDATE_CUSTOMER_TMP(username), {
    password,
    name,
  });
};

export const deleteCustomer = async ({ username }) => {
  return http.delete(urls.DELETE_CUSTOMER_TMP(username));
};

// Restaurant Endpoints

export const getRestaurants = async () => {
  return http.get(urls.GET_RESTAURANTS_URL);
};

export const getRestaurant = async username => {
  return http.get(urls.GET_RESTAURANT_TMP(username));
};

export const registerRestaurant = async ({ username, password, name, minOrder }) => {
  return http.post(urls.CREATE_RESTAURANT_URL, { username, password, name, minOrder });
};

export const updateRestaurant = async ({ username, password, name, minOrder }) => {
  return http.put(urls.UPDATE_RESTAURANT_TMP(username), { password, name, minOrder });
};

export const deleteRestaurant = async username => {
  return http.delete(urls.DELETE_RESTAURANT_TMP(username));
};

// Rider Endpoints

export const getRiders = async () => {
  return http.get(urls.GET_RIDERS_URL);
};

export const getRider = async username => {
  return http.get(urls.GET_RIDER_TMP(username));
};

export const registerRider = async ({
  username,
  password,
  name,
  bankAccount,
  contact,
  salary,
  isFulltime,
}) => {
  return http.post(urls.CREATE_RIDER_URL, {
    username,
    password,
    name,
    bankAccount,
    contact,
    salary,
    type: isFulltime ? 'fulltime' : 'parttime',
  });
};

export const updateRider = async ({ username, name, password, bankAccount, contact, salary }) => {
  return http.put(urls.UPDATE_RIDER_TMP(username), {
    password,
    bankAccount,
    contact,
    name,
    salary,
  });
};

export const deleteRider = async ({ id }) => {
  return http.delete(urls.DELETE_RIDER_TMP(id));
};

// Manager Endpoints

export const registerStaff = async ({ username, password }) => {
  return http.post(urls.CREATE_MANAGER_URL, { username, password });
};

export const updateStaff = async ({ username, password }) => {
  return http.put(urls.UPDATE_MANAGER_TMP(username), { password });
};

export const deleteStaff = async username => {
  return http.delete(urls.DELETE_MANAGER_TMP(username));
};

export const getAllStaff = async () => {
  return http.get(urls.GET_MANAGERS_URL);
};

export const getStaff = async username => {
  return http.get(urls.GET_MANAGER_TMP(username));
};

// FDS Admin endpoints

export const getAdminSummary = async (month, year) => {
  return http.get(urls.GET_ADMIN_SUMMARY_TMP(month, year));
};

export const getAdminCustomerSummary = async (username, month, year) => {
  return http.get(urls.GET_ADMIN_CUST_TMP(username, month, year));
};

export const getAdminAreaSummary = async (area, hour, date) => {
  return http.get(urls.GET_AREA_SUMMARY_TMP(area, hour, date));
};

export const getAdminRiderSummary = async (username, month, year) => {
  return http.get(urls.GET_ADMIN_RIDER_TMP(username, month, year));
};

// Restaurant Admin handlers
export const getRestaurantSummary = (username, month, year) => {
  return http.get(urls.GET_REST_SUMMARY_TMP(username, month, year));
};

export const getRestaurantCampaigns = async username => {
  return http.get(urls.GET_REST_PROMOS_TMP(username));
};

export const getRestaurantCampaign = async (username, promoCode) => {
  return http.get(urls.GET_REST_PROMO_TMP(username, promoCode));
};

// Rider admin handlers
export const getRiderSummary = async (username, month, year) => {
  return http.get(urls.GET_RIDER_SUMMARY_TMP(username, month, year));
};

// food search
export const searchFood = async (query, category) => {
  return http.get(urls.GET_FOODSEARCH_TMP(query, category));
};
