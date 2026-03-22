export function toCamelCase(str: string): string {
    try {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    } catch (error) {
        console.error("Error converting string to camelCase:", error);
        return str;
    }
}