import { PlaneClient } from '@makeplane/plane-node-sdk';
import { ENV } from './config';

export const planeClient = new PlaneClient({
  baseUrl: ENV.PLANE_API_URL,
  apiKey: ENV.PLANE_API_KEY,
});
