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
  description: string;
}
