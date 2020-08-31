import { config } from "dotenv";
config();

import { webServer } from "./webserver";
import { tmi } from "./tmi";

async function run() {
  try {
    webServer.listen(process.env.PORT || 8999, () => {
      console.log(
        `p4nth3rb0t mainframe started on port ${
          (webServer.address() as any).port
        } :)`
      );
    });
    tmi.connect();
  } catch (error) {}
}

run();
