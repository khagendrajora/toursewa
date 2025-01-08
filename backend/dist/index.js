"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
require("./db/database");
// import { database } from "./db/database";
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const categoryRoute_1 = __importDefault(require("./routes/CategoryRoute/categoryRoute"));
const DriverRoute_1 = __importDefault(require("./routes/driverRoutes/DriverRoute"));
const LocationRoute_1 = __importDefault(require("./routes/LocationRoute/LocationRoute"));
const Login_1 = __importDefault(require("./routes/Login/Login"));
const LandingPageRoute_1 = __importDefault(require("./routes/Pages/LandingPageRoute"));
const UserRoute_1 = __importDefault(require("./routes/UserRoutes/UserRoute"));
const businessRoute_1 = __importDefault(require("./routes/businessRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const propertyRoute_1 = __importDefault(require("./routes/propertyRoute"));
const reservationRoute_1 = __importDefault(require("./routes/reservationRoute"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use("/public/uploads", express_1.default.static(path_1.default.resolve("public/uploads")));
app.use("/api", UserRoute_1.default);
app.use("/api", LandingPageRoute_1.default);
app.use("/api", adminRoute_1.default);
app.use("/api", categoryRoute_1.default);
app.use("/api", businessRoute_1.default);
app.use("/api", productRoute_1.default);
app.use("/api", propertyRoute_1.default);
app.use("/api", reservationRoute_1.default);
app.use("/api", DriverRoute_1.default);
app.use("/api", Login_1.default);
app.use("/api", LocationRoute_1.default);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Started on ${PORT}`);
});
