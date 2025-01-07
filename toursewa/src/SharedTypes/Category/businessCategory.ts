export interface BCategory extends Document {
  _id?: string;
  categoryName: string;
  desc?: string;
  subCategory?: string[];
  categoryId: string;
}
