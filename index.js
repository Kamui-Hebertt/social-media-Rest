const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

// import routers
const userRoute = require("./routers/users");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/posts");


dotenv.config();

mongoose.connect(process.env.MONGO_URL);

app.use(helmet());
app.use(morgan("common"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello!");
});

// routers
app.use("/api/users", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(8800, () => {
  console.log("Backend server is running");
});