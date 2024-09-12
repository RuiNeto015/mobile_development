export interface ITranshumanceDraft {
  id?: string;
  apiaryId: string;
  apiaryName: string;
  hives: string[];
  date: string;
  hour: string;
}

export interface IHiveTranshumanceRecord {
  origin: string;
  destiny: string;
  date: string;
}

export interface ITranshumance {
  apiaryId?: string[];
  district?: string;
  county?: string;
  parish?: string;
  destLat?: string;
  destLong?: string;
  carPlate?: string;
  travelDate?: Date;
  travelDuration?: string;
  controlledZone?: boolean;
  status?: string;
  type?: string;
  processedBy?: string;
  processedAt?: string;
  observations?: string;
  requestAt?: string;
  state?: string;
}

export type ITranshumanceObject = ITranshumanceDraft & Realm.Object;
