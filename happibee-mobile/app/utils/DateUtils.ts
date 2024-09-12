export function formatDateToYYYYMMDD(date: Date): string {
    // Ensure the input is a valid Date object
    if (isNaN(date.getTime())) {
        return "Data inválida"
    }

    // Get the components of the date
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day: string = String(date.getDate()).padStart(2, "0");

    // Construct the formatted string
    return `${day}-${month}-${year}`;
}

export function formatDateStringToYYYYMMDD(dateString: string): string {
    var date = new Date(dateString)
    return formatDateToYYYYMMDD(date)
}

export function formatLocalDateTime(localDateTime: Date): string {
    // Ensure the input is a valid Date object
    if (isNaN(localDateTime.getTime())) {
        return "Data inválida"
    }

    // Get the components of the Date
    const year: number = localDateTime.getUTCFullYear();
    const month: string = String(localDateTime.getUTCMonth() + 1).padStart(2, '0');
    const day: string = String(localDateTime.getUTCDate()).padStart(2, '0');
    const hours: string = String(localDateTime.getUTCHours()).padStart(2, '0');
    const minutes: string = String(localDateTime.getUTCMinutes()).padStart(2, '0');
    const seconds: string = String(localDateTime.getUTCSeconds()).padStart(2, '0');

    // Construct the formatted string
    return `${day}-${month}-${year} - ${hours}:${minutes}:${seconds}`;
}

export function formatLocalDateTimeString(dateTimeString: string): string {
    const localDateTime = new Date(dateTimeString);
    return formatLocalDateTime(localDateTime);
}

export function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0"); // Ensure two digits
    const minutes = now.getMinutes().toString().padStart(2, "0"); // Ensure two digits
    return `${hours}h${minutes}`;
}