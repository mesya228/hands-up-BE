import { Schema, model } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  support: {
    type: Boolean,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  products: {
    type: Array,
    require: true,
  },
});

export const Company = model("Company", schema);

export interface ICompany {
  name: string;
  support: boolean;
  state: string;
  products: Array<string>;
}
