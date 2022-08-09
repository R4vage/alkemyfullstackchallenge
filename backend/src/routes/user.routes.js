import express from "express";
import { authenticate, createNewUser } from "../controllers/user.controllers.js";




const userRouter = express.Router();

userRouter.post("/", createNewUser)
userRouter.post("/login", authenticate);


export default userRouter