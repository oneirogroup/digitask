import { logger } from "../logger";

declare global {
  export var __AUTH_HTTP_SETTINGS__: AuthHttpSettings;
}

interface AuthHttpWaitForTokenOptions {
  timeout?: number;
}

interface Storage {
  getItem(key: string): Promise<string | null>;

  setItem(key: string, value: string): Promise<void>;

  removeItem(key: string): Promise<void>;
}

export class AuthHttpSettings {
  private waitPromise: Promise<void> | null = null;
  private resolveWaitPromise: (() => void) | null = null;

  private constructor() {}

  private _tokenKeys: Record<"access" | "refresh", string | null> = { access: null, refresh: null };

  get tokenKeys() {
    return this._tokenKeys;
  }

  private _storage: Storage | null = null;

  get storage(): Storage | null {
    return this._storage;
  }

  private _tokens: Record<"access" | "refresh", string | null> = { access: null, refresh: null };

  get tokens() {
    return this._tokens;
  }

  private _refreshUrl: string | null = null;

  get refreshUrl() {
    return this._refreshUrl;
  }

  get baseUrl() {
    return globalThis.__AUTH_HTTP_BASE_URL__;
  }

  static instance() {
    return globalThis.__AUTH_HTTP_SETTINGS__ || (globalThis.__AUTH_HTTP_SETTINGS__ = new AuthHttpSettings());
  }

  setBaseUrl(value: string) {
    globalThis.__AUTH_HTTP_BASE_URL__ = value;
    return this;
  }

  setStorage(storage: Storage) {
    this._storage = storage;
    return this;
  }

  setStorageTokenKeys(keys: Record<"access" | "refresh", string>) {
    this._tokenKeys = keys;
    return this;
  }

  setRefreshUrl(url: string) {
    this._refreshUrl = url;
    return this;
  }

  async waitForToken({ timeout = 1e3 }: AuthHttpWaitForTokenOptions = {}) {
    if (!this.waitPromise) {
      const { promise, resolve, reject } = Promise.withResolvers<void>();
      this.waitPromise = promise;
      logger.debug("ui-kit:auth-http:settings:wait-for-token:timeout", timeout);
      const timeoutId = setTimeout(() => {
        logger.debug("ui-kit:auth-http:settings:wait-for-token:timeout:reject");
        this.waitPromise = null;
        reject();
      }, timeout);
      logger.debug("ui-kit:auth-http:settings:wait-for-token:timeout-id", timeoutId);
      this.resolveWaitPromise = () => {
        clearTimeout(timeoutId);
        resolve();
      };
    }

    return Promise.resolve();
  }

  retrieveTokens() {
    return async () => {
      logger.debug("ui-kit:auth-http:settings:retrieve-tokens");
      if (!(this._storage && this.tokenKeys && this.tokenKeys.access && this.tokenKeys.refresh)) {
        logger.debug(
          "ui-kit:auth-http:settings:retrieve-tokens:error",
          "No storage or token keys found for retrieving"
        );
        return;
      }

      logger.debug("ui-kit:auth-http:settings:retrieve-tokens:storage", this._storage);
      logger.debug("ui-kit:auth-http:settings:retrieve-tokens:token-keys:access", this._tokenKeys.access);
      logger.debug("ui-kit:auth-http:settings:retrieve-tokens:token-keys:refresh", this._tokenKeys.refresh);
      const [access, refresh] = await Promise.allSettled([
        this._storage.getItem(this.tokenKeys.access),
        this._storage.getItem(this.tokenKeys.refresh)
      ]);

      if (access.status === "rejected") throw new Error("Access token not found", { cause: access.reason });
      logger.debug("ui-kit:auth-http:settings:access-token:success", access.value);
      if (refresh.status === "rejected") throw new Error("Refresh token not found", { cause: refresh.reason });
      logger.debug("ui-kit:auth-http:settings:refresh-token:success", refresh.value);

      this._tokens.access = access.value;
      this._tokens.refresh = refresh.value;

      if (this.resolveWaitPromise) {
        logger.debug("ui-kit:auth-http:settings:resolve-wait-promise");
        this.resolveWaitPromise();
        this.resolveWaitPromise = null;
        this.waitPromise = null;
      }
    };
  }

  async removeTokens() {
    logger.debug("ui-kit:auth-http:settings:remove-tokens");
    if (!this._storage || !this._tokenKeys.access || !this._tokenKeys.refresh) {
      return;
    }

    if (!this.storage || !this.tokenKeys.access || !this.tokenKeys.refresh) return;
    await Promise.allSettled([
      this.storage.removeItem(this.tokenKeys.access),
      this.storage.removeItem(this.tokenKeys.refresh)
    ]);
    this._tokens = { access: null, refresh: null };
  }

  async awaitRetrievingToken() {
    logger.debug("ui-kit:auth-http:settings:await-retrieving-token");
    if (this.waitPromise === null) {
      return Promise.resolve();
    }

    return await this.waitPromise
      .then(() => logger.debug("ui-kit:auth-http:settings:tokens-retrieved"))
      .catch(() => Promise.resolve());
  }

  getTokens() {
    return this._tokens;
  }
}
