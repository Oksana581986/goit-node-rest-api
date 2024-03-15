import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import usersSchemas from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";


const authRouter = express.Router();

authRouter.post("/signup", validateBody(usersSchemas.userSignupSchema), authControllers.signup);

authRouter.post("/login", validateBody(usersSchemas.userSigninSchema), authControllers.login);

authRouter.get("/current",authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;