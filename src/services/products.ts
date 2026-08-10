import { Router } from "express";
import prisma from "../lib/prisma";
import { sendResponse } from "../lib/sendResponse";

const router = Router();

// CREATE Product
router.post("/", async (req, res) => {
    try {
        const data = await prisma.product.create({ data: req.body });
        sendResponse({ res, status: 201, success: true, message: "Product created successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// GET All Products
router.get("/", async (req, res) => {
    try {
        const data = await prisma.product.findMany({
            where: { isDeleted: false },
            include: { category: true, reviews: { where: { isDeleted: false } } },
        });
        sendResponse({ res, success: true, message: "Products fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// GET Product By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma.product.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: { category: true, reviews: { where: { isDeleted: false } } },
        });
        if (!data) return sendResponse({ res, status: 404, success: false, message: "Product not found" });
        sendResponse({ res, success: true, message: "Product fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// PATCH Product
router.patch("/:id", async (req, res) => {
    try {
        const data = await prisma.product.update({
            where: { id: req.params.id },
            data: req.body,
        });
        sendResponse({ res, success: true, message: "Product updated successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// SOFT DELETE Product
router.delete("/:id", async (req, res) => {
    try {
        await prisma.product.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        sendResponse({ res, success: true, message: "Product deleted successfully" });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

export default router;
