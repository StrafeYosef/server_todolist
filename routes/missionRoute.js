const router = require("express").Router();
const { missionCtrl } = require("../controllers/missionCtrl");

router.get("/", missionCtrl.getAllMissions);
router.post("/setMission", missionCtrl.addMission);
router.delete("/deleteMission", missionCtrl.deleteMission);
router.put("/updateMission", missionCtrl.updateMission);

module.exports = router;
 