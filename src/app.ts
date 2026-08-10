import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "API Server Running" });
});

app.use("/api/v1", routes);

export default app;