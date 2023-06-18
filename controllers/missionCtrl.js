const missionModel = require('../models/missionModel');
const userModel = require('../models/userModel');
exports.missionCtrl = {
    async addMission(req, res) {
      try {
        let user = await userModel.findOne({token: req.body.token});
        if(!user){
          return res.status(400).json({err:'User not found'});
        }
        let mission = await missionModel.findOne(req.body);
        if(mission){
          return res.status(400).json({err: 'Duplicate misssion'});
        }
        mission = missionModel(req.body);
        await mission.save(); 
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
      return res.status(200).json(missions);
    },
  };
