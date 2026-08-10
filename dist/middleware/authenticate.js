"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jose_1 = require("jose");
const sendResponse_1 = require("../lib/sendResponse");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const JWKS_URL = `${FRONTEND_URL}/api/auth/jwks`;
// Cache the JWKS so we don't fetch on every request
const JWKS = (0, jose_1.createRemoteJWKSet)(new URL(JWKS_URL));
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, JWKS, {
            issuer: FRONTEND_URL,
            audience: FRONTEND_URL,
        });
        req.user = payload;
        next();
    }
    catch {
        return (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Unauthorized: Invalid or expired token" });
    }
}
