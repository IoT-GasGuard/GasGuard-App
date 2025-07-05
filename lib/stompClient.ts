import { Client } from "@stomp/stompjs"

let client: Client | null = null

export function getStompClient(): Client {
  if (!client) {
    client = new Client({
      brokerURL: "ws://localhost:8080/ws/monitoring", // 🔄 cambia a tu endpoint real si es necesario
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP] " + str),
    })
    client.activate()
  }
  return client
}
