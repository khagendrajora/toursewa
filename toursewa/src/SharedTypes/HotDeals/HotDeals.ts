export enum IHotDealStatus {
  Available = "Available",
  Unavailable = "Unavailable",
}

export interface IHotDeal extends Document {
  _id?: string;
  driverId: string;
  vehicleId: string;
  vehicleName: string;
  businessName: string;
  businessId: string;
  driverName: string;
  driverPhone: string;
  status: IHotDealStatus;
  price: number;
  date: Date;
  sourceAddress: string;
  destAddress: string;
  hdID: string;
  capacity: string;
  time: string;
  termsAndCondition?: string;
}
