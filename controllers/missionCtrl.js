const { ObjectId } = require('mongodb');
const missionModel = require('../models/missionModel');
const userModel = require('../models/userModel');
exports.missionCtrl = {
    async addMission(req, res) {
      try {
        let users = [];
        for(let i = 0; i < req.body.token.length; i++){
          users[i] = await userModel.findOne({token: req.body.token[i]});
        }
        for(let i = 0; i < users.length; i++){
          if(!users[i]){
            return res.status(400).json({err:'User not found'});
          }        
        }
        let mission = await missionModel.findOne({missionId: req.body.missionId});
        if(mission){
          mission = {...req.body};
          mission.missionId++;
        }
        mission = await missionModel(req.body);
        mission = await mission.save();
        for(let i = 0; i < users.length; i++){
        users[i].newMissions = [...users[i].newMissions, mission._id];
        delete users[i]._id;
        await userModel.replaceOne({id: users[i].id}, users[i]);  
      }
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
    async deleteMission(req, res) {
      try {
        if (req.query.adminToken) {
          const admin = await userModel.findOne({
            token: req.query.adminToken,
          });
          if(!admin || admin.access !== "admin") return  res.status(400).json({err: "Not allowed"});
          await missionModel.deleteOne({_id: new ObjectId(req.query._id)});
          return res.status(200).json({msg: 'Success'});
        }
      } catch (error) {
        return res.json({ err: error });
      }
    },
    async updateMission(req, res) {
      try {
        if (req.body.adminToken) {
          const admin = await userModel.findOne({
            token: req.body.adminToken,
          });
          if (!admin || admin.access !== "admin")
            return res.status(400).json({ err: "Not allowed" });
          const post = await missionModel.findOne({
            missionId: req.body.missionId
          });
          if (!post) return res.status(400).json({ err: "Post not found" });
          let currPost = { ...req.body };
          delete currPost.adminToken;
          delete currPost._id;
          currPost = await missionModel.findOneAndReplace(
            { missionId: currPost.missionId },
            currPost
          );
          currPost = await missionModel.findOne({
            missionId: currPost.missionId,
          });
          return res.status(200).json({msg: "Success"});
        }
      } catch (error) {
        return res.status(404).json(error);
      }
    },
    
  };
