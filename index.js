const express = require("express");
const app = express();
const cors = require("cors");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/user/restful");
const recordRouter = require("./Routes/record/restful");
const recordFilterRouter = require("./Routes/record/index");

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));
app.use("/user", userRouter);
app.use("/record", recordRouter);
app.use("/recordfilter", recordFilterRouter);
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
module.exports = app;
