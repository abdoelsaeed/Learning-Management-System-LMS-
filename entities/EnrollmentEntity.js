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
    user_id: {
      type: "int",
    },
    course_id: {
      type: "int",
    },
    enrolled_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    progress: {
      type: "float",
      default: 0,
    },
    completed: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
    course: {
      target: "Course",
      type: "many-to-one",
      joinColumn: {
        name: "course_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
  },
});