# Welcome to the p4nth3rb0t MAINFRAME

## Testing events with fdgt

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

---

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
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
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
