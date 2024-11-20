"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
function default_1(req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Користувач не авторизований" });
        }
        const decodedData = jwt.verify(token, process.env.SECRET_WORD);
        req.user = decodedData;
        next();
    }
    catch (e) {
        return res.status(400).json({ message: "Користувач не авторизований" });
    }
}
exports.default = default_1;
//# sourceMappingURL=authMiddleware.js.map