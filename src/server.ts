import { config } from 'dotenv';
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import tmi, { ChatUserstate } from 'tmi.js';

config();

const tmiclient = new (tmi.Client as any)({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.BOT_NAME,
    password: process.env.P4NTH3RB0T_AUTH,
  },
  channels: [process.env.CHANNELS],
});

tmiclient.connect();

const app = express();

app.use('/', (req, res) => {
  res.send('P4NTH3RB0T MAINFRAME');
});

//initialize a simple http server
const server = http.createServer(app);

//wss - web socket server
//ws - web socket client

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

wss.on('connection', (ws: ExtWebSocket) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
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

  //send immediately a feedback to the incoming connection
  ws.send('Welcome to the p4nth3rb0t mainframe');
});

//TODO send specific messaged based on all the events
// I care about
// And then get all p4nth3rball and p4nth3rdrop to listen for those events

tmiclient.on(
  'message',
  (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
    wss.clients.forEach((client) => {
      client.send(message);
    });
  }
);

tmiclient.on('join', (channel: string, username: string, self: boolean) => {
  wss.clients.forEach((client) => {
    client.send(`joined': $username`);
  });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `p4nth3rb0t mainframe started on port ${(server.address() as any).port} :)`
  );
});
