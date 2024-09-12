import {ApiaryStatus, BeehiveStructureType, EventStateEnum} from "../../../../schemas/interfaces/IApiary";

export function writeBeehiveType(type: BeehiveStructureType): string {
    switch (type) {
        case BeehiveStructureType.NORMAL:
            return "Colmeia padrão";
        case BeehiveStructureType.CORE:
            return "Núcleo/Cortiço";
        default:
            // Handle any future enum values
            return "";
    }
}

export function giveApiaryStatusName(status: ApiaryStatus): string {
    switch (status) {
        case ApiaryStatus.ACTIVE:
            return 'Ativo';
        case ApiaryStatus.WAITING_DGADR:
            return 'Pendente de DGADR';
        case ApiaryStatus.WAITING_CZ:
            return 'Pendente de Zona Controlada';
        case ApiaryStatus.REJECTED_BY_DGADR:
            return 'Rejeitado pela DGADR';
        case ApiaryStatus.REJECTED_BY_CZ:
            return 'Rejeitado pela Zona Controlada';
        default:
            return 'Sem estado';
    }
}

export function getStatusClass(status: ApiaryStatus): string {
    switch (status) {
        case ApiaryStatus.ACTIVE:
            return 'text-green-500';
        case ApiaryStatus.WAITING_DGADR:
            return 'text-yellow-500';
        case ApiaryStatus.WAITING_CZ:
            return 'text-yellow-500';
        case ApiaryStatus.REJECTED_BY_CZ:
            return 'text-red-500';
        case ApiaryStatus.REJECTED_BY_DGADR:
            return 'text-red-500';
    }
}
