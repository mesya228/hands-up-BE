import { Schema, model } from 'mongoose';

const statisticsSchema = new Schema({
  uuid: {
    type: String,
    require: true,
  },
  achievments: {
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
  achievments: string[];
  subjects: IStatisticSubject[];
}

export interface IStatisticSubject {
  id: string;
  expirience: number;
  level: number;
}
