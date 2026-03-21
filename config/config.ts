export const ENV = {
  PLANE_API_KEY: process.env.PLANE_API_KEY,
  PLANE_API_URL: process.env.PLANE_API_URL,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const;
