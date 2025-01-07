export interface VCategory extends Document {
  _id?: string;
  categoryName: string;
  desc?: string;
  subCategory?: string[];
  categoryId: string;
}
