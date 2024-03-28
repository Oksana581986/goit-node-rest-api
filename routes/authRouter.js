import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import usersSchemas from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";



const authRouter = express.Router();

authRouter.post("/signup", validateBody(usersSchemas.userSignupSchema), authControllers.signup);

authRouter.post("/login", validateBody(usersSchemas.userSigninSchema), authControllers.login);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post ("/verify", validateBody(usersSchemas.userEmailSchema), authControllers.resendVerify);

authRouter.get("/current",authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch("/", authenticate, validateBody(usersSchemas.userSubscriptionSchema), authControllers.variousSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authControllers.updateAvatar);

export default authRouter;