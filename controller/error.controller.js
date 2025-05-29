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
  if (req.originalUrl.startsWith("/api")) {

    
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

// خطأ في وضع التشغيل
const sendErrorProd = (err, req, res) => {
  
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error("ERROR 💥", err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }

  console.error("ERROR 💥", err);
  return res.status(500).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

// ميدلوير الرئيسي
module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // لو عايز تلغي NODE_ENV وتخلي دايمًا production behavior احذف السطر اللي تحت
  if (process.env.NODE_ENV === "development") {
    
    return sendErrorDev(err, req, res);
  }

  // نسخة جديدة من الخطأ
  let error = { ...err, message: err.message };

  // PostgreSQL / TypeORM-specific error handling
  if (err.code === "23505") {
    error = await handleDuplicateFieldsDB(err);
  }
  if (err.code === "22P02") {
    error = handleCastErrorDB(err);
  }
  if (err.name === "QueryFailedError") {
    error = handleValidationErrorDB(err);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // أرجع دائمًا JSON فقط
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    error: process.env.NODE_ENV === "development" ? err : undefined
  });
};
