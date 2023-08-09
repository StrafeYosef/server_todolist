const { ObjectId } = require('mongodb');
const missionModel = require('../models/missionModel');
const missionArchiveModel = require('../models/missionArchiveModel');
const userModel = require('../models/userModel');
const path = require('path');
const filesPath = 'missions360_DB';
const fs = require('fs');
exports.missionCtrl = {
    async addMission(req, res) {
      let formData = new FormData();
      for (let key in req.files) {
        // await uploadFiles(req, key,'missions360_DB/' + req.files[key].name);
        req.files[key].mv('missions360_DB/' + req.files[key].name, err=>{
          if(err) return console.log(err);
          console.log('Successfully uploaded');
          fs.readFile('missions360_DB/' + req.files[key].name, (err, data) => {
            if (err) {
              res.status(500).json({ error: 'Error reading file' });
            } else {
              formData.append('file', data);
            }
          });
        }) 
      }
      formData.append('data',{mission: "momo"})
      return res.json(formData);
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
        let mission = await missionModel.findOne({missionId: req.body.missionId});
        if(mission){
          mission = {...req.body};
          delete mission.adminToken;
          mission.missionId++;
        } else {
          mission = {...req.body};
          delete mission.adminToken;
        }
        mission = await missionModel(mission);
        mission = await mission.save();
        for(let i = 0; i < users.length; i++){
          users[i].newMissions = [...users[i].newMissions, mission._id];
          delete users[i]._id;
          await userModel.replaceOne({id: users[i].id}, users[i]);  
        }
        if(req.files.length > 0){
          for (let key in req.files) {
            // await uploadFiles(req, key,'missions360_DB/' + req.files[key].name);
            req.files[key].mv('missions360_DB/' + req.files[key].name, err=>{
              if(err) return console.log(err);
              console.log('Successfully uploaded');
            })
          }
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
    },
    async sendToConfirm(req, res){
      try {
        let user = await userModel.findOne({token: req.body.uToken});
        let currMission = {...req.body};
        delete currMission.uToken;
        let mission = await missionModel.findOne({
          missionId: currMission.missionId,
          token: [...currMission.token],
          details: currMission.details,
          daysLeft: currMission.daysLeft,
          title: currMission.title,
          chat: {...currMission.chat}
        });
        delete currMission._id;
        if(user && (user.access === 'admin' || mission.token.find((t)=> t === user.token))){
          mission = await missionModel.replaceOne({missionId: mission.missionId}, currMission);
        }
        return res.status(200).json({msg: "Success"});
      } catch (error) {
        return res.status(500).json({err: error});
      }
    }
    
  };
exports.setChat = async (token, mission)=>{
  try {
    let currUser = mission.token.find((t)=> t === token);
    currUser = await userModel.findOne({token: currUser});
    if(!currUser){
      currUser = await userModel.findOne({token: token});
      if(!currUser || !currUser.access === 'admin'){
        return {err: 'error'};
      }    
    }
  
    let chat = {...mission.chat};
    delete mission.chat;
    let currMission = await missionModel.findOne({
      missionId: mission.missionId,
    });
    currMission = {...currMission?._doc}
    currMission.chat = {...chat};
    delete currMission._id;
    currMission = await missionModel.replaceOne({
     missionId: currMission.missionId,
     token: currMission.token,
     status: currMission.status,
     endedAt: currMission.endedAt,
     details: currMission.details,
     daysLeft: currMission.daysLeft,
     startedAt: currMission.startedAt,
     title: currMission.title},
     currMission);
    return currMission;
  } catch (error) {
    return console.log(error);
  }

}


const uploadFiles = (req,fileKey,dest,max_mb=10,filesAllow=[".png",".jpg",".gif",".jpeg"]) => {
  return new Promise((resolve,reject) => {
    let myFile = req.files[fileKey];
    if(!myFile){
      reject({msg:"you need to send file",code:"send_file"})
    }
    if (myFile.size <= 1024 * 1024 * max_mb) {
      let extFile = path.extname(myFile.name)
      if (filesAllow.includes(extFile)) {
        dest = dest != "" ? dest : myFile.name
        myFile.mv(dest, (err) => {
          if (err) { return console.log(err)};
          console.log("Successfully");
          return resolve({ msg: "file upload" });
        })
      }
      else{
        reject({ msg: "File not allowed ",code:"ext" });
      }
    }
    else {
      reject({ msg: "File too big, max "+max_mb+" mb!",code:"max" });
    }
  })

}

const deleteFile = (path)=>{
  if (fs.existsSync(path)) {
      // The file exists, so you can proceed with deleting it
      try {
          fs.unlinkSync(path)
          console.log('File deleted successfully')
      } catch (err) {
          console.error(err)
      }
  } else {
      console.log('File not found')
  }
}
