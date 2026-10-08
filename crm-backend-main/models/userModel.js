const mongoose = require("mongoose");

const EmpSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "firstname is required"],
    },
    lastName: {
        type: String,
        required: [true, "lastname is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
        type: String,
        enum: ["emp", "admin"],
        default: "emp",
        required: true,
    }
});

module.exports = mongoose.models.user || mongoose.model("user", EmpSchema);
