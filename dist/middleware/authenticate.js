"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendResponse_1 = require("../lib/sendResponse");
const JWT_SECRET = process.env.JWT_SECRET || "eco-loop-secret-key";
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Unauthorized: Invalid or expired token" });
    }
}
