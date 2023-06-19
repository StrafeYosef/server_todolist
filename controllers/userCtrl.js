const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

exports.userCtrl = {
  //admin panel
  async setNewUser(req, res) {
    try {
      let admin = await userModel.findOne({ token: req.body.adminToken });
      if (admin) {
        if (admin.access === "admin") {
          let newUser = await userModel.findOne({
            username: req.body.username,
          });
          if (newUser) {
            return res.status(400).json({ error: "username already exists" });
          }
          const payload = { username: req.body.username };
          const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: "30d",
          });
          req.body.token = token;
          newUser = userModel(req.body);
          await newUser.save();
          let user = { ...req.body };
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
      if (req.query.username && req.query.id) {
        let theUser = await userModel.findOne({
          username: req.query.username,
          id: req.query.id,
        });
        if (theUser) {
          return res.status(200).json(theUser);
        }
      } else if (req.query.token) {
        let theUser = await userModel.findOne({ token: req.query.token });
        if (theUser) {
          return res.status(200).json(theUser);
        }
      } else {
        return res.status(402).json({ err: "valid Email or client ID" });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async getAllUsers(req, res) {
    try {
      if (req.query.access === "admin") {
        const newUser = await userModel.findOne({
          username: req.query.username,
        });
        if (newUser.access === "admin") {
          const users = await userModel.find({});
          return res.status(200).json(users);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  async updateUser(req, res) {
    try {
      if (req.body.adminToken) {
        const admin = await userModel.findOne({
          token: req.body.adminToken,
        });
        if (!admin || admin.access !== "admin")
          return res.status(400).json({ err: "Not allowed" });
        const user = await userModel.findOne({
          username: req.body.username,
          id: req.body.id,
          token: req.body.token,
        });
        if (!user) return res.status(400).json({ err: "user not found" });
        let currUser = { ...req.body };
        delete currUser.adminToken;
        delete currUser._id;
        currUser = await userModel.findOneAndReplace(
          { username: currUser.username },
          currUser
        );
        currUser = await userModel.findOne({
          username: currUser.username,
        });
        return res.status(200).json(currUser);
      }
    } catch (error) {
      return res.status(404).json(error);
    }
  },
  async deleteUser(req, res) {
    try {
      console.log(req.body, req.query);
      if (req.query.adminToken) {
        const admin = await userModel.findOne({
          token: req.query.adminToken,
        });
        if(!admin || admin.access !== "admin") return res.status(400).json({err: "Not allowed"});
        await userModel.deleteOne({id: req.query.id});
        return res.status(200).json({msg: 'Success'});
      }
    } catch (error) {
      return res.json({ err: error });
    }
  },
};
