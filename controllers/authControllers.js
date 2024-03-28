import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import authServices from "../services/authServices.js";
import path from "path";
import fs from "fs/promises";
import dotenv from "dotenv";
import imageSize from "../middlewares/imageSize.js";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

dotenv.config();

const { JWT_SECRET, BASE_URL } = process.env;

const tmpPath = path.resolve("tmp");

const avatarsPath = path.resolve("public", "avatars");
console.log(avatarsPath);

const signup = async(req, res) => {
  const { email, subscription } = req.body;
  const user = await authServices.findUser({ email, subscription });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const newUser = await authServices.register({
    ...req.body,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
   
  const user = await authServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "verificationToken not found");
  }

  
  await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken:  null});

  res.json({
    message: "Email verification successful"
  });
};


const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Email already verified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/verify/${user.verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent successfully",
  });
};

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if(!user) {
         throw HttpError(401, "Email or password is wrong"); 
    }
    if (!user.verify) {
      throw HttpError(401, "Email not verify");
    }

    const comparePassword = await authServices.validatePassword(password, user.password);
    if(!comparePassword) {
        throw HttpError(401, "Email or password is wrong");
    }

    const {_id: id} = user;
    const payload = { id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h"} );
    await authServices.updateUser({ _id: id }, { token });
    
    res.json({ token })
};

const getCurrent = async(req, res) => {
    const { email, subscription } = req.user;

        res.json({ email, subscription })
};

const logout = async(req, res) => {
    const { _id } = req.user;
    const user = await authServices.findUser({ _id });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    await authServices.updateUser({ _id }, { token:"" });
    res.json({ message: "Logout success" })

};

const variousSubscription = async (req, res) => {
    const { _id } = req.user;
    const { subscription } = req.body;
    const updatedUser = await authServices.updateUser(_id, { subscription });
    if (!updatedUser) {
      return res.status(400).json({ error: "Invalid subscription value" });
    }
    res.json({ message: "Successfully Updated" });
  };

const updateAvatar = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "The file was not attached" });
    }
    const { path: oldPath, originalname } = req.file;
    const { _id: userId } = req.user;
  
    await fs.mkdir(tmpPath, { recursive: true });
  
    await imageSize(oldPath);
  
    const newImageName = `${userId}_${uuidv4()}${path.extname(originalname)}`;
  
    const newPath = path.join(avatarsPath, newImageName);
    await fs.rename(oldPath, newPath);
  
    const updatedUser = await authServices.updateUser(userId, {
      avatarURL: `/avatars/${newImageName}`,
    });
  
    res.status(200).json({
      avatarURL: updatedUser.avatarURL,
    });
  };

export default {
    signup: ctrlWrapper(signup),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    variousSubscription: ctrlWrapper(variousSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
}
