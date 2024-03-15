import User from "../models/User.js";
import bcrypt from "bcrypt";
 
const findUser = filter => User.findOne(filter);

const signup = async(data) => {
    const hashPassword = await bcrypt.hash(data.password, 10);
    return User.create({ ...data, password: hashPassword });
};


const validatePassword = (password, hashPassword) => bcrypt.compare(password, hashPassword);

const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export default {
findUser,
signup,
validatePassword,
updateUser,
};