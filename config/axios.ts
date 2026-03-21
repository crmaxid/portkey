import axios from 'axios';
import { ENV } from './config';

export const planeAxios = axios.create({
  baseURL: ENV.PLANE_API_URL,
  headers: {
    'X-API-Key': ENV.PLANE_API_KEY,
  },
});
