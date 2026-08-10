import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

const router = Router();

// CREATE User
router.post("/", async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await prisma.user.create({
            data: { ...rest, password: hashedPassword },
            select: { id: true, email: true, name: true, role: true, isDeleted: true, createdAt: true, updatedAt: true },
        });
        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// GET All Users (Non-deleted)
router.get("/", async (req, res) => {
    const users = await prisma.user.findMany({
        where: { isDeleted: false },
        select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
    res.json(users);
});

// GET User By ID
router.get("/:id", async (req, res) => {
    const user = await prisma.user.findFirst({
        where: { id: req.params.id, isDeleted: false },
        select: { id: true, email: true, name: true, role: true, reviews: true, createdAt: true, updatedAt: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// PATCH User
router.patch("/:id", async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const updateData: any = { ...rest };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: updateData,
            select: { id: true, email: true, name: true, role: true, updatedAt: true },
        });
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// SOFT DELETE User
router.delete("/:id", async (req, res) => {
    try {
        await prisma.user.update({
            where: { id: req.params.id },
            data: { isDeleted: true },
        });
        res.json({ message: "User deleted (soft delete)" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;