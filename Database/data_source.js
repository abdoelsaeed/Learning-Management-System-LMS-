// require("reflect-metadata"); // تم نقله إلى server.js
const { DataSource } = require("typeorm");
const path = require('path'); // استيراد وحدة path

// إزالة استيرادات الكيانات الفردية
// const User = require("./../entities/UserEntity");
// const Course = require("./../entities/CourseEntity");
// const Enrollment = require("./../entities/EnrollmentEntity");
// const Payment = require("./../entities/PaymentEntity");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // استخدم رابط الاتصال من متغير البيئة
  synchronize: false, // تم التغيير إلى false للإنتاج
  logging: false,
  // استخدام path.join و process.cwd() لاكتشاف الكيانات تلقائياً في بيئة الإنتاج
  entities: [path.join(process.cwd(), "entities", "*.js")],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
