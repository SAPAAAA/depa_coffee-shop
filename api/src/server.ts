import * as dotenvx from "@dotenvx/dotenvx";
import app from "./app";
import config from "@/core/config/env";

dotenvx.config();

const startServer = () => {
  try {
    app.listen(config.app.port, () => {
      console.log(`Server is running on port ${config.app.port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
