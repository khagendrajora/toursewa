"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const vehicleCategory = new mongoose_1.default.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    subCategory: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("VehileCategory", vehicleCategory);
