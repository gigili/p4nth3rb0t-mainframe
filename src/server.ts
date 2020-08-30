import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import tmi, { ChatUserstate } from 'tmi.js';

const client = new (tmi.Client as any)({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: ['whitep4nth3r'],
});

client.connect();

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//wss - web socket server
//ws - web socket client

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
  // ping: () => {};
}

wss.on('connection', (ws: ExtWebSocket) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  client.on(
    'message',
    (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
      // "Alca: Hello, World!"
      console.log(`${tags['display-name']}: ${message}`);
    }
  );

  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    //log the received message and send it back to the client
    console.log('received: %s', message);

    // arbitrary way to send categorised messages?
    const broadcastRegex = /^broadcast\:/;

    if (broadcastRegex.test(message)) {
      message = message.replace(broadcastRegex, '');

      //send back the message to the other clients
      console.log(wss.clients);
      wss.clients.forEach((client) => {
        // if (client != ws) {
        client.send(`Hello, broadcast message -> ${message}`);
        // }
      });
    } else {
      ws.send(`Hello, you sent -> ${message}`);
    }
  });

  const ping = setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 10000);

  ws.on('close', function (cc: number, cmsg: string) {
    clearInterval(ping);
  });

  //send immediatly a feedback to the incoming connection
  ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${(server.address() as any).port} :)`);
});
