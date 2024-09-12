import { ObjectSchema } from "realm";

const HiveInspectionSchema: ObjectSchema = {
  name: "HiveInspection",
  properties: {
    hiveId: "string",
    hiveName: "string",
    population: "string",
    polenAndHoneyLevels: "string",
    broodPattern: "string",
    diseaseOrPests: "string",
    temperament: "string?",
    symptoms: { type: "list", objectType: "string" },
    additionalNotes: "string?",
  },
};

const InspectionSchema: ObjectSchema = {
  name: "Inspection",
  properties: {
    id: "string",
    apiaryId: "string",
    apiaryName: "string",
    date: "string",
    startTime: "string",
    endTime: "string",
    hives: { type: "list", objectType: "HiveInspection" },
    type: "string",
  },
  primaryKey: "id",
};

export { InspectionSchema, HiveInspectionSchema };
