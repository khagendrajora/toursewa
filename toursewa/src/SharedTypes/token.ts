export interface IToken extends Document {
  _id?: string;
  token: string;
  userId: string;
  createdAt: Date;
}
