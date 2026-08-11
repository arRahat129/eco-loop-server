"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../services/auth"));
const users_1 = __importDefault(require("../services/users"));
const categories_1 = __importDefault(require("../services/categories"));
const products_1 = __importDefault(require("../services/products"));
const reviews_1 = __importDefault(require("../services/reviews"));
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Public — auth does not require a token
router.use("/auth", auth_1.default);
// Protected — require valid JWT from /api/v1/auth/login
router.use("/users", authenticate_1.authenticate, users_1.default);
router.use("/categories", authenticate_1.authenticate, categories_1.default);
router.use("/products", authenticate_1.authenticate, products_1.default);
router.use("/reviews", authenticate_1.authenticate, reviews_1.default);
exports.default = router;
