import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables required to run test from the .env.test file
config({ path: resolve(__dirname, ".env.test") });
