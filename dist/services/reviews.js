"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendResponse_1 = require("../lib/sendResponse");
const router = (0, express_1.Router)();
// CREATE Review
router.post("/", async (req, res) => {
    try {
        const data = await prisma_1.default.review.create({ data: req.body });
        (0, sendResponse_1.sendResponse)({ res, status: 201, success: true, message: "Review created successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// GET All Reviews
router.get("/", async (req, res) => {
    try {
        const data = await prisma_1.default.review.findMany({
            where: { isDeleted: false },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, price: true } },
            },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Reviews fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// GET Review By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma_1.default.review.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, price: true } },
            },
        });
        if (!data)
            return (0, sendResponse_1.sendResponse)({ res, status: 404, success: false, message: "Review not found" });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Review fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// PATCH Review
router.patch("/:id", async (req, res) => {
    try {
        const data = await prisma_1.default.review.update({
            where: { id: req.params.id },
            data: req.body,
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Review updated successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// SOFT DELETE Review
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.default.review.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Review deleted successfully" });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
exports.default = router;
