"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views/index.html"), (err) => {
        if (err) {
            res.json({ success: true, message: "Eco Loop API Server Running" });
        }
    });
});
app.use("/api/v1", routes_1.default);
exports.default = app;
