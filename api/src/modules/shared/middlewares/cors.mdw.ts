import cors from "cors";
import config from "@/core/config/env";

const allowedOrigins: Set<string> = new Set(
  config.cors.allowedOrigins.split(",").map((origin) => origin.trim()),
);

const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allowed?: boolean) => void,
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has("*")) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    const msg =
      "The CORS policy for this site does not allow access from the specified Origin.";
    callback(new Error(msg), false);
  },
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Cookie",
    "Set-Cookie",
    "Connection",
    "Upgrade",
    "Origin",
    "User-Agent",
    "Referer",
    "Host",
  ],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 3600,
  preflightContinue: false,
};

export default cors(corsOptions);
