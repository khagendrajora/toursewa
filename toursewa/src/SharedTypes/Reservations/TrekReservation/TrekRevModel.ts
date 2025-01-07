export enum IStatus {
  Approved = "Approved",
  Canceled = "Canceled",
  completed = "Completed",
  Pending = "Pending",
}

export interface ITrRev extends Document {
  _id?: string;
  bookingId: string;
  trekId: string;
  trekName: string;
  passengerName: string;
  businessId: string;
  tickets: number;
  bookedBy: string;
  email?: string;
  phone: string;
  date: Date;
  createdAt?: Date;
  isApproved: boolean;
  status: IStatus;
}
