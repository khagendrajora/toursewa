export interface IUser extends Document {
  _id?: string;
  userName: string;
  userEmail: string;
  userPwd: string;
  userRole: string;
  isVerified: boolean;
  userImage?: string;
  userId: string;
}
