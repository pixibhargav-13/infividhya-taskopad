const mongoose = require("mongoose")

const HolidaySchema = new mongoose.Schema(
    {
        Name:
        {
            type: String,
            required: [true,"name is required"]
        },
        Date:
        {
            type:Date,
            required: [true,"Date is required"]
        },
        Day:
        {
         type: String,
        },
        Type:
        {
            type: String,
             enum: ["public", "religious", "company", "optional", "special"],
             required: [true, "Please select holiday type"],
        },
        updated_by:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'

        }
    }
)

module.exports = mongoose.model("holidays", HolidaySchema)