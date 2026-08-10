"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendResponse_1 = require("../lib/sendResponse");
const router = (0, express_1.Router)();
// CREATE Category
router.post("/", async (req, res) => {
    try {
        const data = await prisma_1.default.category.create({ data: req.body });
        (0, sendResponse_1.sendResponse)({ res, status: 201, success: true, message: "Category created successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// GET All Categories
router.get("/", async (req, res) => {
    try {
        const data = await prisma_1.default.category.findMany({
            where: { isDeleted: false },
            include: { products: { where: { isDeleted: false } } },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Categories fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// GET Category By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma_1.default.category.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: { products: { where: { isDeleted: false } } },
        });
        if (!data)
            return (0, sendResponse_1.sendResponse)({ res, status: 404, success: false, message: "Category not found" });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Category fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// PATCH Category
router.patch("/:id", async (req, res) => {
    try {
        const data = await prisma_1.default.category.update({
            where: { id: req.params.id },
            data: req.body,
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Category updated successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// SOFT DELETE Category
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.default.category.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Category deleted successfully" });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
exports.default = router;
