import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import asyncWrapper from "./utils/asyncWrapper";
import { sendLiveAnnouncement, sendOfflineAnnouncement } from "./discord";
import { sendBroadcasterFollowEvent } from "./events/follows";
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
  asyncWrapper(async (req: Request, res: Response) => {
    const toSubscribeTo = [...config.teamMembers, config.broadcaster].map(
      (member) => member
    );

    const member = toSubscribeTo.find(
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
  })
);

app.post(
  "/webhooks/subscribe/broadcasterfollow",
  asyncWrapper(async (req: Request, res: Response) => {
    console.log("🔔 Broadcaster follow received");

    //todo - get follower name from data

    //   {
    //     "data": [
    //         {
    //             "followed_at": "2020-11-20T20:37:07Z",
    //             "from_id": "40856022",
    //             "from_name": "exegete46",
    //             "to_id": "469006291",
    //             "to_name": "whitep4nth3r"
    //         }
    //     ]
    // }

    if (req.body.data.length) {
      await sendBroadcasterFollowEvent(
        req.body.data[0].from_name,
        req.body.data[0].from_id
      );
    }

    return res.status(200).send();
  })
);

app.get(
  "/webhooks/subscribe/broadcasterfollow",
  (req: Request, res: Response) => {
    console.log("we are here");

    res.status(200).send(req.query["hub.challenge"]);

    console.log(`💘  Webhook subscribed for broadcaster follows!`);
  }
);

app.get("/webhooks/subscribe/:member_id", (req: Request, res: Response) => {
  const toSubscribeTo = [...config.teamMembers, config.broadcaster].map(
    (member) => member
  );

  const member = toSubscribeTo.find(
    (member) => member.id === req.params.member_id
  );

  if (!member) {
    res.sendStatus(404);
    return;
  }

  res.status(200).send(req.query["hub.challenge"]);

  console.log(`↪️  Webhook subscribed for ${member.name} streams!}`);
});

app.use("/", (req: Request, res: Response) => {
  res.send("🔥 Welcome to the p4nth3rb0t mainframe");
});

export const webServer = http.createServer(app);
