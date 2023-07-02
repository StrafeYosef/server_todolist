const indexR = require("./index");
const userR = require("./userRoute");
const missionR = require("./missionRoute");
const Router = require("express").Router();
exports.routesInit = (app) => {
  app.use("/", indexR)
  app.use("/user", userR);
  app.use("/mission", missionR);
  app.use((req, res) => {
    res.status(404).json({ msg: "Not Found" });
  });
};
