const express = require("express");
const app = express();
const server = require('http').createServer(app)
const mongoose = require("mongoose");
const cors = require("cors");


const io = require("socket.io")(server, {
    origin: '*',
    credentials: 'true'
  })
  var users = [];
  
  io.on('connection', client => {
    client.emit('login',{});

    client.on('username', username =>{
      const user = {
        name: username,
        id: client.id
      }
      if(!(users.find(user=>user.id === client.id))){
        users[users.length] = user;
        console.log("User connected");
        console.log( `you have ${users.length} users connected`);
        client.emit("connected", user);
      }
    })

    client.on('sendMessage',async ({mission, token}) =>{
      mission = await setChat(token, mission);
      users.map((user, i)=>{
        io.to(user.id).emit('getMessage', token)
      })
    })

    client.on('sendToArchive', adminToken =>{
      users.map((user, i)=>{
        io.to(user.id).emit('getArchive', adminToken);
      })
    })

    client.on('updateNewMission', ()=>{
        users.map((user, i)=>{
        io.to(user.id).emit('updatedNewMission', )
        })
    })

    client.on('setNewUser', ()=>{
        users.map((user, i)=>{
        io.to(user.id).emit('getNewUser', {})
        })
    })

    client.on('updateUser', ()=>{
        users.map((user, i)=>{
        io.to(user.id).emit('updatedUser', {})
        })
    })

      client.on('disconnect', () =>{
        users = users.filter((user)=>user.id !== client.id);
        console.log('User disconnected');
      })
  })




require("dotenv").config();
const {routesInit} = require('./routes/configRoutes');
const { getUsers } = require("./controllers/userCtrl");
const { updateChat, getMissions, setChat } = require("./controllers/missionCtrl");
const missionModel = require("./models/missionModel");
const userModel = require("./models/userModel");
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "auth-token"],
  })
);
routesInit(app);
server.listen(process.env.PORT, (err) => {
  if(err) return console.log(err);
  
  console.log("Server - running.");
});


mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("DB - connected.");
  })
  .catch((err) => {
    console.log(err);
  });
