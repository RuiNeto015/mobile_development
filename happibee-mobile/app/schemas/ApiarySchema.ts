import {ObjectSchema} from "realm";

const GeoLocationSchema: ObjectSchema = {
    name: "Geolocation",
    properties: {
        latitude: "float",
        longitude: "float",
    },
};

const TranshumanceApprovals: ObjectSchema = {
    name: "TranshumanceApprovals",
    properties: {
        processedBy: "string?",
        observations: "string?",
        processedAt: "date?",
        approved: "bool?",
    },
};

const BeehiveSchema: ObjectSchema = {
    name: "Beehive",
    properties: {
        name: "string",
        type: "string",
        structureType: "string",
        color: "string",
        source: "string",
        frames: "int",
        queenRace: "string",
        queenAcceptAt: "date",
        hiveBodiesOfCreation: "int",
        hiveBodiesOfHoney: "int",
    },
};

const ApiaryHistorySchema: ObjectSchema = {
    name: "ApiaryHistory",
    properties: {
        toControlledZone: "bool?",
        processedBy: "string?",
        processedAt: "string?",
        observations: "string?",
        requestAt: "string?",
        type: "string?",
        place: "string?",
        district: "string?",
        county: "string?",
        parish: "string?",
        destLat: "string?",
        destLong: "string?",
        carPlate: "string?",
        travelDate: "string?",
        travelDuration: "string?",
        controlledZone: "bool?",
        state: "string?",
        disease: "string?",
        approvals: {type: "list", objectType: "TranshumanceApprovals"},
    },
};

const ApiarySchema: ObjectSchema = {
    name: "Apiary",
    properties: {
        id: "string",
        name: "string",
        town: "string",
        nameOfLocal: "string",
        beehivesCount: "int",
        coresCount: "int",
        creationDate: "string",
        geoLocation: "Geolocation",
        intensiveCultivation: "bool",
        inControlledZone: "bool",
        controlledZoneName: "string?",
        beehives: {type: "list", objectType: "Beehive"},
        apiaryHistory: {type: "list", objectType: "ApiaryHistory"},
        md5: "string",
        changedAt: "string",
        status: "string",
    },
    primaryKey: "id",
};

export {GeoLocationSchema, BeehiveSchema, ApiaryHistorySchema, ApiarySchema, TranshumanceApprovals};
