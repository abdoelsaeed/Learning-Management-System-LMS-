require("reflect-metadata");
const app = require("./app");
const { AppDataSource } = require("./Database/data_source");

const PORT = process.env.PORT || 3000;

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥", err);
  // يمكنك هنا إرسال الخطأ للـ globalErrorHandler أو إغلاق السيرفر بأمان
});
AppDataSource.initialize()
  .then(() => {
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
          console.log("Database connected!");
          console.log("Loaded entities:", AppDataSource.options.entities);
        });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

module.exports = app;
