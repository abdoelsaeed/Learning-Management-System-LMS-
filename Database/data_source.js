require("reflect-metadata"); // أضفها هنا كإحتياط لو مش موجودة في server.js
const { DataSource } = require("typeorm");
const path = require("path");
const User = require("./../entities/UserEntity");
const Course = require("./../entities/CourseEntity");
const Enrollment = require("./../entities/EnrollmentEntity");
const Payment = require("./../entities/PaymentEntity");
// أضف كيانات تانية لو موجودة
// const Course = require("./entities/CourseEntity");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true, // خلّيها true مؤقتًا للـ Debugging
  entities: [Course, User, Enrollment, Payment], // استبدل Glob Pattern بقايمة صريحة
  migrations: [path.join(process.cwd(), "migrations", "*.js")],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false, // ضروري لـ Supabase
  },
});

module.exports = { AppDataSource };
