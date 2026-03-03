import * as signalR from "@microsoft/signalr";
import { Message } from "../types/chat.types";

interface ServerEventMap {
  ReceiveNewMessage: Message;
}

type ServerEventName = keyof ServerEventMap;
type EventHandler<T> = (data: T) => void;

class WebSocketService {
  private connection: signalR.HubConnection | null = null;
  private handlers = new Map<ServerEventName, Set<EventHandler<unknown>>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  async connect(): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chatHub`, {
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setupConnectionEvents();
      this.setupServerEvents();

      await this.connection.start();
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error("SignalR Connection Error:", error);
      this.handleReconnect();
    }
  }

  private setupConnectionEvents(): void {
    if (!this.connection) return;

    this.connection.onclose(() => {
      this.handleReconnect();
    });

    this.connection.onreconnected(() => {
      this.reconnectAttempts = 0;
    });
  }

  private setupServerEvents(): void {
    if (!this.connection) return;

    const serverEvents: ServerEventName[] = ["ReceiveNewMessage"];

    serverEvents.forEach((eventKey) => {
      this.connection?.on(eventKey, (...args: [ServerEventMap[typeof eventKey]]) => {
        const eventHandlers = this.handlers.get(eventKey);
        if (eventHandlers && eventHandlers.size > 0) {
          eventHandlers.forEach((handler) => {
            try {
              handler(args[0]);
            } catch (err) {
              console.error(`[WebSocketService] Error in handler for ${eventKey}:`, err);
            }
          });
        } else {
          console.warn(`[WebSocketService] No handlers registered for event: ${eventKey}`);
        }
      });
    });
  }

  on<K extends ServerEventName>(event: K, handler: EventHandler<ServerEventMap[K]>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)?.add(handler as unknown as EventHandler<unknown>);
  }

  off<K extends ServerEventName>(event: K, handler: EventHandler<ServerEventMap[K]>): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler as unknown as EventHandler<unknown>);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    setTimeout(() => this.connect(), delay);
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.reconnectAttempts = 0;
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
