import express from "express";
import { PORT } from "./src/Config/serverConfig.js";
import connectDB from "./src/Config/DBConfig.js";
import Routes from "./src/Routes/UserRoute.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

connectDB();

app.use("/V1/api",Routes)

app.get("/start", (req, res) => {
  res.send("Hello World the server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});