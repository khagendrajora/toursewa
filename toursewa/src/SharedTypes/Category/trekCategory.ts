export interface TrekCategory extends Document {
  _id?: string;
  categoryName: string;
  desc?: string;
  subCategory?: string[];
  categoryId: string;
}
