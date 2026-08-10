import { Router } from "express";
import prisma from "../lib/prisma";
import { sendResponse } from "../lib/sendResponse";

const router = Router();

// CREATE Review
router.post("/", async (req, res) => {
    try {
        const data = await prisma.review.create({ data: req.body });
        sendResponse({ res, status: 201, success: true, message: "Review created successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// GET All Reviews
router.get("/", async (req, res) => {
    try {
        const data = await prisma.review.findMany({
            where: { isDeleted: false },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, price: true } },
            },
        });
        sendResponse({ res, success: true, message: "Reviews fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// GET Review By ID
router.get("/:id", async (req, res) => {
    try {
        const data = await prisma.review.findFirst({
            where: { id: req.params.id, isDeleted: false },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, price: true } },
            },
        });
        if (!data) return sendResponse({ res, status: 404, success: false, message: "Review not found" });
        sendResponse({ res, success: true, message: "Review fetched successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 500, success: false, message: error.message });
    }
});

// PATCH Review
router.patch("/:id", async (req, res) => {
    try {
        const data = await prisma.review.update({
            where: { id: req.params.id },
            data: req.body,
        });
        sendResponse({ res, success: true, message: "Review updated successfully", data });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

// SOFT DELETE Review
router.delete("/:id", async (req, res) => {
    try {
        await prisma.review.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        sendResponse({ res, success: true, message: "Review deleted successfully" });
    } catch (error: any) {
        sendResponse({ res, status: 400, success: false, message: error.message });
    }
});

export default router;
