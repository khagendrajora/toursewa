export interface IRDates extends Document {
  _id?: string;
  tourId: string;
  bookingDate: Date[];
  bookedBy: string;
  bookingId: string;
}
