const mongoose = require("mongoose");

const missionSchema = mongoose.Schema({
  // token of user 
  token: {
    type: String,
    required: true,
  },
  //כותרת הפגישה
  title: {
    type: String,
    required: true,
  },
  //מועד הפגישה
  startedAt: {
    type: String,
    required: true,
  },
  //ימים שנותרו
  daysLeft: {
    type: String,
    required: true,
  },
  //פירוט המשימה
  details: {
    type: String,
    required: true,
  },
  //אחראיות
  responsibility: {
    type: String,
    required: true,
  },
  //תג"ב
  endedAt: {
    type: String,
    required: true,
  },
  //סטטוס
  status: {
    type: String,
    required: true,
  },
  //הערות אחראי
  noteResponsibility: String,
  //הערות מפקד
  noteCommand: String,
  //מזהה
  missionId: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model("missions", missionSchema);
