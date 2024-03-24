import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import authServices from "../services/authServices.js";
import path from "path";
import fs from "fs/promises";
import gravatar from "gravatar";
import Jimp from "jimp";


const {JWT_SECRET} = process.env;

const avatarsPath = path.resolve("public", "avatars");
console.log(avatarsPath);

const signup = async(req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if(user) {
        throw HttpError(409, "Email in use");
    }
const avatarURL = gravatar.url(email);
const newUser = await authServices.signup({ ...req.body, avatarURL });
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
    })
};

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if(!user) {
         throw HttpError(401, "Email or password is wrong"); 
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
    const {_id} = req.user;
    const user = await authServices.findUser({ _id });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    await authServices.updateUser({_id}, {token:""});
    res.json({ message: "Signout success" })

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
    const { _id: id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);

    Jimp.read(oldPath)
    .then((image) => {
      return image.cover(250, 250).write(newPath);
    })
    .catch((err) => {
      console.error(err);
    });
    await fs.rename(oldPath, newPath);

    const avatarURL = path.join("avatars", filename);
    const user = await authServices.updateUser({ _id: id }, { avatarURL });
    res.json({
      avatarURL: user.avatarURL,
    });
  };
  
export default {
    signup: ctrlWrapper(signup),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    variousSubscription: ctrlWrapper(variousSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),

}