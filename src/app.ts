import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import path from "path";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  // res.json({ success: true, message: "API Server Running" });
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.use("/api/v1", routes);

export default app;