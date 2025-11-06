class CacheService {
  private cache: Map<string, { data: unknown; expiry: number }> = new Map();

  /**
   * Store data in the cache with a specific key and expiry time.
   * @param key The cache key.
   * @param data The data to store.
   * @param ttl Time-to-live in milliseconds.
   */
  set<T>(key: string, data: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Retrieve data from the cache if it hasn't expired.
   * @param key The cache key.
   * @returns The cached data or null if expired/not found.
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.cache.clear();
  }
}

export default new CacheService();