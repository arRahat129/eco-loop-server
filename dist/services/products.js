"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendResponse_1 = require("../lib/sendResponse");
const router = (0, express_1.Router)();
// CREATE Product
router.post("/", async (req, res) => {
    try {
        const data = await prisma_1.default.product.create({ data: req.body });
        (0, sendResponse_1.sendResponse)({ res, status: 201, success: true, message: "Product created successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// GET All Products
router.get("/", async (req, res) => {
    try {
        const data = await prisma_1.default.product.findMany({
            where: { isDeleted: false },
            include: { category: true, reviews: { where: { isDeleted: false } } },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Products fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// GET Product By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma_1.default.product.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: { category: true, reviews: { where: { isDeleted: false } } },
        });
        if (!data)
            return (0, sendResponse_1.sendResponse)({ res, status: 404, success: false, message: "Product not found" });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Product fetched successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 500, success: false, message: error.message });
    }
});
// PATCH Product
router.patch("/:id", async (req, res) => {
    try {
        const data = await prisma_1.default.product.update({
            where: { id: req.params.id },
            data: req.body,
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Product updated successfully", data });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
// SOFT DELETE Product
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.default.product.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        (0, sendResponse_1.sendResponse)({ res, success: true, message: "Product deleted successfully" });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)({ res, status: 400, success: false, message: error.message });
    }
});
exports.default = router;
