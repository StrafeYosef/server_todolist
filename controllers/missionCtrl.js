const { ObjectId } = require('mongodb');
const missionModel = require('../models/missionModel');
const missionArchiveModel = require('../models/missionArchiveModel');
const userModel = require('../models/userModel');
exports.missionCtrl = {
    async addMission(req, res) {
      try {
        const user = await userModel.findOne({token: req.body.adminToken});
        let users = [];
        for(let i = 0; i < req.body.token.length; i++){
          users[i] = await userModel.findOne({token: req.body.token[i]});
        }
        for(let i = 0; i < users.length; i++){
          if(!users[i]){
            return res.status(400).json({err:'User not found'});
          }        
        }
        if(!user || user.access !== "admin") return  res.status(400).json({err: "Not allowed"});
        mission = {...req.body};
        let mission = await missionModel.findOne({missionId: req.body.missionId});
        if(mission){
          mission.missionId++;
        }
        delete mission.adminToken;
        mission = await missionModel(mission);
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
      try {
        let user = await userModel.findOne({token: req.query.token});
        if(!user){
          return res.status(400).json({err:'User not found'});
        }
        let missions = await missionModel.find({});
        return res.status(200).json(missions);
      } catch (error) {
        return res.status(400).json({err: error});
      }
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
          return res.status(200).json({msg: "Success"});
        }
      } catch (error) {
        return res.status(404).json(error);
      }
    },
    async updateChat(req, res){
      try {
        let user = await userModel.findOne({token: req.body.token});
        if(!user){
          return res.status(400).json({err:'User not found'});
        } 
        const post = await missionModel.findOne({
          missionId: req.body.missionId
        });
        if (!post) return res.status(400).json({ err: "Post not found" });
        if(!(post.token.find((t)=> t === user.token)) && user.access !== 'admin') return res.status(400).json({err: 'Not Allowed'});

        let currPost = { ...req.body };
        delete currPost._id;
        currPost = await missionModel.findOneAndReplace(
          { missionId: currPost.missionId },
          currPost
        );
        return res.status(200).json({msg: "Success"});
      } catch (error) {
        return res.status(400).json({err: error});
      }
    },
    async getArhive(req, res){
      try {
        if(req.query.adminToken){
          admin = await userModel.findOne({token: req.query.adminToken});
          if(!admin || admin.access !== "admin") return  res.status(400).json({err: "Not allowed"});
          let archive = await missionArchiveModel.find({});
          return res.status(200).json(archive);
        }
      } catch (error) {
        return res.status(500).json({err: error});
      }
    },
    async sendToArchive(req, res){
      try {
        if(req.body.adminToken){
          admin = await userModel.findOne({token: req.body.adminToken});
          if(!admin || admin.access !== "admin") return  res.status(400).json({err: "Not allowed"});
          let missionArchive = await missionModel.findOne({_id: new ObjectId(req.body._id)});
          if(!missionArchive) return res.status(404).json({err: 'Not found mission to send'});
          let curr = {...missionArchive._doc};
          await missionModel.deleteOne({_id: missionArchive._id});
          delete curr._id;
          delete curr.__v;
          curr = await missionArchiveModel(curr);
          curr = await curr.save();
          return res.status(200).json(curr);
        }
      } catch (error) {
        return res.status(500).json({err: error});
      }
    }
    
  };

  exports.updateChat = async(newMission)=>{
   try {
     let currPost = { ...newMission };
     delete newMission.chat;
     delete newMission._id;
     delete currPost._id;
     currPost = await missionModel.findOneAndReplace(
       { missionId: newMission.missionId },
       currPost
     );
     currPost = await missionModel.findOne({ missionId: newMission.missionId });
     return currPost;
   } catch (error) {
    console.log(error);
   }
  }
  exports.getMissions = async(token)=>{
   try {
     let user = await userModel.findOne({token: token});
     if (!user || user.access !== "admin")
     return res.status(400).json({ err: "Not allowed" });     
     let missions = await missionModel.find({});
     return missions;
   } catch (error) {
    console.log(error);
   }
  }