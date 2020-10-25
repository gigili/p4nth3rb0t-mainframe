import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";

import { sendLiveAnnouncement, sendOfflineAnnouncement } from "./discord";
import { config } from "./config";

const app = express();
app.use(bodyParser.json());

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5000",
      credentials: true,
    })
  );
}

app.post(
  "/webhooks/subscribe/:member_id",
  async (req: Request, res: Response) => {
    const member = config.teamMembers.find(
      (member) => member.id === req.params.member_id
    );
    if (!member) {
      res.sendStatus(404);
      return;
    }

    console.log("🔔 Notification received");

    if (!req.body.data.length) {
      await sendOfflineAnnouncement(req.params.member_id);
    } else if (req.body.data[0].type === "live") {
      await sendLiveAnnouncement(req.body.data[0]);
    }

    return res.status(200).send();
  }
);

//When Twitch sends a post request to the callback url you provided
//it will expect a 200 and the 'hub.challenge' query string
app.get("/webhooks/subscribe/:member_id", (req: Request, res: Response) => {
  const member = config.teamMembers.find(
    (member) => member.id === req.params.member_id
  );
  if (!member) {
    res.sendStatus(404);
    return;
  }

  res.status(200).send(req.query["hub.challenge"]);
  console.log(
    `↪️  Webhook subscribed for ${member.name}! ${req.query["hub.topic"]}`
  );
});

app.use("/", (req: Request, res: Response) => {
  res.send("🔥 Welcome to the p4nth3rb0t mainframe");
});

//initialize a simple http server
export const webServer = http.createServer(app);
