import express from "express";
import { PORT } from "./src/Config/serverConfig.js";

const app = express();

app.get("/start", (req, res) => {
  res.send("Hello World the server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});