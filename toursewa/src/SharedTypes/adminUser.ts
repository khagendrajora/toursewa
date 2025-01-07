export interface IAdminUser extends Document {
  _id?: string;
  adminName: string;
  adminEmail: string;
  adminPwd: string;
  isVerified: boolean;
  adminRole: string;
  adminId: string;
}
