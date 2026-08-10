import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// CREATE Review
router.post("/", async (req, res) => {
    try {
        const data = await prisma.review.create({ data: req.body });
        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// GET All Reviews
router.get("/", async (req, res) => {
    const reviews = await prisma.review.findMany({
        where: { isDeleted: false },
        include: {
            user: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, name: true, price: true } },
        },
    });
    res.json(reviews);
});

// GET Review By ID
router.get("/:id", async (req, res) => {
    const review = await prisma.review.findFirst({
        where: { id: req.params.id, isDeleted: false },
        include: {
            user: { select: { id: true, name: true, email: true } },
            product: { select: { id: true, name: true, price: true } },
        },
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
});

// PATCH Review
router.patch("/:id", async (req, res) => {
    try {
        const review = await prisma.review.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(review);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// SOFT DELETE Review
router.delete("/:id", async (req, res) => {
    try {
        await prisma.review.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        res.json({ message: "Review deleted (soft delete)" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;