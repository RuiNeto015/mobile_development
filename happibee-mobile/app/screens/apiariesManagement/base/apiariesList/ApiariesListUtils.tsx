import { ApiaryStatus } from "../../../../schemas/interfaces/IApiary";

export function giveApiaryStatusName(status: ApiaryStatus): string {
    switch (status) {
        case ApiaryStatus.ACTIVE:
            return 'Ativo';
        case ApiaryStatus.WAITING_DGADR:
            return 'Pendente de DGADR';
        case ApiaryStatus.WAITING_CZ:
            return 'Pendente de Zona Controlada';
        case ApiaryStatus.REJECTED:
            return 'Rejeitado';
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
        case ApiaryStatus.REJECTED:
            return 'text-red-500';
    }
}
