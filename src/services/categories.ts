import { Router } from "express";
import prisma from "../lib/prisma";
import { sendResponse } from "../lib/sendResponse";

const router = Router();

// CREATE Category
router.post("/", async (req, res) => {
    try {
        const data = await prisma.category.create({ data: req.body });
        sendResponse({ res, status: 201, success: true, message: "Category created successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// GET All Categories
router.get("/", async (req, res) => {
    try {
        const data = await prisma.category.findMany({
            where: { isDeleted: false },
            include: { products: { where: { isDeleted: false } } },
        });
        sendResponse({ res, success: true, message: "Categories fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// GET Category By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma.category.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: { products: { where: { isDeleted: false } } },
        });
        if (!data) return sendResponse({ res, status: 404, success: false, message: "Category not found" });
        sendResponse({ res, success: true, message: "Category fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// PATCH Category
router.patch("/:id", async (req, res) => {
    try {
        const data = await prisma.category.update({
            where: { id: req.params.id },
            data: req.body,
        });
        sendResponse({ res, success: true, message: "Category updated successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// SOFT DELETE Category
router.delete("/:id", async (req, res) => {
    try {
        await prisma.category.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        sendResponse({ res, success: true, message: "Category deleted successfully" });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

export default router;
