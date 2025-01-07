export enum FeatureStatus {
  Accepted = "Accepted",
  Reject = "Rejected",
  Pending = "Pending",
}
export interface IFeature extends Document {
  _id?: string;
  Id: string;
  name: string;
  businessName: string;
  productId: string;
  price?: number;
  status: FeatureStatus;
  createdAt?: Date;
}
