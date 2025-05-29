require("reflect-metadata");
const { DataSource } = require("typeorm");
const User = require("./../entities/UserEntity");
const Course = require("./../entities/CourseEntity");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "LMS",
  synchronize: true,
  logging: false,
  entities: [User, Course],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };
