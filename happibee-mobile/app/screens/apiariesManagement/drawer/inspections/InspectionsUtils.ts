export function getPopulationClass(status: string): string {
    switch (status) {
        case 'Muito boa':
            return 'bg-green-800';
        case 'Normal':
            return 'bg-green-500';
        case 'Baixa':
            return 'bg-red-500';
        case 'Muito baixa':
            return 'bg-red-800';
        default:
            return ''
    }
}

export function getHoneyPolenClass(status: string): string {
    switch (status) {
        case 'Muito bons':
            return 'bg-green-800';
        case 'Normais':
            return 'bg-green-500';
        case 'Baixos':
            return 'bg-red-500';
        case 'Muito baixos':
            return 'bg-red-800';
        default:
            return ''
    }
}

export function getBroodPatternsClass(status: string): string {
    switch (status) {
        case 'Maioritariamente sólido':
            return 'bg-green-800';
        case 'Pontuado':
            return 'bg-green-500';
        case 'Muito irregular':
            return 'bg-red-500';
        case 'Sem ninhada':
            return 'bg-red-800';
        default:
            return ''
    }
}

export function getTemperamentClass(status: string): string {
    switch (status) {
        case 'Calmo':
            return 'bg-green-800';
        case 'Agressivo':
            return 'bg-red-800';
        default:
            return ''
    }
}

export function getDiseasesClass(status: string): string {
    switch (status) {
        case 'Não':
            return 'bg-green-800';
        case 'Sim':
            return 'bg-red-800';
        default:
            return ''
    }
}


