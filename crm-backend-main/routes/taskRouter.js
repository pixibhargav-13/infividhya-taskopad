const express = require("express")
const taskRouter = express.Router()
const authController = require("../controller/authController")
const taskController = require("../controller/taskController")

taskRouter.route('/').get(taskController.getAllTasks)
taskRouter.route('/').post(authController.verifytoken,taskController.createtask)

taskRouter.route('/:id').delete(authController.verifytoken, taskController.deletetask)
taskRouter.route('/:id').put(authController.verifytoken, taskController.updatetask)

module.exports = taskRouter;
 