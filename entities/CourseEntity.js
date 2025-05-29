const { EntitySchema} = require('typeorm');
module.exports = new EntitySchema({
  name: "Course",
  tableName: "courses",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 100,
    },
    status: {
      type: "enum",
      enum: ["draft", "pending", "approved", "rejected", "archived"],
      default: "draft",
    },
    description: {
      type: "text",
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    image: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    category: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    preRequisites: {
      type: "text",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    instructor: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "instructorId",
        referencedColumnName: "id",
      },
      inverseSide: "courses",
    },
  },
});