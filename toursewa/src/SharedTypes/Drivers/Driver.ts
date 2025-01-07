export enum IStatus {
  Available = "Available",
  Unavailable = "Unavailable",
  Leave = "Leave",
  Occupied = "Occupied",
}

export interface IDriver extends Document {
  _id?: string;
  driverId: string;
  vehicleId: string;
  //   bookingId: string;
  vehicleName: string;
  businessId: string;
  driverName: string;
  driverAge: number;
  driverPhone: string;
  driverEmail?: string;
  status: IStatus;
  isVerified: boolean;
  driverPwd: string;
  driverImage: string;
}
