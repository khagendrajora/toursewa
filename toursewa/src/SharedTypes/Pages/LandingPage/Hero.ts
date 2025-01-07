export interface IHero extends Document {
  _id?: string;
  heroImage?: string[];
  heading: string;
  description: string;
}
