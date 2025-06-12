const {EntitySchema} = require("typeorm");
module.exports = new EntitySchema({
  name: "Enrollment",
  tableName: "enrollments",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    progress: {
      type: "float",
      default: 0,
    },
    completed: {
      type: "boolean",
      default: false,
    },
    enrolledAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    student: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "studentId",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
    course: {
      target: "Course",
      type: "many-to-one",
      joinColumn: {
        name: "courseId",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
  },
});