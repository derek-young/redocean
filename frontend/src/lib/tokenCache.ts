interface CachedToken {
  decodedToken: any;
  expiresAt: number;
}

class TokenCache {
  private cache = new Map<string, CachedToken>();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes

  set(token: string, decodedToken: any): void {
    const expiresAt = Date.now() + this.TTL;
    this.cache.set(token, {
      decodedToken,
      expiresAt,
    });
  }

  get(token: string): any | null {
    const cached = this.cache.get(token);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(token);
      return null;
    }

    return cached.decodedToken;
  }

  delete(token: string): void {
    this.cache.delete(token);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const idTokenCache = new TokenCache();
export const sessionTokenCache = new TokenCache();
