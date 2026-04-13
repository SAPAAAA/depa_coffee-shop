const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
}

const config = {
  app: {
    port: Number(getEnv("PORT", "3000")),
  },
  cors: {
    allowedOrigins: getEnv("CORS_ALLOWED_ORIGINS", "*"),
  },
  db: {
    host: getEnv("DB_HOST", "localhost"),
    port: Number(getEnv("DB_PORT", "5432")),
    user: getEnv("DB_USER", "postgres"),
    password: getEnv("DB_PASSWORD", "password"),
    name: getEnv("DB_NAME", "coffee_shop"),
  },
  jwt: {
    secrets: {
      access: {
        expireIn: Number.parseInt(getEnv("JWT_ACCESS_EXPIRE_IN", "3600")),
        secret: getEnv("JWT_ACCESS_SECRET", "your_access_token_secret"),
      },
      refresh: {
        expireIn: Number.parseInt(getEnv("JWT_REFRESH_EXPIRE_IN", "604800")),
        secret: getEnv("JWT_REFRESH_SECRET", "your_refresh_token_secret"),
      }
    }
  },
}

export default config;