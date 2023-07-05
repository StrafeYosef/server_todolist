const router = require("express").Router();
const { missionCtrl } = require("../controllers/missionCtrl");

router.get("/", missionCtrl.getAllMissions);
router.post("/setMission", missionCtrl.addMission);
router.delete("/deleteMission", missionCtrl.deleteMission);
router.put("/updateMission", missionCtrl.updateMission);
router.put("/updateChat", missionCtrl.updateChat);
router.put("/sendToConfirm", missionCtrl.sendToConfirm);
router.get("/getArchive", missionCtrl.getArhive);
router.post("/sendToArchive", missionCtrl.sendToArchive);

module.exports = router;
 