interface ISocialMedia {
  platform: string;
  url: string;
}

interface IBusinessRegistration {
  authority?: string;
  registrationNumber: string;
  registrationOn?: Date;
  expiresOn?: Date;
}

export interface IBusiness extends Document {
  _id?: string;
  businessName: string;
  businessCategory: string;
  businessSubCategory?: string;

  businessAddress: {
    street: string;
    country?: string;
    state?: string;
    city?: string;
  };
  primaryEmail: string;
  primaryPhone: string;
  isActive: boolean;
  businessPwd: string;
  businessRole: string;
  isVerified: boolean;
  bId: string;
  website?: string;
  contactName?: string;
  businessRegistration?: IBusinessRegistration;
  socialMedia?: ISocialMedia;
  imageGallery?: string[];
  profileIcon?: string;
}
