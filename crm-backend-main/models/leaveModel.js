const mongoose = require("mongoose")

const LeaveSchema = new mongoose.Schema(
{

Reason: {
  type: String,
  required: [true, "Please Write A Reason"]
},

    Leavetype: {
      type: String,
      enum: ["sick", "casual", "vacation", "emergency", "other"],
      required: [true, "Please Select A Leave-Type"]
    },
   
   startDate: {
    type: Date,
    required: [true, "Please select start date"],
  },

  endDate: {
    type: Date,
    required: [true, "Please select end date"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  user:
  { 
    type: mongoose.Schema.Types.ObjectId,
    ref : 'user',
    required: [true, "User is required"],
  }
}
)

module.exports = mongoose.model("leaveapply" ,LeaveSchema)