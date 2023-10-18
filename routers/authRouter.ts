import { Router } from 'express';
const authRouter = Router();

import authController from './../controllers/authController';
import { check } from 'express-validator';
import authMiddleware from "../middleware/authMiddleware"

authRouter.post('/registration', [
    check("username", "Ім'я користувача повинно бути довжиною від 3х до 16ти символів ").isLength({ min: 3, max: 16 }),
    check("password", "Пароль повинен бути довжиною від 3х до 16ти символів").isLength({ min: 3, max: 16 })
], authController.registration)
authRouter.post('/login', authController.login)
authRouter.get("/check", authMiddleware, authController.check)

export default authRouter