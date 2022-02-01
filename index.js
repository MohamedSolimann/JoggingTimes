const express = require("express");
const app = express();
const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");

app.use(express.json());
app.cors({ origin: "*" });
mongoose.connect(
  `mongodb://${config.get("DB.host")}:${config.get("DB.port")}/${config.get(
    "DB.dbName"
  )}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("db connected");
  }
);

const dbConnection = mongoose.connection;

dbConnection.once("open", () => {
  app.listen(config.get("server.port"), () => {
    console.log("server is running");
  });
});
