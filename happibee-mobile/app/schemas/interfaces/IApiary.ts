export interface IApiary {
    id: string;
    name: string;
    town: string;
    nameOfLocal: string;
    beehivesCount: number;
    coresCount: number;
    creationDate: Date;
    geoLocation: IGeoLocation,
    inControlledZone: boolean,
    controlledZoneName: string,
    intensiveCultivation: boolean;
    beehives: IBeehive[];
    apiaryHistory: IApiaryHistory[];
    md5: string;
    changedAt: string;
    status: ApiaryStatus;
}

export interface IBeehive {
    name: string;
    type: string;
    structureType: BeehiveStructureType;
    color: string;
    source: string;
    frames: number;
    queenRace: string;
    queenAcceptAt: Date;
    hiveBodiesOfCreation: number;
    hiveBodiesOfHoney: number;
}

export interface IApiaryHistory {
    toControlledZone: boolean;
    processedBy: string;
    processedAt: string;
    observations: string;
    requestAt: string;
    state: EventStateEnum;
    type: ApiaryEventType;
    place?: string;
    apiaryId?: string;
    district?: string;
    county?: string;
    parish?: string;
    destLat?: string;
    destLong?: string;
    carPlate?: string;
    travelDate?: Date;
    travelDuration?: string;
    controlledZone?: boolean;
    disease?: string;
    status?: string;
    approvals?: ITranshumanceApprovals[]
}

export interface ITranshumanceApprovals {
    processedBy?: string;
    observations?: string;
    processedAt?: Date;
    approved?: boolean;
}


export interface IGeoLocation {
    latitude: number;
    longitude: number;
}

export enum BeehiveStructureType {
    NORMAL = "NORMAL",
    CORE = "CORE"
}


export enum ApiaryStatus {
    ACTIVE = "ACTIVE",
    WAITING_DGADR = "WAITING_DGADR",
    WAITING_CZ = "WAITING_CZ",
    REJECTED_BY_DGADR = "REJECTED_BY_DGADR",
    REJECTED_BY_CZ = "REJECTED_BY_CZ"
}


export enum ApiaryEventType {
    REQUEST_TO_CREATE = "REQUEST_TO_CREATE",
    REQUEST_TO_TRANSHUMANCE = "REQUEST_TO_TRANSHUMANCE",
    DISEASE = "DISEASE"
}


export enum EventStateEnum {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}


