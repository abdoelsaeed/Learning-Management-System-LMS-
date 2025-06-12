const { EntitySchema } = require("typeorm");

const Payment = new EntitySchema({
  name: "Payment",
  tableName: "payments",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    student_id: {
      type: "int",
    },
    course_id: {
      type: "int",
    },
    sessionId: {
      type: "varchar",
      nullable: false,
      unique: true, // عادة ما يكون معرف الجلسة فريدًا
    },
    amount: {
      type: "float",
    },
    payment_method: {
      type: "varchar",
      nullable: false, // قد لا يكون هناك طريقة دفع محددة دائماً فوراً
    },
    payment_date: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "student_id" },
      onDelete: "CASCADE",
    },
    course: {
      target: "Course",
      type: "many-to-one",
      joinColumn: { name: "course_id" },
      onDelete: "CASCADE",
    },
  },
});

module.exports = Payment; 