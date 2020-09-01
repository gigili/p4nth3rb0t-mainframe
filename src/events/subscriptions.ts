import { wsServer } from '../websocket';
import { tmi } from './../tmi';
import { ChatUserstate } from 'tmi.js';
import UserManager from '../users/UserManager';

//According to tmijs docs that is what is happening.
//Subgif is a gift to someone directly as in 1:1,
//where as mysterygift can be 1:N number of gifts given

enum Event {
  sub = 'SUBSCRIPTION',
}

interface SubEvent {
  event: Event;
  subscriberAvatarUrl: string;
}

const userManager = new UserManager();

const sendSubEvent = async (userId: string) => {
  const user = await userManager.getUser(userId as string);

  const subEvent: SubEvent = {
    event: Event.sub,
    subscriberAvatarUrl: user.logo,
  };

  wsServer.clients.forEach((client) => {
    client.send(subEvent);
  });
};

// DEBUGGING
// tmi.on(
//   'message',
//   async (
//     channel: string,
//     tags: ChatUserstate,
//     message: string,
//     self: boolean
//   ) => {
//     sendSubEvent(tags['user-id'] as string);
//   }
// );

tmi.on(
  'anongiftpaidupgrade',
  async (channel: string, username: string, userstate: ChatUserstate) => {
    sendSubEvent(userstate['user-id'] as string);
  }
);

tmi.on(
  'giftpaidupgrade',
  async (
    channel: string,
    username: string,
    sender: string,
    userstate: ChatUserstate
  ) => {
    sendSubEvent(userstate['user-id'] as string);
  }
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
  ) => {
    sendSubEvent(userstate['user-id'] as string);
  }
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
  ) => {
    sendSubEvent(userstate['user-id'] as string);
  }
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
  ) => {
    sendSubEvent(userstate['user-id'] as string);
  }
);

tmi.on(
  'submysterygift',
  (
    channel: string,
    username: string,
    numbOfSubs: number,
    methods: {},
    userstate: ChatUserstate
  ) => {
    sendSubEvent(userstate['user-id'] as string);
  }
);
