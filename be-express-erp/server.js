import { config } from "dotenv";
config(); // HARUS DI ATAS

import app from "./src/app.js";

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});