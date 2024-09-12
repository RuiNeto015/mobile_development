import {BeehiveStructureType, IBeehive} from "../interfaces/IApiary";
import {formatDateToYYYYMMDD} from "../../utils/DateUtils";

export interface CreateApiaryDto {
    name: string;
    tenantId: string;
    beehives: CreateBeehiveDto[];
    town: string;
    geoLocation: GeoLocation;
    nameOfLocal: string;
    intensiveCultivation: boolean;
    inControlledZone: boolean;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface CreateBeehiveDto {
    name: string;
    type: string;
    structureType: BeehiveStructureType;
    color: string;
    source: string;
    frames: number;
    queenRace: string;
    queenAcceptAt: string;
    hiveBodiesOfCreation: number;
    hiveBodiesOfHoney: number;
}

export const mapBeehiveToDto = (beehive: IBeehive): CreateBeehiveDto => {
    return {
        name: beehive.name,
        type: beehive.type,
        structureType: beehive.structureType,
        color: beehive.color,
        source: beehive.source,
        frames: beehive.frames,
        queenRace: beehive.queenRace,
        queenAcceptAt: beehive.queenAcceptAt.toISOString(),
        hiveBodiesOfCreation: beehive.hiveBodiesOfCreation,
        hiveBodiesOfHoney: beehive.hiveBodiesOfHoney,
    };
};
