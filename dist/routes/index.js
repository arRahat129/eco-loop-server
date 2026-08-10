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
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/users", users_1.default);
router.use("/categories", categories_1.default);
router.use("/products", products_1.default);
router.use("/reviews", reviews_1.default);
exports.default = router;
