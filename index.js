import express from "express";
import { PORT } from "./src/Config/serverConfig.js";
import connectDB from "./src/Config/DBConfig.js";

const app = express();

connectDB();

app.get("/start", (req, res) => {
  res.send("Hello World the server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});