import fs from "fs";

import { setupAPI } from "./api/index.mjs";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

setupAPI(config);
