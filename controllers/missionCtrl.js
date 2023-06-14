const missionModel = require('../models/missionModel');
const userModel = require('../models/userModel');
exports.missionCtrl = {
    async addMission(req, res) {
      try {
        let mission = await missionModel.findOne(req.body);
        if(mission){
          return res.status(400).json({err: 'Duplicate misssion'});
        }
        mission = await missionModel.create(req.body);
        return res.status(200).json(mission);
      } catch (error) {
        return res.status(500).json({err: error});
      }
    },
    async getAllMissions(req, res) {
      let user = await userModel.findOne({token: req.query.token});
      if(!user){
        return res.status(400).json({err:'User not found'});
      }
      let missions = await missionModel.find({});
      console.log(missions)
      return res.status(200).json(missions);
    },
  };
  
  var date1 = new Date("06/06/2019");
    var date2 = new Date("06/06/2019");
      
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();
      
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days);