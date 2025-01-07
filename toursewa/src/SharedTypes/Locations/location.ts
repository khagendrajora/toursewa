export interface ILocation extends Document {
  _id?: string;
  country: string;
  state: string;
  district: string;
  municipality: string;
  locationName: string;
  geo: string;
  fullLocation: string;
}
