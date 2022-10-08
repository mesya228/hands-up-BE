import { Schema, model } from 'mongoose';

const statisticsSchema = new Schema({
  uuid: {
    type: String,
    require: true,
  },
  achievements: {
    type: Array<Object>,
    require: true,
    default: [],
  },
  subjects: {
    type: Array<Object>,
    require: true,
    default: [],
  },
});

export const StatisticsSchema = model('Statistics', statisticsSchema);

export interface IStatistics {
  uuid: string;
  achievements: string[];
  subjects: IStatisticSubject[];
}

export interface IStatisticSubject {
  id: string;
  experience: number;
  level: number;
}
