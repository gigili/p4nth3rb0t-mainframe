import WebSocket from "ws";
import { webServer } from "./webserver";
//wss - web socket server
//ws - web socket client

//initialize the WebSocket server instance
export const wsServer = new WebSocket.Server({ server: webServer });

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

wsServer.on("connection", (ws: ExtWebSocket) => {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  const ping = setInterval(() => {
    wsServer.clients.forEach((ws: any) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 10000);

  ws.on("close", function (cc: number, cmsg: string) {
    clearInterval(ping);
  });

  //send feedback to the incoming connection
  ws.send(
    JSON.stringify({
      status: 200,
      msg: "🔥 Welcome to the p4nth3rb0t mainframe",
    })
  );
});
