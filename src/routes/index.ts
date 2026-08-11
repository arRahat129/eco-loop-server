import { Router } from "express";
import auth from "../services/auth";
import users from "../services/users";
import categories from "../services/categories";
import products from "../services/products";
import reviews from "../services/reviews";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// Public — auth does not require a token
router.use("/auth", auth);

// Protected — require valid JWT from /api/v1/auth/login
router.use("/users", authenticate, users);
router.use("/categories", authenticate, categories);
router.use("/products", authenticate, products);
router.use("/reviews", authenticate, reviews);

export default router;
