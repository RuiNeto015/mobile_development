import Realm from "realm";

export interface IHiveInspection {
    hiveId?: string;
    hiveName?: string;
    population?: string; //Muito boa, Normal, Baixa, Muito baixa
    polenAndHoneyLevels?: string; //Muito bons, Normais, Baixos, Muito baixos
    broodPattern?: string; //Maioritariamente sólido, Pontuado, Muito irregular, Sem ninhada
    diseaseOrPests?: string; //Não, Sim
    temperament?: string; //Calmo, Aggresivo
    symptoms?: string[]; //Sim, Não
    additionalNotes?: string;
}

export interface IInspection {
    id?: string;
    apiaryId: string;
    apiaryName: string;
    date: string;
    startTime: string;
    endTime: string;
    hives: IHiveInspection[];
    type?: string; //draft || registered
}

export type IInspectionObject = IInspection & Realm.Object;



