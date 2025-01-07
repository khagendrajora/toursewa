export interface ITrekLogs extends Document {
  _id?: string;
  updatedBy: string;
  time: Date;
  status: string;
  bookingId: string;
}
