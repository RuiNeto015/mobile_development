import { AnnualDeclarationType } from "../../../../schemas/dtos/EmitAnnualDeclaration";
import { AnnualDeclarationState } from "../../../../schemas/dtos/EmitAnnualDeclaration";

export function giveAnnualDeclarationTypeName(status: AnnualDeclarationType): string {
    switch (status) {
        case AnnualDeclarationType.BEEKEEPER_INITIAL_REGISTRY:
            return 'Registo Inicial de Apicultor';
        case AnnualDeclarationType.ACTIVITY_CLOSE:
            return 'Atividade Fechada';
        case AnnualDeclarationType.ACTIVITY_RESTART:
            return 'Reinício de Atividade';
        case AnnualDeclarationType.ALTERATION_REQUEST:
            return 'Pedido de Alteração';
        default:
            return 'Sem estado';
    }
}

export function getAnnualDeclarationStatusClass(status: AnnualDeclarationState): string {
    switch (status) {
        case AnnualDeclarationState.ACCEPTED:
            return 'text-green-500';
        case AnnualDeclarationState.PENDENT:
            return 'text-yellow-500';
        case AnnualDeclarationState.REJECTED:
            return 'text-red-500';
    }
}

export function giveAnnualDeclarationStateName(status: string): string {
    switch (status) {
        case "PENDING":
            return 'Pendente';
        case AnnualDeclarationState.PENDENT:
            return 'Pendente';
        case AnnualDeclarationState.ACCEPTED:
            return 'Aceite';
        case "APPROVED":
            return 'Aceite';
        case AnnualDeclarationState.REJECTED:
            return 'Rejeitada';
        default:
            return 'Sem estado';
    }
}
