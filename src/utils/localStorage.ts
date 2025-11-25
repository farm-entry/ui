export function saveWithTTL<T>(key: string, value: T, ttlHours: number = 48): void {
  const expiresAt = Date.now() + ttlHours * 60 * 60 * 1000;
  localStorage.setItem(key, JSON.stringify({ value, expiresAt }));
}

export function getWithTTL<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const { value, expiresAt } = JSON.parse(item);
  
  if (Date.now() > expiresAt) {
    localStorage.removeItem(key);
    return null;
  }
  
  return value;
}
