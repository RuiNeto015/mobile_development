import {BeehiveStructureType, IApiary, IApiaryHistory, IBeehive} from "../interfaces/IApiary";

const mapResponseToApiaryModel = (responseData: any): IApiary => {
    const {
        id,
        name,
        beehives,
        town,
        geoLocation,
        nameOfLocal,
        intensiveCultivation,
        inControlledZone,
        controlledZoneName,
        beehivesCount,
        coresCount,
        creationDate,
        apiaryHistory,
        md5,
        changedAt,
        status,
    } = responseData;

    return {
        id,
        name,
        beehives: mapResponseToBeehives(beehives),
        town,
        geoLocation: {
            latitude: geoLocation.latitude,
            longitude: geoLocation.longitude,
        },
        nameOfLocal,
        intensiveCultivation,
        inControlledZone,
        controlledZoneName,
        beehivesCount,
        coresCount,
        creationDate,
        apiaryHistory: mapResponseToApiaryHistory(apiaryHistory),
        md5,
        changedAt,
        status,
    };
};

const mapResponseToBeehives = (beehives: any[]): IBeehive[] => {
    return beehives.map((beehive) => ({
        id: beehive.id,
        name: beehive.name,
        type: beehive.type,
        structureType: BeehiveStructureType[beehive.structureType],
        color: beehive.color,
        source: beehive.source,
        dateOfImplantation: beehive.dateOfImplantation,
        frames: beehive.frames,
        queenRace: beehive.queenRace,
        queenAcceptAt: new Date(beehive.queenAcceptAt),
        hiveBodiesOfCreation: beehive.hiveBodiesOfCreation,
        hiveBodiesOfHoney: beehive.hiveBodiesOfHoney,
    }));
};

const mapResponseToApiaryHistory = (apiaryHistory: any[]): IApiaryHistory[] => {
    return apiaryHistory.map((history) => ({
        toControlledZone: history.toControlledZone,
        processedBy: history.processedBy,
        processedAt: history.processedAt,
        observations: history.observations,
        requestAt: history.requestAt,
        state: history.state,
        type: history.type,
    }));
};

export default mapResponseToApiaryModel;
