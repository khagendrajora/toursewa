interface IAddress {
  country: string;
  state: string;
  district: string;
  municipality: string;
  street: string;
  subrub: string;
  postcode: string;
}

export interface IProperty extends Document {
  _id?: string;
  propName: string;
  propCategory: string;
  propSubCategory: string;
  address: IAddress;
  email: string;
  website: string;
  phone: number;
  businessReg: string;
  tax: string;
  contactName: string;
  contactPhone: number;
  dateOfEstab: Date;
  propertyId: string;
}
