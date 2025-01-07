export interface IBlogs extends Document {
  _id?: string;
  blogsImage?: string[];
  title: string;
  desc: string;
  blogId: string;
}
