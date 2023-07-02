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
        client.emit("connected", user);
      }
    })

    client.on('send', async({mission, token}) =>{
      try {
        let allUsers = await getUsers();
        let user = allUsers.find(user => user.token == token);
        if(user){

          let newMission = await updateChat(mission);
          if(newMission){
            console.log(newMission);

            users.map((user, i)=>{
            io.to(user.id).emit('message', newMission)
            })
          }
        }
      } catch (error) {
        console.log(error);
      }
    })
      client.on('disconnect', () =>{
        console.log(users);
        users = users.filter((user)=>user.id !== client.id);
        console.log('User disconnected');
        client.off('disconnect', () =>{
          console.log("Disconnect");
        })
      })
  })




require("dotenv").config();
const {routesInit} = require('./routes/configRoutes');
const { getUsers } = require("./controllers/userCtrl");
const { updateChat } = require("./controllers/missionCtrl");
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
// wsCtrl(app);


mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("DB - connected.");
  })
  .catch((err) => {
    console.log(err);
  });
