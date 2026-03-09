const VALID_ROUTES = [
    /^\/$/,
    /^\/livestock-activity(\/move|\/wean|\/gradeoff|\/mortality|\/purchase|\/quantityadj)?$/,
    /^\/scorecards$/,
    /^\/fuel$/,
    /^\/maintenance$/,
    /^\/inventory-consumption$/,
    /^\/job-header-updates$/,
    /^\/qrcode$/,
    /^\/post-success$/,
    /^\/admin$/,
    /^\/login$/,
];

export function UrlParseFromQR(raw: string): string | null {
    console.log({ raw })
    if (!raw) return null;
    let path: string;

    try {
        const parsed = new URL(raw);
        path = parsed.pathname;
        console.log({ parsed, path })
    } catch {
        path = raw;
    }
    const segments = path.split("/").filter(Boolean);
    for (let i = segments.length; i >= 0; i--) {
        const candidate = i === 0 ? "/" : "/" + segments.slice(0, i).join("/");
        if (VALID_ROUTES.some((pattern) => pattern.test(candidate))) {
            return candidate;
        }
    }
    return null;
}

