"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendResponse_1 = require("../lib/sendResponse");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "eco-loop-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password || !name) {
            return (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: "Name, email and password are required" });
        }
        const existing = await prisma_1.default.user.findFirst({ where: { email } });
        if (existing) {
            return (0, sendResponse_1.sendResponse)({ res, status: 409, success: false, message: "Email already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { email, password: hashedPassword, name, role: role ?? "USER" },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        (0, sendResponse_1.sendResponse)({ res, status: 201, success: true, message: "Registration successful", data: { user, token } });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: "Email and password are required" });
        }
        const user = await prisma_1.default.user.findFirst({ where: { email, isDeleted: false } });
        if (!user) {
            return (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        const { password: _, ...userWithoutPassword } = user;
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Login successful", data: { user: userWithoutPassword, token } });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// GET ME (current user from token)
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_1.default.user.findFirst({
            where: { id: decoded.id, isDeleted: false },
            select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
        });
        if (!user) {
            return (0, sendResponse_1.sendResponse)({ res, status: 404, success: false, message: "User not found" });
        }
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "User fetched successfully", data: user });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 401, success: false, message: "Invalid or expired token" });
    }
});
exports.default = router;
