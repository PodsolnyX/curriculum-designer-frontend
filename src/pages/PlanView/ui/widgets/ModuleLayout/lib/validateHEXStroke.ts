export function validateHEXStroke(color: string | undefined): boolean {
  if (typeof color !== 'string') return false;

  if (!color.startsWith('#')) return false;
  if (color.length !== 4 && color.length !== 7) return false;

  const hexPart = color.slice(1);
  const hexRegex = /^[A-Fa-f0-9]+$/;

  return hexRegex.test(hexPart);
}
