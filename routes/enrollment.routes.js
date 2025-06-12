const express = require("express");
const router = express.Router();
const enrollController = require("./../controller/enrollment.controller");
const authController = require('./../controller/auth.controller');
router.post('/:courseId',
  authController.protect,
  authController.restricted("student"),
  enrollController.createEnrollment
);
module.exports = router;
