import { Router } from "express";
import auth from "../services/auth";
import users from "../services/users";
import categories from "../services/categories";
import products from "../services/products";
import reviews from "../services/reviews";

const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/categories", categories);
router.use("/products", products);
router.use("/reviews", reviews);

export default router;