import { Router } from "express";
import {handleRegister, handleLogin, handleVerification} from "../controllers/auth.controller.js"
import {registerMiddleware, loginMiddleware, verificationMiddleware} from "../middlewares/auth.middleware.js"

const authRouter = Router()

authRouter.post('/register', registerMiddleware, handleRegister)
authRouter.post('/login', loginMiddleware, handleLogin)
authRouter.get('/verify', verificationMiddleware, handleVerification)

export default authRouter