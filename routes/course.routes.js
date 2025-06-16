const express = require("express");
const router = express.Router();
const courseController = require("./../controller/course.controller");
const authController = require('./../controller/auth.controller');
router
  .route("/")
  .get( courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restricted("instructor"),
    courseController.createCourse
  );
  router.get(
    "/foradmin",
    authController.protect,
    authController.restricted("admin"),
    courseController.getAllCourses
  );
  router.get(
    "/:id",
    
    courseController.getOneCourse
  );
  router.get("/:id/foradmin",authController.protect,
    authController.restricted("admin"),
     courseController.getOneCourse);

  router
    .route("/:id")
    .patch(
      authController.protect,
      authController.restricted("instructor","admin"),
      courseController.updateCourse
    )


module.exports = router;
