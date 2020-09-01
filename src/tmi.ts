import { ChatUserstate } from 'tmi.js';
import { ChatUserstate } from 'tmi.js';
import { Client, ChatUserstate } from 'tmi.js';
import { wsServer } from './websocket';

export const tmi = new (Client as any)({
  options: { debug: process.env.NODE_ENV === 'development' ? true : false },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.BOT_NAME,
    password: process.env.BOT_AUTH,
  },
  channels: [process.env.CHANNELS],
});

//TODO send specific messaged based on all the events
// I care about
// And then get all p4nth3rball and p4nth3rdrop to listen for those events

tmi.on(
  'message',
  (channel: string, tags: ChatUserstate, message: string, self: boolean) => {
    wsServer.clients.forEach((client) => {
      client.send(message);
    });
  }
);

tmi.on('join', (channel: string, username: string, self: boolean) => {
  wsServer.clients.forEach((client) => {
    client.send(`joined': ${username}`);
  });
});

/* Subscriptions */
tmi.on(
  'anongiftpaidupgrade',
  async (channel: string, username: string, userstate: ChatUserstate) => {}
);

tmi.on(
  'giftpaidupgrade',
  async (
    channel: string,
    username: string,
    sender: string,
    userstate: ChatUserstate
  ) => {}
);

tmi.on(
  'subgift',
  (
    channel: string,
    username: string,
    streakMonths: number,
    recipient: string,
    methods: {},
    userstate: ChatUserstate
  ) => {}
);

tmi.on(
  'subscription',
  (
    channel: string,
    username: string,
    recipient: string,
    methods: {},
    message: string,
    userstate: ChatUserstate
  ) => {}
);

tmi.on(
  'resub',
  (
    channel: string,
    username: string,
    months: number,
    message: string,
    userstate: ChatUserstate,
    methods: {}
  ) => {}
);

tmi.on(
  'submysterygift',
  (
    channel: string,
    username: string,
    numbOfSubs: number,
    methods: {},
    userstate: ChatUserstate
  ) => {}
);
