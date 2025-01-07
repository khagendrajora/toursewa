export enum IStatus {
  Approved = "Approved",
  Canceled = "Canceled",
  completed = "Completed",
  Pending = "Pending",
}

export interface ITuRev extends Document {
  _id?: string;
  bookingId: string;
  tourId: string;
  tourName: string;
  passengerName: string;
  bookedBy: string;
  tickets: number;
  email?: string;
  phone: string;
  date: Date;
  createdAt?: Date;
  isApproved: boolean;
  businessId: string;
  status: IStatus;
}
