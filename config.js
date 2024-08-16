const mongoose = require("mongoose");
require("dotenv").config();
if (!process.env.MYAPP_MONGO_URL) {
  console.error("Error: MYAPP_MONGO_URL environment variable is not set.");
  process.exit(1); // Exit the process with an error code
}

const connectionStr = process.env.MYAPP_MONGO_URL;

mongoose
  .connect(connectionStr)
  .then(() => console.log("Mongodb Connected"))
  .catch((e) => console.log("Mongodb connection error -- ", e));

mongoose.set("debug", true);
