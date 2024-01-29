import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({
            message: "Token not found or invalid syntax"
        });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({ message: "Login failed" });
    }
};

export { authMiddleware };
