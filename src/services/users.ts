import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { sendResponse } from "../lib/sendResponse";

const router = Router();

// CREATE User
router.post("/", async (req, res) => {
    try {
        const { id, password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await prisma.user.create({
            data: { ...(id ? { id } : {}), ...rest, password: hashedPassword },
            select: { id: true, email: true, name: true, role: true, isDeleted: true, createdAt: true, updatedAt: true },
        });
        sendResponse({ res, status: 201, success: true, message: "User created successfully", data });
    } catch (error: any) {
        // If synced user already exists (e.g. duplicate hook call), treat as success
        if (error.code === "P2002") {
            return sendResponse({ res, status: 200, success: true, message: "User already exists" });
        }
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// GET All Users (Non-deleted)
router.get("/", async (req, res) => {
    try {
        const data = await prisma.user.findMany({
            where: { isDeleted: false },
            select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
        });
        sendResponse({ res, success: true, message: "Users fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// GET User By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma.user.findFirst({
            where: { id: req.params.id, isDeleted: false },
            select: { id: true, email: true, name: true, role: true, reviews: true, createdAt: true, updatedAt: true },
        });
        if (!data) return sendResponse({ res, status: 404, success: false, message: "User not found" });
        sendResponse({ res, success: true, message: "User fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// PATCH User
router.patch("/:id", async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const updateData: any = { ...rest };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const data = await prisma.user.update({
            where: { id: req.params.id },
            data: updateData,
            select: { id: true, email: true, name: true, role: true, updatedAt: true },
        });
        sendResponse({ res, success: true, message: "User updated successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// SOFT DELETE User
router.delete("/:id", async (req, res) => {
    try {
        await prisma.user.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        sendResponse({ res, success: true, message: "User deleted successfully" });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

export default router;
