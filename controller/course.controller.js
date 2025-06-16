const courseService = require('./../services/course.service');
const catchAsync = require('./../error/catchAsyn');
const AppError = require('./../error/err');

exports.createCourse = catchAsync(async (req, res, next) => {
    const { title, description, price } = req.body;
    let instructorId = req.body.instructorId;
    
    if (instructorId){
            return next(new AppError(`You are so scammer😂 `, 404));
    }
      if (!title || !description || !price) {
        return next(
          new AppError(
            `Please provide ${!title ? "title, " : ""}${
              !description ? "description " : ""
            }${!price ? ", price " : ""}`,
            400
          )
        );
      }
    const instructorData = req.user;    

    const course = await courseService.createCourse({
      title,
      description,
      price,
      instructor: instructorData.id,
    });
    
    const {instructor,...courseData} = course;
    const data = {
      ...courseData,
      instructor: {
        name: instructorData.name,
        email: instructorData.email,
        photo: instructorData.photo,
      },
    };
    res.status(201).json({ 
        status: 'success',
        data
    });
});

exports.getOneCourse = catchAsync(async (req, res, next) => {
  const course = await courseService.getCourseById(req.params.id);
  if (!course) {
    return next(new AppError("Not found this course", 400));
  }

  // إذا الكورس غير approved، اسمح فقط للأدمن أو صاحب الطلب المسجل دخول
  if (
    course.status !== "approved" && // بدون مسافة زائدة!
    (!req.user || req.user.role !== "admin")
  ) {
    return next(new AppError("This course is not approved yet", 400));
  }

  res.status(200).json({
    status: "success",
    data: course,
  });
});

exports.getAllCourses = catchAsync(async (req, res, next) => {
  let courses;
  const statusFilter = req.query.status || undefined;
  const titleFilter = req.query.title || undefined;

  if (req.user && req.user.role === "admin") {
    courses = await courseService.getAllCourses(true, statusFilter, titleFilter);
    
  } else {
    courses = await courseService.getAllCourses(
      false,
      "approved",
      titleFilter
    );
  }
  res.status(200).json({ courses });
}); 

exports.updateCourse = catchAsync(async (req, res, next) => {
    const courseId= req.param.id;
    if(req.body.instructor){
        return next(new AppError("You can't change the instructor", 401));
    }
    const course = await courseService.updateCourse(courseId,req.body);
    
    res.status(201).json({
        status:'success',
        data:course
    })
});
