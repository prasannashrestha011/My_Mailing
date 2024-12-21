import { Router } from "express";
import { authenticateUser, refreshAccessTokenHandler, registerUser } from "../controllers/authController";

const route=Router()

route.post("/register",registerUser)
route.post("/login",authenticateUser)
route.post("/refresh-token",refreshAccessTokenHandler)
export default route