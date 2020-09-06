import * as moment from "moment";

export interface SimpleResult {
  win: boolean;
  detailUrl: string;
}

export interface DetailedResult {
  players: Player[];
  rule: string;
  stage: string;
  win: boolean;
  start: moment.Moment;
  end: moment.Moment;
}

export interface Player {
  name: string;
  weapon: string;
}
