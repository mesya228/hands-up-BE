import { Schema, model } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  rate: {
    type: Number,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  data: {
    type: Array,
    require: true,
  },
});

export const CompanySchema = model("CompanySchema", schema);

export interface ICompany {
  name: string;
  rate: number;
  state: string;
  data: Array<string>;
}
