const { AppDataSource } = require('./../Database/data_source');
const AppError = require('./../error/err');
exports.getAllUsers = async () => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    return await userRepository.find();
  } catch (err) {
    throw err;
  }
};

exports.getUserById = async (id,select) => {
  try {

    const userRepository = AppDataSource.getRepository("User");
    if(select){
    return await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id })
      .getOne();
    }
    return await userRepository.findOneBy({ id });
  } catch (err) {
    throw err;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
    return user;
  } catch (err) {
    throw err;
  }
};

exports.createUser = async (data) => {
  try {
    const userRepository = AppDataSource.getRepository('User');
    const user = userRepository.create(data);
    return await userRepository.save(user);
  } catch (err) {
    if (err.code === "23505") {      
      throw new AppError(err.detail, 400);
    }
    throw err;
  }
};

exports.deleteUser = async (id) => {
  try {
    const userRepository = AppDataSource.getRepository('User');
    return await userRepository.delete(id);
  } catch (err) {
    throw err;
  }
};
exports.updateUserWithSave = async (user) => {
  const userRepository = AppDataSource.getRepository("User");
  return await userRepository.save(user);
};
exports.findUserByResetToken = async (hashedToken) => {
  const userRepository = AppDataSource.getRepository('User');
  return await userRepository.findOneBy({ resetPasswordToken: hashedToken });
};
exports.findUserByProviderId = async (pro, proId) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    return await userRepository.findOneBy({ provider: pro, profileId: proId });
  } catch (err) {
    throw err;
  }
};