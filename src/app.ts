import "./env";

import { webServer } from "./webserver";
import { tmi } from "./tmi";
import { testConfig } from "./../testConfig";
import "./events/subscriptions";
import "./events/messages";

async function run() {
  try {
    webServer.listen(process.env.PORT || 8999, () => {
      console.log(
        `p4nth3rb0t mainframe started on port ${
          (webServer.address() as any).port
        } :)`
      );
    });
    await tmi.connect();

    if (testConfig.connectToFdgt) {
      setTimeout(() => {
        tmi.say(testConfig.channel, testConfig.command);
      }, 5000);
    }
  } catch (error) {
    console.log(error);
  }
}

run();
