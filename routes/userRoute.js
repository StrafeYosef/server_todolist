const router = require("express").Router();
const { userCtrl } = require("../controllers/userCtrl");

router.get("/getAllUsers", userCtrl.getAllUsers);
router.post("/setNewUser", userCtrl.setNewUser);
router.get("/getUser", userCtrl.getUser);

module.exports = router; 