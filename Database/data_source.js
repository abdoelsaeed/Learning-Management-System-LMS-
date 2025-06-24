require("reflect-metadata"); // أضفها هنا كإحتياط لو مش موجودة في server.js
const { DataSource } = require("typeorm");

// أضف كيانات تانية لو موجودة
// const Course = require("./entities/CourseEntity");
const path = require("path");

const entitiesPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../dist/entities/*.js")
    : path.join(__dirname, "../src/entities/*.js");

const User = require(path.join(__dirname, "../entities/UserEntity"));
const Course = require(path.join(__dirname, "../entities/CourseEntity"));
const Enrollment = require(path.join(
  __dirname,
  "../entities/EnrollmentEntity"
));
const Payment = require(path.join(__dirname, "../entities/PaymentEntity"));

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [Course, User, Enrollment, Payment],
  subscribers: [],
  ssl: { rejectUnauthorized: false },
});

module.exports = { AppDataSource };
