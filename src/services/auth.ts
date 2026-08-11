import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { sendResponse } from "../lib/sendResponse";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "eco-loop-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password || !name) {
            return sendResponse({ res, status: 400, success: false, message: "Name, email and password are required" });
        }

        const existing = await prisma.user.findFirst({ where: { email } });
        if (existing) {
            return sendResponse({ res, status: 409, success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role: role ?? "USER" },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as jwt.SignOptions);

        sendResponse({ res, status: 201, success: true, message: "Registration successful", data: { user, token } });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse({ res, status: 400, success: false, message: "Email and password are required" });
        }

        const user = await prisma.user.findFirst({ where: { email, isDeleted: false } });
        if (!user) {
            return sendResponse({ res, status: 401, success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse({ res, status: 401, success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as jwt.SignOptions);

        const { password: _, ...userWithoutPassword } = user;

        sendResponse({ res, success: true, message: "Login successful", data: { user: userWithoutPassword, token } });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// GET ME (current user from token)
router.get("/me", authenticate, async (req: AuthRequest, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: { id: req.user!.id, isDeleted: false },
            select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
        });

        if (!user) {
            return sendResponse({ res, status: 404, success: false, message: "User not found" });
        }

        sendResponse({ res, success: true, message: "User fetched successfully", data: user });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

export default router;
