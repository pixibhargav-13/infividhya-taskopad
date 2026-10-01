const express = require('express');
const holidayRouter = express.Router();
const holidayController = require('../controller/holidayController');
const authController = require('../controller/authController');

holidayRouter.route('/').get(authController.verifytoken, holidayController.getholiday)
holidayRouter.route('/').post(authController.verifytoken, holidayController.addholiday)
 holidayRouter.route('/:id').delete(authController.verifytoken, holidayController.deleteholiday)
 holidayRouter.route('/:id').put(authController.verifytoken, holidayController.updateholiday)

module.exports = holidayRouter 