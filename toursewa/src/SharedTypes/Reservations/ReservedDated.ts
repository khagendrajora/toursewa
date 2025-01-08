export interface IRDates extends Document {
  _id?: string;
  vehicleId: string;
  bookingDate: Date[];
  bookedBy: string;
  bookingId: string;
  time?: string;
  startTime: string;
}
