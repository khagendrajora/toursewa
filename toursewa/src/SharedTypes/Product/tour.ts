export interface ITour extends Document {
  _id?: string;
  tourId: string;
  businessId: string;
  prodCategory: string;
  prodsubCategory: string;
  inclusion: string[];
  dest: string;
  duration: string;
  isActive: boolean;
  itinerary: string;
  capacity: string;
  name: string;
  phone: number;
  operationDates: Date[];
  tourImages?: string[];
  isFeatured: boolean;
  price?: string;
  addedBy: string;
}
