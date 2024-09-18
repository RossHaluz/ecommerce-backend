const { HttpError, CtlrWrapper } = require("../helpers");
const { UserModel } = require("../modules/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require("fs").promises;
const crypto = require("crypto");

const pathDir = path.join(__dirname, '..', 'public', 'avatars');

const userRegister = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user) {
    throw HttpError(400, "User alredy exist");
  }

  const hashPasword = await bcrypt.hash(password, 10);

  const createUser = await UserModel.create({
    ...req.body,
    password: hashPasword,
  });

  if (!createUser) {
    throw HttpError(400, "Something went wrong");
  }

  const payload = {
    id: createUser?._id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });

  const newUser = await UserModel.findByIdAndUpdate(
    createUser?._id,
    { token },
    { new: true }
  );

  res.json({
    newUser,
    message: "User register",
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const payload = {
    id: user?._id,
  };

  const comarePassword = await bcrypt.compare(password, user?.password);
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });

  if (!comarePassword) {
    throw HttpError(400, "Email or password is not valid");
  }

  const loginUser = await UserModel.findByIdAndUpdate(
    user?._id,
    { token },
    { new: true }
  );

  res.json({
    loginUser,
    message: "Success login",
  });
};

const userLogout = async (req, res) => {
  const { id } = req.userId;

  const logoutUser = await UserModel.findByIdAndUpdate(
    id,
    { token: "" },
    { new: true }
  );

  if (!logoutUser) {
    throw HttpError(400, "Somethin went wrong...");
  }

  res.json({
    logoutUser,
    message: "Success logout",
  });
};

const userCurrent = async (req, res) => {
    const {id} = req.userId;

    const user = await UserModel.findById(id);

    if(!user){
        throw HttpError(404, "User not found")
    }

    res.json({
        user,
        message: "Current user"
    })
};

const updateUser = async (req, res) => {
  const {id} = req.userId;

  if(req.file){
    const {path: tempDir, originalname} = req.file;

    const filename = `${crypto.randomUUID()}_${originalname}`;
    const resultDir = path.join(pathDir, filename);

    await fs.rename(tempDir, resultDir);

    const updateUserWithAvatar = await UserModel.findByIdAndUpdate(id, {...req.body, avatar: filename}, {new: true});
    
    return res.json({
      message: 'UYpdate user with avatar',
      updateUserWithAvatar
    })
  }

const updateUser = await UserModel.findByIdAndUpdate(id, {...req.body}, {new: true});

res.json({
    updateUser,
    message: 'User successfuly update'
})

}

const changePassword = async (req, res) => {
  const {id} = req.userId;
  const {oldPassword, newPassword} = req.body;
  const user = await UserModel.findById(id);
  if(!user){
    throw HttpError(404, 'User not found')
  }

  const compareOldPassword = await bcrypt.compare(oldPassword, user?.password);

  if(!compareOldPassword){
    throw HttpError(400, 'Old password is not correct');
  }

  const hashNewPassword = await bcrypt.hash(newPassword, 10);

  const updateUserWithNewPass = await UserModel.findByIdAndUpdate(user?._id, {password: hashNewPassword}, {new: true});

  return res.json({
    updateUserWithNewPass,
    message: 'Password success updated'
  });
}

module.exports = {
  userRegister: CtlrWrapper(userRegister),
  userLogin: CtlrWrapper(userLogin),
  userLogout: CtlrWrapper(userLogout),
  userCurrent: CtlrWrapper(userCurrent),
  updateUser: CtlrWrapper(updateUser),
  changePassword: CtlrWrapper(changePassword)
};
