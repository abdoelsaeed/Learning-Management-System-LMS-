const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      nullable: false,
      type: "varchar",
      length: 50,
    },
    email: {
      nullable: false,
      type: "varchar",
      unique: true,
    },
    password: {
      nullable: true,
      type: "varchar",
      minLength: 6,
      maxLength: 35,
      select: false,
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
    role: {
      type: "enum",
      enum: ["admin", "student", "instructor"],
      default: "student",
    },
    phone: {
      type: "varchar",
      length: 11,
      nullable: true,
    },
    address: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    resetPasswordToken: {
      type: "varchar",
      nullable: true,
    },
    resetPasswordExpires: {
      type: "timestamp",
      nullable: true,
    },
    provider: {
      type: "enum",
      enum: ["google", "facebook"],
      nullable: true,
    },
    profileId: {
      type: "varchar",
      nullable: true,
    },

    photo: {
      type: "varchar",
      nullable: true,
    },
  },
});
