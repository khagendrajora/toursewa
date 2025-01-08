import mongoose from "mongoose";

enum ICondition {
  Good = "Good",
  Bad = "Bad",
}
export interface IVeh extends Document {
  _id?: string;
  businessId: string;
  businessName: string;
  vehCategory: string;
  isFeatured: boolean;
  vehSubCategory: string;
  services: string[];
  amenities: string[];
  vehCondition: ICondition;
  madeYear: Date;
  vehNumber: string;
  baseLocation: string;
  capacity: string;
  name: string;
  operationDates?: Date[];
  vehImages?: string[];
  manufacturer: string;
  model: string;
  isActive: boolean;
  VIN: string;
  vehId: string;
  price?: string;
  addedBy?: string;
  description: string;
}

const VehSchema = new mongoose.Schema(
  {
    businessId: {
      type: String,
    },
    addedBy: {
      type: String,
    },
    price: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    vehId: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    baseLocation: {
      type: String,
      required: true,
    },
    vehCategory: {
      type: String,
      required: true,
    },
    vehSubCategory: {
      type: String,
      required: true,
    },
    services: [
      {
        type: String,
        required: true,
      },
    ],

    amenities: [
      {
        type: String,
        required: true,
      },
    ],
    // quantity: {
    //   type: Number,
    //   required: true,
    // },

    capacity: {
      type: String,
      required: true,
    },
    vehCondition: {
      type: String,
      enum: Object.values(ICondition),
      required: true,
    },
    vehNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    operationDates: [
      {
        type: Date,
      },
    ],
    manufacturer: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    VIN: {
      type: String,
      required: true,
    },
    madeYear: {
      type: Date,
      required: true,
    },
    vehImages: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IVeh>("Vehicle", VehSchema);
