const { AppDataSource } = require("./../Database/data_source");
const AppError = require("./../error/err");

exports.getAllCourses = async (ifAdmin, statusFilter, titleFilter) => {
  try {
    const courseRepository = AppDataSource.getRepository("Course");

    // استخدام QueryBuilder لتحميل العلاقة instructor وتحديد الحقول
    const query = courseRepository
      .createQueryBuilder("course")
      .select([
        "course.id",
        "course.title",
        "course.status",
        "course.description",
        "course.price",
        "course.image",
        "course.category",
        "course.preRequisites",
        "course.createdAt",
        "course.updatedAt",
        "instructor.id",
        "instructor.name",
        "instructor.email",
      ])
      .leftJoin("course.instructor", "instructor");
    if (ifAdmin) {
      if(statusFilter){
        query.where("course.status = :status", { status: statusFilter });
      }
      else{
        query.where("course.status IN (:...statuses)", {
          statuses: ["approved", "draft", "pending", "rejected", "archived"],
        });
            }
    }
    else {
      query.where("course.status = :status", { status: "approved" });
    }

    // إضافة فلتر العنوان
    if (titleFilter) {
      query.andWhere("course.title ILIKE :title", { title: `%${titleFilter}%` });
    }

    return await query.getMany();

  } catch (err) {
    throw err;
  }
};

exports.createCourse = async (courseData) => {
  try {
    const courseRepository = AppDataSource.getRepository('Course');
    const course = courseRepository.create(courseData);
    return await courseRepository.save(course);
  } catch (err) {
    if (err.code === "23505") {      
      throw new AppError(err.detail, 400);
    }
    throw err;
  }
};
exports.updateCourse = async (courseId, courseData) => {
  try {
    const courseRepository = AppDataSource.getRepository("Course");
    const courseToUpdate = await courseRepository.findOne({
      where: { id: courseId },
    });
    if (!courseToUpdate) {
      throw new Error('no course with this id'); // أو يمكنك رمي خطأ هنا
    }
    Object.assign(courseToUpdate, courseData);
    
    const updatedCourse = await courseRepository.save(courseToUpdate);
    return updatedCourse;

  } catch (err) {
    throw err;
  }
};
exports.getCourseById = async (courseId) => {
  try {
    const courseRepository = AppDataSource.getRepository("Course");

    // استخدام QueryBuilder لتحميل العلاقة instructor وتحديد الحقول
    return await courseRepository
      .createQueryBuilder("course") // ابدأ الاستعلام على كيان Course
      .select([
        // حدد الحقول التي تريد جلبها من الكورس
        "course.id",
        "course.title",
        "course.status",
        "course.description",
        "course.price",
        "course.image",
        "course.category",
        "course.preRequisites",
        "course.createdAt",
        "course.updatedAt",
        // حقول من المدرب (باستخدام اسم العلاقة المستعار "instructor")
        "instructor.id", // جلب ID المدرب
        "instructor.name", // جلب اسم المدرب
        // يمكنك إضافة حقول أخرى من المدرب هنا إذا أردت ظهورها (مثل photo, email)
        // "instructor.photo",
        "instructor.email",
      ])
      .leftJoin("course.instructor", "instructor")
      .where(" course.id = :courseId ", {
        courseId,
      })
      .getOne(); 

  } catch (err) {
    throw err;
  }
}