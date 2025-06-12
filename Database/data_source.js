require("reflect-metadata");
const { DataSource } = require("typeorm");
const User = require("./../entities/UserEntity");
const Course = require("./../entities/CourseEntity");
const Enrollment = require("./../entities/EnrollmentEntity");
const Payment = require("./../entities/PaymentEntity");
const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // استخدم رابط الاتصال من متغير البيئة
  synchronize: true,
  logging: false,
  entities: [User, Course, Enrollment, Payment],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
