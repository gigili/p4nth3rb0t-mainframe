let markdownMap = new Map<string, string>(Object.entries({
    '_': '\_'
}));

export function escapeMarkdown(source: string) {
    return String(source).replace(/[_]/g, (s: string) => markdownMap.get(s)!);
}