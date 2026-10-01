const express = require("express");
const leaveRouter = express.Router();
const authController = require("../controller/authController");
const leaveController = require("../controller/leavecontroller"); 

leaveRouter.route("/").get(authController.verifytoken,leaveController.getleave);
leaveRouter.route("/").post(authController.verifytoken, leaveController.applyleave);
leaveRouter.route('/all').get(authController.verifytoken, leaveController.getAllLeave);
leaveRouter.route("/:id").delete(authController.verifytoken, leaveController.deleteleave);
leaveRouter.route("/:id/status").put(authController.verifytoken, leaveController.updatestatus);

module.exports = leaveRouter;
