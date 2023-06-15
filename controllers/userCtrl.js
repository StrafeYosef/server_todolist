const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
require("dotenv").config();

exports.userCtrl = {
  //admin panel
  async setNewUser(req, res) {
    try {
      let admin = await userModel.findOne({token: req.body.adminToken});
      if(admin){
        if(admin.access === 'מנהל'){
          let newUser = await userModel.findOne({ username: req.body.username });
          if (newUser) {
            return res.status(400).json({ error: "username already exists" })
          }
          const payload = { username: req.body.username };
          const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "30d" });
          req.body.token = token;
          newUser = userModel(req.body);
          await newUser.save();
          let user = {...req.body};
          delete user.adminToken;
          return res.status(200).json(user);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  async getUser(req, res) {    
    try {      
      if(req.query.username && req.query.id){
        let theUser = await userModel.findOne({ username: req.query.username, id: req.query.id });
        if (theUser) {
          return res.status(200).json(theUser);
        }
      } else if(req.query.token) {
        let theUser = await userModel.findOne({ token: req.query.token });
        if (theUser) {
          return res.status(200).json(theUser);
        }
      } else {
        return res.status(402).json({err: 'valid Email or client ID'});
      }
    } catch (error) {
      console.log(error);
    }
  },
  async getAllUsers(req, res) {
    try {
      if (req.query.access === "מנהל") {
        const newUser = await userModel.findOne({
          username: req.query.username,
        });
        if (newUser.access === "מנהל") {
          const users = await userModel.find({});
          return res.status(200).json(users);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

