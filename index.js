const express = require("express");
const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.json());
app.use(cookieParser());
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
