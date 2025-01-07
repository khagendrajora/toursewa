"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverVehicles = exports.resetPwd = exports.updateDriver = exports.deleteDriver = exports.getDriverById = exports.getDriverByVehId = exports.getDriverByBId = exports.getDrivers = exports.updateDriverStatus = exports.verifyDriverEmail = exports.addDriver = void 0;
const Driver_1 = __importDefault(require("../../models/Drivers/Driver"));
const token_1 = __importDefault(require("../../models/token"));
const uuid_1 = require("uuid");
const setEmail_1 = require("../../utils/setEmail");
const nanoid_1 = require("nanoid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const business_1 = __importDefault(require("../../models/business"));
const adminUser_1 = __importDefault(require("../../models/adminUser"));
const userModel_1 = __importDefault(require("../../models/User/userModel"));
const vehicle_1 = __importDefault(require("../../models/Product/vehicle"));
const addDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const customId = (0, nanoid_1.customAlphabet)("1234567890", 4);
    let driverId = customId();
    driverId = "D" + driverId;
    const { driverName, driverAge, driverPhone, driverEmail, vehicleId, businessId, driverPwd, } = req.body;
    try {
        let driverImage = undefined;
        if (req.files) {
            const files = req.files;
            if (files["driverImage"]) {
                driverImage = (_a = files["driverImage"][0]) === null || _a === void 0 ? void 0 : _a.path;
            }
        }
        const driverNumber = yield Driver_1.default.findOne({ driverPhone });
        if (driverNumber) {
            return res.status(400).json({ error: "Phone Number is already used " });
        }
        const driver = yield Driver_1.default.findOne({ driverEmail });
        if (driver) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const email = yield userModel_1.default.findOne({ userEmail: driverEmail });
        if (email) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const businessData = yield business_1.default.findOne({ bId: businessId });
        if (!businessData) {
            return res.status(400).json({ error: "Business Not Found" });
        }
        const emailCheck = yield business_1.default.findOne({
            primaryEmail: { $ne: businessData.primaryEmail },
            $or: [{ primaryEmail: driverEmail }],
        });
        if (emailCheck) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const adminEmail = yield adminUser_1.default.findOne({ adminEmail: driverEmail });
        if (adminEmail) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const vehicleName = yield vehicle_1.default.findOne({ vehId: vehicleId });
        const salt = yield bcryptjs_1.default.genSalt(5);
        let hashedPassword = yield bcryptjs_1.default.hash(driverPwd, salt);
        let newDriver = new Driver_1.default({
            driverId: driverId,
            vehicleId: vehicleId,
            vehicleName: vehicleName === null || vehicleName === void 0 ? void 0 : vehicleName.name,
            businessId: businessId,
            driverEmail: driverEmail,
            driverName: driverName,
            driverAge: driverAge,
            driverPhone: driverPhone,
            driverPwd: hashedPassword,
            driverImage,
        });
        newDriver = yield newDriver.save();
        if (!newDriver) {
            return res.status(400).json({ error: "Failed" });
        }
        let token = new token_1.default({
            token: (0, uuid_1.v4)(),
            userId: newDriver._id,
        });
        token = yield token.save();
        if (!token) {
            return res.status(400).json({ error: "Token not generated" });
        }
        const url = `${process.env.FRONTEND_URL}/resetandverifyemail/${token.token}`;
        const api = `${process.env.Backend_URL}`;
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: driverEmail,
            subject: "Account Verification Link",
            text: `Verify your Driver Email to Login\n\n
${api}/resetandverifyemail/${token.token}`,
            html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Verify your Email address</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              To continue on Toursewa with your account, please verify that
              this is your email address.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to verify</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div> `,
        });
        return res
            .status(200)
            .json({ message: "Verifying link is sent to Your Email" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addDriver = addDriver;
const verifyDriverEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const newPwd = req.body.driverPwd;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token Expired" });
        }
        const driverId = yield Driver_1.default.findOne({ _id: data.userId });
        if (!driverId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        if (driverId.isVerified) {
            return res.status(400).json({ error: "Email Already verified" });
        }
        const isOldPwd = yield bcryptjs_1.default.compare(newPwd, driverId.driverPwd);
        if (isOldPwd) {
            return res.status(400).json({ error: "Password Previously Used" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            driverId.driverPwd = hashedPwd;
            driverId.isVerified = true;
            const businessEmail = yield business_1.default.findOne({
                bId: driverId.businessId,
            });
            yield token_1.default.deleteOne({ _id: data._id });
            driverId.save().then((driver) => {
                if (!driver) {
                    return res.status(400).json({ error: "Failed to Verify" });
                }
                else {
                    (0, setEmail_1.sendEmail)({
                        from: "beta.toursewa@gmail.com",
                        to: driverId.driverEmail,
                        subject: "Email Verified",
                        html: `<h2>Your Email with business ID ${driverId.businessId} for vehicle ${driverId.vehicleId} has been verified</h2>`,
                    });
                    (0, setEmail_1.sendEmail)({
                        from: "beta.toursewa@gmail.com",
                        to: businessEmail === null || businessEmail === void 0 ? void 0 : businessEmail.primaryEmail,
                        subject: "New Driver Registered",
                        html: `<h2>New Driver with driver ID ${driverId.driverId} for vehicle ${driverId.vehicleName} is Registered</h2>`,
                    });
                }
            });
            return res
                .status(200)
                .json({ message: "Email Verified and New Password is set" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.verifyDriverEmail = verifyDriverEmail;
const updateDriverStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { status, driverEmail } = req.body;
    try {
        const data = yield Driver_1.default.findByIdAndUpdate(id, {
            status: status,
        }, { new: true });
        if (!data) {
            return res.status(400).json({ error: "Update Failed" });
        }
        (0, setEmail_1.sendEmail)({
            from: "beta.toursewa@gmail.com",
            to: driverEmail,
            subject: "Status Changedd",
            html: `<h2>Your Status has been changed to ${status}</h2>`,
        });
        return res.status(200).json({ message: status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateDriverStatus = updateDriverStatus;
const getDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Driver_1.default.find().then((data) => {
            if (data.length > 0) {
                return res.send(data);
            }
            else {
                return res.status(200).json({ message: "Not Found" });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDrivers = getDrivers;
const getDriverByBId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Driver_1.default.find({ businessId: id });
        if (data.length === 0) {
            return res.status(400).json({ error: "No driver Found" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDriverByBId = getDriverByBId;
const getDriverByVehId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Driver_1.default.find({ vehicleId: id });
        if (data.length === 0) {
            return res.status(400).json({ error: "No  Data" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDriverByVehId = getDriverByVehId;
const getDriverById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const data = yield Driver_1.default.findById(id);
        if (!data) {
            return res.status(400).json({ error: "Failed to Get" });
        }
        else {
            return res.send(data);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDriverById = getDriverById;
const deleteDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deleteDriver = yield Driver_1.default.findByIdAndDelete(id);
        if (!deleteDriver) {
            return res.status(404).json({ error: "Failed to delete" });
        }
        return res.status(200).json({ message: "Successfully Deleted" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteDriver = deleteDriver;
const updateDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const { driverName, driverAge, driverPhone, driverEmail, vehicleId } = req.body;
    try {
        let driverImage = undefined;
        if (req.files) {
            const files = req.files;
            if (files["driverImage"]) {
                driverImage = (_a = files["driverImage"][0]) === null || _a === void 0 ? void 0 : _a.path;
            }
        }
        const data = yield Driver_1.default.findByIdAndUpdate(id, {
            driverName,
            driverAge,
            driverPhone,
            driverEmail,
            vehicleId,
            driverImage,
        }, { new: true });
        if (!data) {
            return res.status(400).json({
                error: "Failed to Update",
            });
        }
        else {
            return res.send({
                message: "Updated",
                data: data,
            });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateDriver = updateDriver;
const resetPwd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const newPwd = req.body.driverPwd;
    try {
        const data = yield token_1.default.findOne({ token });
        if (!data) {
            return res.status(404).json({ error: "Token not found" });
        }
        const driverId = yield Driver_1.default.findOne({ _id: data.userId });
        if (!driverId) {
            return res.status(404).json({ error: "Token and Email not matched" });
        }
        const isOldPwd = yield bcryptjs_1.default.compare(newPwd, driverId.driverPwd);
        if (isOldPwd) {
            return res.status(400).json({ error: "Password Previously Used" });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(5);
            let hashedPwd = yield bcryptjs_1.default.hash(newPwd, salt);
            driverId.driverPwd = hashedPwd;
            driverId.save();
            yield token_1.default.deleteOne({ _id: data._id });
            return res.status(201).json({ message: "Reset Successful" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.resetPwd = resetPwd;
const getDriverVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.vehicleId;
    try {
        const data = yield vehicle_1.default.find({ vehId: id });
        if (!data) {
            return res.status(400).json({ error: "No vehicle found" });
        }
        return res.send(data);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getDriverVehicles = getDriverVehicles;
