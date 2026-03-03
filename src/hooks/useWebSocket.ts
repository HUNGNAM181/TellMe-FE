import { useEffect, useRef, useCallback } from "react";
import { webSocketService } from "../services/webSocket.service";

export const useWebSocketConnection = () => {
  const isConnecting = useRef(false);

  const connect = useCallback(async () => {
    if (isConnecting.current) return;

    try {
      isConnecting.current = true;
      await webSocketService.connect();
    } catch (err) {
      console.error("WebSocket connection failed:", err);
    } finally {
      isConnecting.current = false;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      webSocketService.disconnect();
    };
  }, [connect]);
};
