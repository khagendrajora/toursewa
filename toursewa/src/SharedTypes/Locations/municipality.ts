export interface IMunicipality extends Document {
  _id?: string;
  municipality: string;
  district: string;
  // country: string;
  state: string;
  // locations?: string;
}
