const mongoose = require("mongoose");

const missionSchema = mongoose.Schema({
  // token of user 
  token: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  startedAt: {
    type: String,
    required: true,
  },
  daysLeft: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  responsibility: {
    type: String,
    required: true,
  },
  endedAt: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  noteResponsibility: String,
  noteCommander: String,
  missionId: {
    type: String,
    required: true,
    unique: true
  },
  chat: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("missions", missionSchema);
