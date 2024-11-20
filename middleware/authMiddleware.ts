import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

export default function (req: Request, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(400).json({ message: "Користувач не авторизований" })
        }
        const decodedData = jwt.verify(token, process.env.SECRET_WORD)
        req.user = decodedData
        next()
    } catch (e) {
        return res.status(400).json({ message: "Користувач не авторизований" })
    }
}