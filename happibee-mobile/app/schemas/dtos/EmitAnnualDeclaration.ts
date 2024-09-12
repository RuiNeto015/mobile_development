import { ApiaryStatus } from "../interfaces/IApiary";

export interface EmitAnnualDeclarationDto {
    tenantId: string,
    type: AnnualDeclarationType,
    activityStartDate: Date,
    activityEndDate: Date,
    user: UserDto,
    apiariesList: AnnualDeclarationApiary[],
    annualDeclarationHistory: AnnualDeclarationEvent[],
    state: AnnualDeclarationState
}

export interface AnnualDeclarationApiary {
    id: string,
    town: string,
    geoLocation: GeoLocation,
    nameOfLocal: string,
    intensiveCultivation: boolean,
    beehivesCount: number,
    coresCount: number,
    inTranshumance: boolean,
    inControlledZone: boolean,
    state: ApiaryStatus
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface AnnualDeclarationEvent {

    id: string;
    requestAt: Date,
    state: EventStateEnum,
    processedBy: string
    observations: string
}

export interface UserDto {
    tenantId: string,
    email: string,
    password: string,
    name: string,
    role: string,
    nif: string,
    address: string
}

export enum ApiaryEventType {

    REQUEST_TO_CREATE = "REQUEST_TO_CREATE",
    REQUEST_TO_TRANSHUMANCE = "REQUEST_TO_TRANSHUMANCE"

}

export enum AnnualDeclarationState {
    PENDENT = "PENDENT",
    PENDING = "PENDENT",
    ACCEPTED = "ACCEPTED",
    APPROVED = "ACCEPTED",
    REJECTED = "REJECTED"
    
}

export enum AnnualDeclarationType {
    BEEKEEPER_INITIAL_REGISTRY = "BEEKEEPER_INITIAL_REGISTRY",
    ACTIVITY_CLOSE = "ACTIVITY_CLOSE",
    ACTIVITY_RESTART = "ACTIVITY_RESTART",
    ALTERATION_REQUEST = "ALTERATION_REQUEST"
}

export enum EventStateEnum {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}