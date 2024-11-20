"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function default_1(req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Користувач не авторизований" });
        }
        const decodedData = jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD);
        req.user = decodedData;
        next();
    }
    catch (e) {
        return res.status(400).json({ message: "Користувач не авторизований" });
    }
}
exports.default = default_1;
//# sourceMappingURL=authMiddleware.js.map