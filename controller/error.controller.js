/* eslint-disable no-console */
const AppError = require("./../error/err");

// التعامل مع تكرار البيانات (duplicate key)
const handleDuplicateFieldsDB = async (err) => {
  const detail = err.detail || "";
  const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/); // استخراج اسم العمود والقيمة

  let field = "unknown";
  let value = "unknown";

  if (match) {
    field = match[1];
    value = match[2];
  }

  // مثال توضيحي لو عايز ترجمة ID إلى اسم

  const message = `Duplicate field "${field}": ${translated}. Please use a different value.`;
  return new AppError(message, 400);
};

// التعامل مع خطأ تحويل النوع
const handleCastErrorDB = (err) => {
  const column = err.column || "field";
  const value = err.value || "";
  const message = `Invalid ${column}: ${value}`;
  return new AppError(message, 400);
};

// التعامل مع خطأ التحقق من البيانات
const handleValidationErrorDB = (err) => {
 
    let message = "Invalid input data.";
    console.log('message:', message);

    // بعض أخطاء TypeORM تيجي فيها message بالشكل ده:
    // "null value in column \"title\" violates not-null constraint"
    if (err.detail) {
      const match = err.detail.match(
        /column\s+"(.+)"\s+violates not-null constraint/
      );
      if (match) {
        const field = match[1];
        message = `The field "${field}" is required but was not provided.`;
      } else {
        message = `Invalid input: ${err.detail}`;
      }
    } else if (err.message) {
      message = `Validation failed: ${err.message}`;
    }

    return new AppError(message, 400);
  };
  

// التعامل مع JWT
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// خطأ في وضع التطوير
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// خطأ في وضع التشغيل
const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // أخطاء غير متوقعة
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

// ميدلوير الرئيسي
module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, req, res);
  }
  let error = { ...err, message: err.message };
  if (err.code === "23505") {
    error = await handleDuplicateFieldsDB(err);
  }
  if (err.code === "22P02") {
    error = handleCastErrorDB(err);
  }
  if (err.name === "QueryFailedError") {
    error = handleValidationErrorDB(err);
  }
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
  return sendErrorProd(error, req, res);
};
