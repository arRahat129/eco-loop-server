import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { sendResponse } from "../lib/sendResponse";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const JWKS_URL = `${FRONTEND_URL}/api/auth/jwks`;

// Cache the JWKS so we don't fetch on every request
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export interface AuthRequest extends Request {
    user?: { id: string; email: string; name?: string; [key: string]: unknown };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return sendResponse({ res, status: 401, success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: FRONTEND_URL,
            audience: FRONTEND_URL,
        });

        req.user = payload as { id: string; email: string; name?: string };
        next();
    } catch {
        return sendResponse({ res, status: 401, success: false, message: "Unauthorized: Invalid or expired token" });
    }
}
