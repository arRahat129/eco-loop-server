import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../lib/sendResponse";

const JWT_SECRET = process.env.JWT_SECRET || "eco-loop-secret-key";

export interface AuthRequest extends Request {
    user?: { id: string; email: string; role?: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return sendResponse({ res, status: 401, success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role?: string };
        req.user = decoded;
        next();
    } catch {
        return sendResponse({ res, status: 401, success: false, message: "Unauthorized: Invalid or expired token" });
    }
}
