import { Client } from "@stomp/stompjs"

let client: Client | null = null

export function getStompClient(): Client {
  if (!client) {
    client = new Client({
      brokerURL: process.env.NEXT_PUBLIC_STOMP_BROKER_URL,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP] " + str),
    })
    client.activate()
  }
  return client
}
