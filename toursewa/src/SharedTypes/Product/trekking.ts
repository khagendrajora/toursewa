export interface ITrekking extends Document {
  _id?: string;
  businessId: string;
  prodCategory: string;
  prodsubCategory: string;
  inclusion: string[];
  days: number;
  dest: string;
  numbers: number;
  itinerary: string;
  capacity: string;
  name: string;
  operationDates?: Date[];
  trekImages?: string[];
  trekId: string;
  isFeatured: boolean;
  price?: string;
  isActive: boolean;
}
