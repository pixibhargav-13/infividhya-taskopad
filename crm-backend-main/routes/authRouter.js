const express = require("express")
const authRouter = express.Router()
const authController = require("../controller/authController")

authRouter.route('/register').post(authController.register)
authRouter.route('/login').post(authController.login)
authRouter.route('/user').get(authController.getAllUsers)
module.exports = authRouter;