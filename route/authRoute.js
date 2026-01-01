import express from "express";
import { signin, signup, signout } from "../controller/authUser.js";
import { authenticate } from "../middleware/auth.js";
const authRoute = express.Router();

authRoute.post("/sign-up", signup);
authRoute.post("/sign-in", signin);
authRoute.get("/sign-out", signout);

export default authRoute;
