"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
const authController_1 = __importDefault(require("./../controllers/authController"));
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
authRouter.post('/registration', [
    (0, express_validator_1.check)("username", "Ім'я користувача повинно бути довжиною від 3х до 16ти символів ").isLength({ min: 3, max: 16 }),
    (0, express_validator_1.check)("password", "Пароль повинен бути довжиною від 3х до 16ти символів").isLength({ min: 3, max: 16 })
], authController_1.default.registration);
authRouter.post('/login', authController_1.default.login);
authRouter.get("/check", authMiddleware_1.default, authController_1.default.check);
exports.default = authRouter;
//# sourceMappingURL=authRouter.js.map