
export function replaceAllUnderlines(text: string): string {
    return text?.replaceAll("_", " ");
}

export function toNormalFormat(text: string): string {
    const _text = replaceAllUnderlines(text);
    return _text.charAt(0).toUpperCase() + _text.slice(1).toLowerCase();

}