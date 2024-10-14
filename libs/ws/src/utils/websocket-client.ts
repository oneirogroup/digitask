const subscriptions = Symbol("ws.subscriptions");

export class WebsocketClient {
  private ws: WebSocket;
  private tried = 0;
  private tries = 5;
  private emittedData: [string, any][] = [];
  private subscriptions: Record<string | symbol, ((data: any) => void)[]> = {};

  constructor(private readonly url: string) {
    this.ws = new WebSocket(url);
    this.prepare();
  }

  setTries(tries: number) {
    this.tries = tries;
  }

  emit<TData>(event: string, data: TData) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    } else {
      this.emittedData.push([event, data]);
    }
  }

  on<TData>(event: string, cb: (data: TData) => void) {
    if (!this.subscriptions[event]) {
      this.subscriptions[event] = [];
    }

    this.subscriptions[event].push(cb);
  }

  listen<TData>(cb: (data: TData) => void) {
    if (!this.subscriptions[subscriptions]) {
      this.subscriptions[subscriptions] = [];
    }

    this.subscriptions[subscriptions].push(cb);

    return () => {
      this.subscriptions[subscriptions] = this.subscriptions[subscriptions].filter(sub => sub !== cb);
    }
  }

  private prepare() {
    this.ws.addEventListener("open", () => {
      this.emittedData.forEach(([event, data]) => this.emit(event, data));
      this.emittedData = [];

      Object.entries(this.subscriptions).forEach(([subs, listeners]) => {
        // @ts-ignore
        if (subs === subscriptions) {
          listeners.forEach(cb => this.listen(cb));
          return;
        }

        this.on(subs, data => listeners.forEach(cb => cb(data)));
      });

      this.ws.addEventListener("message", event => {
        const data = event.data;

        try {
          const { event, data: datum } = JSON.parse(data);
          this.subscriptions[event]?.forEach(cb => cb(datum));
          this.subscriptions[subscriptions]?.forEach(cb => cb(data));
        } catch (e) {
          console.error(e);
        }
      });
    });

    this.ws.addEventListener("close", () => {
      this.reconnect();
    });
  }

  private reconnect() {
    if (this.tried === this.tries) {
      throw new Error("Max tries reached");
    }
    this.tried++;

    this.ws.close();
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener("open", () => {
      this.tried = 0;
    });
    this.prepare();
  }
}
