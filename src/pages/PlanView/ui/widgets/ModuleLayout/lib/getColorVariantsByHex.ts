/**
 * Преобразует hex цвет в rgba с прозрачностью
 */
export const hexToRgba = (hex: string, alpha: number = 0.3): string => {
  const cleanHex = hex.replace('#', '');
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Осветляет цвет на указанный процент
 */
export const lightenColor = (hex: string, percent: number = 20): string => {
  const cleanHex = hex.replace('#', '');
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  let r = parseInt(fullHex.substring(0, 2), 16);
  let g = parseInt(fullHex.substring(2, 4), 16);
  let b = parseInt(fullHex.substring(4, 6), 16);

  r = Math.min(255, r + Math.round((255 * percent) / 100));
  g = Math.min(255, g + Math.round((255 * percent) / 100));
  b = Math.min(255, b + Math.round((255 * percent) / 100));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Получает все варианты цвета
 */
export const getModuleColors = (baseColor: string) => {
  return {
    text: baseColor,
    background: hexToRgba(lightenColor(baseColor, 20), 0.15),
    stroke: lightenColor(baseColor, 10),
  };
};
