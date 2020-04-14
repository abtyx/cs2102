export const LOGIN_URL = '/login';

// helpers
export const GET_CATEGORIES_URL = '/categories';
export const GET_AREAS_URL = '/areas';

// Customer endpoints
export const REGISTER_URL = '/customers';
export const GET_CUSTOMERS_URL = '/customers';
export const GET_CUSTOMER_TMP = username => `/customers/${username}`;
export const UPDATE_CUSTOMER_TMP = username => `/customers/${username}`;
export const DELETE_CUSTOMER_TMP = username => `/customers/${username}`;

// Restaurant endpoints
export const GET_RESTAURANTS_URL = '/restaurants';
export const CREATE_RESTAURANT_URL = `/restaurants`;
export const GET_RESTAURANT_TMP = username => `/restaurants/${username}`;
export const UPDATE_RESTAURANT_TMP = username => `/restaurants/${username}`;
export const DELETE_RESTAURANT_TMP = username => `/restaurants/${username}`;

// Manager endpoints
export const GET_MANAGERS_URL = '/managers';
export const GET_MANAGER_TMP = username => `/managers/${username}`;
export const UPDATE_MANAGER_TMP = username => `/managers/${username}`;
export const CREATE_MANAGER_URL = `/managers`;
export const DELETE_MANAGER_TMP = username => `/managers/${username}`;

// Rider endpoints
export const GET_RIDERS_URL = '/riders';
export const GET_RIDER_TMP = username => `/riders/${username}`;
export const UPDATE_RIDER_TMP = username => `/riders/${username}`;
export const CREATE_RIDER_URL = `/riders`;
export const DELETE_RIDER_TMP = username => `/riders/${username}`;

// Food search handler
export const GET_FOODSEARCH_TMP = (query, category) =>
  `/food/search?query=${query}&category=${category}`;

// FDS Admin handlers
export const GET_ADMIN_SUMMARY_TMP = (month, year) => `/admin/summary?month=${month}&year=${year}`;
export const GET_ADMIN_CUST_TMP = (username, month, year) =>
  `/admin/customer/${username}?month=${month}&year=${year}`;
export const GET_AREA_SUMMARY_TMP = (area, hour, date) =>
  `/admin/area-summary?date=${date}&hour=${hour}&area=${area}`;
export const GET_HOTSPOTS_TMP = (area, hour) => `/admin/hotspots?hour=${hour}&area=${area}`;
export const GET_ADMIN_RIDER_TMP = (username, month, year) =>
  `/admin/rider/${username}?month=${month}&year=${year}`;

// Restaurant Admin handlers
export const GET_REST_SUMMARY_TMP = (username, month, year) =>
  `/restaurant-admin/summary/${username}?month=${month}&year=${year}`;
export const GET_REST_PROMOS_TMP = username => `/restaurant-admin/promotions/${username}`;
export const GET_REST_PROMO_TMP = (username, promoCode) =>
  `/restaurant-admin/promotions/${username}/${promoCode}`;

// Rider Admin handlers
export const GET_RIDER_SUMMARY_TMP = (username, month, year) =>
  `/rider-admin/summary/${username}?month=${month}&year=${year}`;
