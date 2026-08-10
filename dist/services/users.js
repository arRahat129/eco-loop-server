"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendResponse_1 = require("../lib/sendResponse");
const router = (0, express_1.Router)();
// CREATE User
router.post("/", async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const data = await prisma_1.default.user.create({
            data: { ...rest, password: hashedPassword },
            select: { id: true, email: true, name: true, role: true, isDeleted: true, createdAt: true, updatedAt: true },
        });
        (0, sendResponse_1.sendResponse)({ res, status: 201, success: true, message: "User created successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// GET All Users (Non-deleted)
router.get("/", async (req, res) => {
    try {
        const data = await prisma_1.default.user.findMany({
            where: { isDeleted: false },
            select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Users fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// GET User By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma_1.default.user.findFirst({
            where: { id: req.params.id, isDeleted: false },
            select: { id: true, email: true, name: true, role: true, reviews: true, createdAt: true, updatedAt: true },
        });
        if (!data)
            return (0, sendResponse_1.sendResponse)({ res, status: 404, success: false, message: "User not found" });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "User fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// PATCH User
router.patch("/:id", async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const updateData = { ...rest };
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        const data = await prisma_1.default.user.update({
            where: { id: req.params.id },
            data: updateData,
            select: { id: true, email: true, name: true, role: true, updatedAt: true },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "User updated successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// SOFT DELETE User
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.default.user.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "User deleted successfully" });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
exports.default = router;
