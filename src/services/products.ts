import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// CREATE Product
router.post("/", async (req, res) => {
    try {
        const data = await prisma.product.create({ data: req.body });
        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// GET All Products
router.get("/", async (req, res) => {
    const products = await prisma.product.findMany({
        where: { isDeleted: false },
        include: { category: true, reviews: { where: { isDeleted: false } } },
    });
    res.json(products);
});

// GET Product By ID
router.get("/:id", async (req, res) => {
    const product = await prisma.product.findFirst({
        where: { id: req.params.id, isDeleted: false },
        include: { category: true, reviews: { where: { isDeleted: false } } },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// PATCH Product
router.patch("/:id", async (req, res) => {
    try {
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(product);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// SOFT DELETE Product
router.delete("/:id", async (req, res) => {
    try {
        await prisma.product.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        res.json({ message: "Product deleted (soft delete)" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;