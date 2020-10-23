# Welcome to the p4nth3rb0t MAINFRAME

P4nth3rb0t MAINFRAME is a backend to support all things Twitch chat bot and overlay. It is written in Typescript and uses websockets to communicate.

It can handle the following Twitch events:

```
- Subscriptions - All tiers, gift subs, resubs and sub upgrades
- Raids
- Bits
- Chat messages and commands
```

It also supports the following custom events originally found in [P4nth3rDrop](https://github.com/whitep4nth3r/p4nth3rdrop):

```
- !rain
- !shower
- !snow
- !hail
- !blizzard
- !fire

- !drop me
- !drop {emotes}
- !bigdrop {emotes}
- !yeet me
- !yeet {user}

// broadcaster only
- !start-trail
- !end-trail
```

## Getting started with development

System requirements:

```
NodeJs
Docker
```

### Environment variables

All environment variables you will need for the application to run are demonstrated for you in the file `env.example`.

### The database

The p4nth3rbot-mainframe uses a MongoDB to store the following:

```
Twitch API access token
```

To spin up the docker container and database instance, open terminal and run:

```
cd path/to/repo
docker-compose up
```

### Running the application

In a separate terminal tab, run:

```
cd path/to/repo
npm run dev
```

## Testing events with fdgt

Fdgt is an excellent tool that allows you to test your events without having to spend money on Twitch.

[See fdgt docs](https://fdgt-website.now.sh/docs/getting-started)

Find the file `testConfig.example.ts` in the root of the directory.

To test mainframe events with fdgt, change the file name to `testConfig.ts` and set the variables accordingly.

If `testConfig.connectToFdgt === true`, the following things will happen:

1. In `src/tmi.js`, the `connection.server` will be updated to `irc.fdgt.dev`.

2. In `src/app.js`, after 5 seconds, fdgt will send the test command that you specify as `testConfig.command`.

3. Userstate and other values that are sent from the Twitch API are not provided in full by fdgt. You will need to mock these. Use `testConfig` values to send test events accordingly, for example, sending user ids to subscription events, like so:

```
  testConfig.connectToFdgt
      ? sendSubEvent(testConfig.userId, testConfig.userId)
      : sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);

```

## Configuring your team shout out

TODO...

---

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.akr.is"><img src="https://avatars2.githubusercontent.com/u/5489879?v=4" width="100px;" alt=""/><br /><sub><b>Anton Kristensen</b></sub></a><br /><a href="https://github.com/whitep4nth3r/p4nth3rb0t-mainframe/commits?author=antonedvard" title="Code">💻</a></td>
    <td align="center"><a href="http://lucecarter.co.uk"><img src="https://avatars2.githubusercontent.com/u/6980734?v=4" width="100px;" alt=""/><br /><sub><b>Luce Carter</b></sub></a><br /><a href="https://github.com/whitep4nth3r/p4nth3rb0t-mainframe/commits?author=LuceCarter" title="Documentation">📖</a></td>
    <td align="center"><a href="https://isabellabrookes.com"><img src="https://avatars1.githubusercontent.com/u/12928252?v=4" width="100px;" alt=""/><br /><sub><b>Isabella Brookes</b></sub></a><br /><a href="https://github.com/whitep4nth3r/p4nth3rb0t-mainframe/commits?author=isabellabrookes" title="Code">💻</a></td>
    <td align="center"><a href="https://twitch.tv/MadhouseSteve"><img src="https://avatars1.githubusercontent.com/u/52213009?v=4" width="100px;" alt=""/><br /><sub><b>MadhouseSteve</b></sub></a><br /><a href="https://github.com/whitep4nth3r/p4nth3rb0t-mainframe/commits?author=MadhouseSteve" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/CadillacJack95"><img src="https://avatars1.githubusercontent.com/u/15073669?v=4" width="100px;" alt=""/><br /><sub><b>Mahmoud</b></sub></a><br /><a href="https://github.com/whitep4nth3r/p4nth3rb0t-mainframe/commits?author=CadillacJack95" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
