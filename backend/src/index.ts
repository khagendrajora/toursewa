import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
// import "./db/database";
import { database } from "./db/database";

import adminRoute from "./routes/adminRoute";
import categoryRoute from "./routes/CategoryRoute/categoryRoute";
import DriverRoute from "./routes/driverRoutes/DriverRoute";
import LocationRoute from "./routes/LocationRoute/LocationRoute";
import Login from "./routes/Login/Login";
import LandingPageRoute from "./routes/Pages/LandingPageRoute";
import UserRoute from "./routes/UserRoutes/UserRoute";
import businessRoute from "./routes/businessRoute";
import productRoute from "./routes/productRoute";
import propertyRoute from "./routes/propertyRoute";
import reservationRoute from "./routes/reservationRoute";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();
app.use(express.json());

app.use(cookieParser());
app.use(cors());

app.use("/public/uploads", express.static(path.resolve("public/uploads")));
app.use("/api", UserRoute);
app.use("/api", LandingPageRoute);
app.use("/api", adminRoute);
app.use("/api", categoryRoute);
app.use("/api", businessRoute);
app.use("/api", productRoute);
app.use("/api", propertyRoute);
app.use("/api", reservationRoute);
app.use("/api", DriverRoute);
app.use("/api", Login);
app.use("/api", LocationRoute);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Started on ${PORT}`);
});
