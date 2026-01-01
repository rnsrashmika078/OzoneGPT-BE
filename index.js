import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // let read cookies from the browser
import { authenticate } from "./middleware/auth.js";
import authRoute from "./route/authRoute.js";
import { getAuthUser } from "./controller/authUser.js";

const app = express(); //create instance of the express application
app.use(express.json()); // allow the server to accept json data
app.use(express.urlencoded({ extended: true })); //req.body allow the serve to read data from the html forms : name=John&age=30

const port = 3000;
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Public auth routes
app.use("/api/auth", authRoute);

// Protected routes
app.get("/api/auth/user", authenticate, getAuthUser);

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
