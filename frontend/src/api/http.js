import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: {},
});

instance.interceptors.response.use(response => response.data);

export default instance;
