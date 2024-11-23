export function getNumberFromUUID(uuid: string) {
    let number = parseInt(uuid
        .replace(/[a-f-]/gi, '')
        .replace("0", "1")
        .substring(0, 10), 10);
    return number % 6;
}