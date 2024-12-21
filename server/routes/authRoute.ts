import { Router } from "express";
import { authenticateUser, registerUser } from "../controllers/authController";

const route=Router()

route.post("/register",registerUser)
route.post("/login",authenticateUser)

export default route