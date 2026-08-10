import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// CREATE Category
router.post("/", async (req, res) => {
    try {
        const data = await prisma.category.create({ data: req.body });
        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// GET All Categories
router.get("/", async (req, res) => {
    const categories = await prisma.category.findMany({
        where: { isDeleted: false },
        include: { products: { where: { isDeleted: false } } },
    });
    res.json(categories);
});

// GET Category By ID
router.get("/:id", async (req, res) => {
    const category = await prisma.category.findFirst({
        where: { id: req.params.id, isDeleted: false },
        include: { products: { where: { isDeleted: false } } },
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
});

// PATCH Category
router.patch("/:id", async (req, res) => {
    try {
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(category);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// SOFT DELETE Category
router.delete("/:id", async (req, res) => {
    try {
        await prisma.category.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        res.json({ message: "Category deleted (soft delete)" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;