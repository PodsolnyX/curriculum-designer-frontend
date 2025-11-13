
export function roundNumberToPlaces(value: number | undefined, decimalPlaces: number | string): number | undefined {
    if (!value) return undefined;
    if (decimalPlaces && Number(decimalPlaces) < 100 && Number(decimalPlaces) >= 0)
        return parseFloat(value.toFixed(Number(decimalPlaces)))
    return value
}

/**
 * Конвертирует количество байт в наиболее большую возможную единицу измерения.
 * @param {number} bytes - Количество байт
 */
export function byteToSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const units = ['B', 'KB', 'MB', 'GB'];
    const digit = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, digit)).toFixed(2)) + ' ' + units[digit];
}