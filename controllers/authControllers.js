import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import authRouter from "../routes/authRouter.js";

import authServices from "../services/authServices.js"
import jwt from "jsonwebtoken";

const {JWT_SECRET} = process.env;

const signup = async(res, req) => {
    const {email} = req.body;
    const user = await authRouter.findUser({email});
    if(user) {
        throw HttpError(409, "Email in use");
    }
    const newUser = await authServices.signup(req.body);
    res.status(201).json({
        user: newUser.username,
        email: newUser.email,
    })
}

const signin = async(res, req) => {
    const {email, password} = req.body;
    const user = await authServices.findUser({email});
    if(!user) {
         throw HttpError(401, "Email or password valid"); 
    }
    const comparePassword = await authServices.validatePassword(password, user.password);
    if(!comparePassword) {
        throw HttpError(401, "Email or password valid");
    }

    const {_id: id} = user;
    const payload = {
        id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await authServices.updateUser({_id: id}, {token});
    
    res.json({
        token,
    })
}

const getCurrent = async(req, res) => {
    const {username, email} = req.user;

        res.json({
            username,
            email,
        })
}

const signout = async(req, res) => {
    const {_id} = req.user;
    await authServices.updateUser({_id}, {token:""});

    res.json({
        message: "Signout success"
    })

}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
}