const userService = require("./../services/user.service");
const AppError = require("../error/err");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const catchAsync = require("./../error/catchAsyn");
const { promisify } = require("util");
const Email = require("../utils/Email");

async function hashPassword(password){
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

exports.callback_Facebook = (req, res) => {
  if (req.user) {
    res.json({
      message: "Authentication successful",
      user: req.user,
    });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
};

exports.callback_google = (req, res) => {
  if (req.user) {
    
    
    res.json({
      message: "Authentication successful",
      user: req.user,
    });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
};


exports.signUp =catchAsync( async (req, res, next) => {
 
    const { password,email,name } = req.body;
    if (!password || !email || !name) {
        return next(new AppError("Please provide email, password and name", 400));
    }

    if (!validator.isEmail(req.body.email)) {
      return next(new AppError("Invalid email format.", 400));
    }
    const hashedPassword = await hashPassword(password);
    const user = await userService.createUser({ ...req.body, password: hashedPassword });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.cookie("jwt", token, {
      expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: true,
      httpOnly: true,
      secure: req.secure || req.header("x-forwarded-proto") === "https",
    });
      const url ="";

    await new Email(user, url).sendWelcome().catch(err => new Error(err) );
    user.password=undefined;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpires=undefined;
    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
});

exports.restricted = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.logIn = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    const user = await userService.findUserByEmail(email);
    if(!user){
      return next(new AppError("Invalid email or password", 401));
    }
    if(!user.password){
      return next(new AppError("This account is registered with social media", 401));
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    

    if (!isPasswordCorrect) {
      return next(new AppError("Invalid email or password", 401));
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    if(!token){
      return next(new AppError("Something went wrong", 401));
    }
    console.log(token);
    res.cookie("jwt", token, {
      expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: true,
      httpOnly: true,
      secure: req.secure || req.header("x-forwarded-proto") === "https",
    });
    user.password=undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    res.status(200).json({
        token,
        status: "success",
        data: {
        user,
      },
    });
});

exports.protect = catchAsync(async (req, res, next) => {
  // التحقق مما إذا كان المستخدم مسجل دخول بالفعل (Facebook/Google)
  if (req.isAuthenticated()) {
    // تسجيل الدخول عبر Facebook
    if (req.user.provider === "facebook") {
      
    }
    // تسجيل الدخول عبر Google
    else if (req.user.provider === "google") {
      
    }
    req.user = req.user;
    return next();
  }

  // تسجيل الدخول التقليدي (بريد إلكتروني وكلمة مرور)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! please log in to get access", 401)
    );
  }
  //2)Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3)check if user still exists يعني مامسحش الاكونت مثلا
  const currentUser = await userService.getUserById(decoded.id);

  
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does not exist", 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.logout = (req, res, next) => {
  // لو بتستخدم Passport والجلسات
  if (req.isAuthenticated && req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        
        return next(err);
      }

      req.session.destroy((err) => {
        if (err) {
          
          return next(err);
        }

        res.clearCookie("connect.sid");
        res.status(200).json({
          status: "success",
          message: "Logged out from session successfully!",
        });
      });
    });
  } else {
    // لو بتستخدم JWT فقط
    if(!req.cookies.jwt){
      return next(new AppError("You are not logged in! please log in to get access", 401));
    }
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      message: "Logged out from JWT successfully!",
    });
  }
};


exports.updatePassword = catchAsync(async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  if (newPassword.length < 6) {
    return next(new AppError("New password must be at least 6 characters long", 400));
  }
    if (!oldPassword || !newPassword) {
      return next(
        new AppError("Please provide old password and new password", 400)
      );
    }
  const user = await userService.getUserById(req.user.id,true);
  
  const isPasswordCorrect = await bcrypt.compare(oldPassword,user.password);
  
  if(!isPasswordCorrect){
    return next(new AppError("Your old password is incorrect",401));
  }
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await userService.updateUserWithSave(user);
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide email", 400));
  }
  const user = await userService.findUserByEmail(email);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  const hashedCode = await bcrypt.hash(code, 10);

  const url = `${req.protocol}://${req.get("host")}/resetPassword/${hashedCode}`;
  await new Email(user, url).sendPasswordReset(code);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  user.resetPasswordToken = hashedCode;
  user.resetPasswordExpires = expiresAt;
  await userService.updateUserWithSave(user);
  res.status(200).json({
    status: "success",
    message: "Password reset email sent",
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const  {newPassword,email}  = req.body;
  if(newPassword.length < 6){
    return next(new AppError("New password must be at least 6 characters long", 400));
  }
  if (!newPassword || !email) {
    return next(new AppError("Please provide new password and email ", 400));
  }
  const user = await userService.findUserByEmail(email);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const isPasswordCorrect = await bcrypt.compare(code, user.resetPasswordToken);
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid code", 401));
  }
  if (user.resetPasswordExpires < new Date()) {
    return next(new AppError("Code expired", 401));
  }
  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await userService.updateUserWithSave(user);
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});
