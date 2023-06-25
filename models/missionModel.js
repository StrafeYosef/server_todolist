const mongoose = require("mongoose");

const missionSchema = mongoose.Schema({
  // token of user 
  token: {
    type: Array,
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
    type: Array,
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
