export enum IStatus {
  Approved = "Approved",
  Canceled = "Canceled",
  Fulfilled = "Fulfilled",
  Pending = "Pending",
}

export interface IVRev extends Document {
  _id?: string;
  bookingId: string;
  vehicleId: string;
  vehicleType: string;
  vehicleNumber: string;
  capacity: string;
  vehicleName: string;
  bookedBy: string;
  bookedByName: string;
  age: string;
  email?: string;
  phone: string;
  sourceAddress: string;
  destinationAddress: string;
  startDate?: Date;
  endDate?: Date;
  address: string;
  bookingName: string;
  status: IStatus;
  businessId: string;
  vehicleImage?: string[];
  numberOfPassengers: number;
  time?: string;
  startTime: string;
  createdAt?: Date;
}
