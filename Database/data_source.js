require("reflect-metadata");
const { DataSource } = require("typeorm");
const User = require("./../entities/UserEntity");
const Course = require("./../entities/CourseEntity");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // استخدم رابط الاتصال من متغير البيئة
  synchronize: true,
  logging: false,
  entities: [User, Course],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
