const userService = require('./../services/user.service');

exports.getAllUsers = async (req, res, next) => {
  try {
    console.log(req.user);
    const users = await userService.getAllUsers();
    res.status(200).json({
      status: 'success',
      length: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    next(err);
  }
};
