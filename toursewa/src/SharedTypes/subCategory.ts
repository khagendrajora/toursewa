export interface ISubCategory extends Document {
  categoryName: string;
  subCategoryName?: string[];
  desc?: string;
  categoryId: string;
  _id?: string;
}
