import { ObjectSchema } from "realm";

const TranshumaceDraftSchema: ObjectSchema = {
  name: "TranshumanceDraft",
  properties: {
    id: "string",
    apiaryId: "string",
    apiaryName: "string",
    hives: { type: "list", objectType: "string" },
    date: "string",
    hour: "string",
  },
  primaryKey: "id",
};

export { TranshumaceDraftSchema };
