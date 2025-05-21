const express = require('express');
const userService = require('./../services/user.service');

exports.getAllUsers = async (req, res, next) => {
  try {
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
