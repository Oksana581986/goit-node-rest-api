import User from "../models/User.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";

 
const findUser = filter => User.findOne(filter);

const signup = async(data) => {
    const hashPassword = await bcrypt.hash(data.password, 10);
    const avatarURL = await gravatar.url(data);
    return User.create({ ...data, password: hashPassword, avatarURL });
};


const validatePassword = (password, hashPassword) => bcrypt.compare(password, hashPassword);

const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

const deleteUsers = filter => User.deleteMany(filter);

export default {
findUser,
signup,
validatePassword,
updateUser,
deleteUsers,
};