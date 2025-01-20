import { logger } from "@mdreal/ui-kit/utils";

const subscriptions = Symbol("ws.subscriptions");

const reservedEvents = ["connect", "disconnect", "message", "error"];

declare global {
  var __WEBSOCKET_CLIENTS__: Map<string, WebsocketClient>;
}

export class WebsocketClient {
  static has(name: string) {
    return globalThis.__WEBSOCKET_CLIENTS__?.has(name);
  }

  static get(name: string) {
    return globalThis.__WEBSOCKET_CLIENTS__?.get(name);
  }

  static remove(name: string) {
    globalThis.__WEBSOCKET_CLIENTS__?.delete(name);
  }

  static instance(name: string, url?: string) {
    const clients = (globalThis.__WEBSOCKET_CLIENTS__ ||= new Map());
    logger.debug("ws-client:websocket-client:instance:get", { name, url });
    if (!url) {
      logger.debug("ws-client:websocket-client:instance:get", name);
      return clients.get(name);
    }

    if (!clients.has(name)) {
      logger.debug("ws-client:websocket-client:instance:create", url, "with-name", name);
      clients.set(name, new WebsocketClient(name, url));
    }

    return clients.get(name)!;
  }

  private ws: WebSocket;
  private tried = 0;
  private tries = 5;
  private emitData: object[] = [];
  private subscriptions: Record<string | symbol, ((data: any) => void)[]> = {};

  private openAbortController = new AbortController();
  private messageAbortController = new AbortController();
  private closeAbortController = new AbortController();

  private constructor(
    private readonly name: string,
    private readonly url: string
  ) {
    this.ws = new WebSocket(url);
    this.prepare();
  }

  setTries(tries: number) {
    this.tries = tries;
  }

  emit<TData>(event: string, data: TData) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.send({ event, data });
    } else {
      this.emitData.push({ event, data });
    }
  }

  send(data: object) {
    if (this.ws.readyState === this.ws.OPEN) {
      logger.debug("ws-client:websocket-client:send", data);
      this.ws.send(JSON.stringify(data));
    } else {
      logger.debug("ws-client:websocket-client:save:queue", data);
      this.emitData.push(data);
    }
  }

  on(event: "connect", cb?: () => void): void;
  on<TData>(event: "message", cb?: (data: TData) => void): void;
  on(event: "error", cb?: (err: Error) => void): void;
  on(event: "disconnect", cb?: () => void): void;
  on<TData>(event: string, cb: (data: TData) => void): void;
  on<TData>(event: string, cb?: (data: TData) => void) {
    if (!this.subscriptions[event]) {
      this.subscriptions[event] = [];
    }

    if (cb) {
      logger.debug("ws-client:websocket-client:event:subscribe(%s)", event);
      this.subscriptions[event].push(cb);
    }
  }

  listen<TData>(cb: (data: TData) => void) {
    if (!this.subscriptions[subscriptions]) {
      this.subscriptions[subscriptions] = [];
    }

    this.subscriptions[subscriptions].push(cb);

    return () => {
      this.subscriptions[subscriptions] = this.subscriptions[subscriptions].filter(sub => sub !== cb);
    };
  }

  close() {
    logger.debug("ws-client:websocket-client:close", this.name);
    this.ws.close();
    this.subscriptions = {};
    this.emitData = [];

    this.openAbortController.abort();
    this.messageAbortController.abort();
    this.closeAbortController.abort();
  }

  reconnect() {
    if (this.tried === this.tries) {
      this.callWithErrorHandling(() => {
        this.subscriptions["error"]?.forEach(cb => cb(new Error("Max tries reached")));
      });
      return;
    }
    this.tried++;

    this.ws.close();
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener("open", () => {
      this.tried = 0;
    });
    this.prepare();
  }

  private prepare() {
    logger.debug("ws-client:websocket-client:preparing", this.name);
    this.ws.addEventListener(
      "open",
      () => {
        logger.debug("ws-client:websocket-client:connection:open", this.name);
        this.emitData.forEach(data => this.send(data));
        this.emitData = [];

        this.callWithErrorHandling(() => {
          this.subscriptions["connect"]?.forEach(cb => cb(undefined));
        });

        Object.entries(this.subscriptions).forEach(([subs, listeners]) => {
          if (reservedEvents.includes(subs)) return;

          // @ts-ignore
          if (subs === subscriptions) {
            listeners.forEach(cb => this.listen(cb));
            return;
          }

          this.on(subs, data => listeners.forEach(cb => cb(data)));
        });

        this.ws.addEventListener(
          "message",
          event => {
            const data = event.data;
            logger.debug("ws-client:websocket-client:message", data);

            try {
              const { event, data: datum } = JSON.parse(data);
              this.callWithErrorHandling(() => {
                this.callWithErrorHandling(() => {
                  this.subscriptions[event]?.forEach(cb => cb(datum));
                });

                this.callWithErrorHandling(() => {
                  this.subscriptions[subscriptions]?.forEach(cb => cb(JSON.parse(data)));
                });
                this.callWithErrorHandling(() => {
                  this.subscriptions["message"]?.forEach(cb => cb(JSON.parse(data)));
                });
              });
            } catch (e) {
              this.onError(e as Error);
            }
          },
          { signal: this.messageAbortController.signal }
        );
      },
      { signal: this.openAbortController.signal }
    );

    this.ws.addEventListener(
      "close",
      () => {
        logger.debug("ws-client:websocket-client:connection:close", this.name);
        this.callWithErrorHandling(() => {
          this.subscriptions["disconnect"]?.forEach(cb => cb(undefined));
        });
      },
      { signal: this.closeAbortController.signal }
    );

    this.ws.addEventListener("error", err => {
      logger.debug("ws-client:websocket-client:error", this.name, err);
      this.callWithErrorHandling(() => {
        this.subscriptions["error"]?.forEach(cb => cb(err));
      });
    });
  }

  private callWithErrorHandling(cb: () => void) {
    try {
      cb();
    } catch (error) {
      this.onError(error as Error);
    }
  }

  private onError(err: Error) {
    this.subscriptions["error"]?.forEach(cb => cb(err));
  }
}
