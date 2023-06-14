const router = require("express").Router();
const { missionCtrl } = require("../controllers/missionCtrl");

router.post("/setMission", missionCtrl.addMission);
router.get("/", missionCtrl.getAllMissions);

module.exports = router;
 