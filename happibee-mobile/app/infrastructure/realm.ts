import Realm from "realm";
import {
    ApiarySchema,
    ApiaryHistorySchema,
    BeehiveSchema,
    GeoLocationSchema,
    TranshumanceApprovals,
    InspectionSchema,
    HiveInspectionSchema,
} from "../schemas";
import {TranshumaceDraftSchema} from "../schemas/TranshumanceSchema";

const getRealm = async () =>
    await Realm.open({
        path: "myrealm",
        schema: [
            ApiarySchema,
            GeoLocationSchema,
            TranshumanceApprovals,
            BeehiveSchema,
            ApiaryHistorySchema,
            InspectionSchema,
            HiveInspectionSchema,
            TranshumaceDraftSchema,
        ],
    });

export default getRealm;
