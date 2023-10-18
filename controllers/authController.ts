const User = require("../models/User")
const Test = require("../models/Test")
const TestResult = require("../models/TestResult")

import bcrypt, { compareSync } from "bcrypt"
import jwt from "jsonwebtoken"
const { validationResult } = require("express-validator")
import { Request, Response } from 'express';
import { IUser } from "../types/test";


const generateAccessToken = (id: any, roles: any) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.SECRET_WORD, { expiresIn: "24h" })
}

class AuthController {
    public async registration(req: Request, res: Response) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: "Недопустиме значення одного з полів", errors })
            }
            const { username, login, password } = req.body
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(409).json({ message: "Користувач з таким ім'ям вже існує" })
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({ login, username, password: hashPassword })
            await user.save()
            return res.json({ message: "Користувач успішно зареєстрований 🥳, тепер ви можете увійти за введеними даними!" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Помилка реєстрації" })
        }
    }
    public async login(req: Request, res: Response) {
        try {
            const { login, password } = req.body
            const user = await User.findOne({ login })
            if (!user) {
                return res.status(401).json({ message: `Користувача з логіном ${login} не знайдено` })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                if (user.wrongPasswordEnteredTimes < 5) {
                    user.wrongPasswordEnteredTimes++
                }
                if (user.wrongPasswordEnteredTimes >= 5) {
                    user.isBlocked = true
                }
                await user.save()
                return res.status(401).json({ message: "Введено невірний пароль" })
            }
            await user.save()
            const token = generateAccessToken(user._id, user.roles)
            return res.json({ token, message: "Вас успішно авторизовано 🥳" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Помилка авторизації" })
        }
    }
    public async check(req: Request, res: Response) {
        try {
            const user = await User.findOne({ id: req.user })
                // .populate({
                //     path: 'testResultsById',
                //     populate: {
                //         path: 'testResultsById.question',
                //     },
                // })
                .populate({
                    path: 'tests',
                    populate: {
                        path: 'questions',
                    }
                })
                .exec();

            const { _id, login, username, tests, testResultsById } = user as IUser
            return res.json({ _id, login, username, tests, testResultsById });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Помилка перевірки авторизації" });
        }
    }

}

export default new AuthController()
