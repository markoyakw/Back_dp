"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/User");
const Test = require("../models/Test");
const TestResult = require("../models/TestResult");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { validationResult } = require("express-validator");
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };
    return jsonwebtoken_1.default.sign(payload, process.env.SECRET_WORD, { expiresIn: "24h" });
};
class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: "Недопустиме значення одного з полів", errors });
            }
            const { username, login, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(409).json({ message: "Користувач з таким ім'ям вже існує" });
            }
            const hashPassword = bcrypt_1.default.hashSync(password, 7);
            const user = new User({ login, username, password: hashPassword });
            await user.save();
            return res.json({ message: "Користувач успішно зареєстрований 🥳, тепер ви можете увійти за введеними даними!" });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Помилка реєстрації" });
        }
    }
    async login(req, res) {
        try {
            const { login, password } = req.body;
            const user = await User.findOne({ login });
            if (!user) {
                return res.status(401).json({ message: `Користувача з логіном ${login} не знайдено` });
            }
            const validPassword = bcrypt_1.default.compareSync(password, user.password);
            if (!validPassword) {
                if (user.wrongPasswordEnteredTimes < 5) {
                    user.wrongPasswordEnteredTimes++;
                }
                if (user.wrongPasswordEnteredTimes >= 5) {
                    user.isBlocked = true;
                }
                await user.save();
                return res.status(401).json({ message: "Введено невірний пароль" });
            }
            await user.save();
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token, message: "Вас успішно авторизовано 🥳" });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Помилка авторизації" });
        }
    }
    async check(req, res) {
        try {
            const user = await User.findOne({ id: req.user })
                .populate({
                path: 'tests',
                populate: {
                    path: 'questions',
                }
            })
                .exec();
            const { _id, login, username, tests, testResultsById } = user;
            return res.json({ _id, login, username, tests, testResultsById });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Помилка перевірки авторизації" });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map