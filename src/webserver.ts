import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import asyncWrapper from "./utils/asyncWrapper";
import { sendLiveAnnouncement, sendOfflineAnnouncement } from "./discord";
import { sendBroadcasterFollowEvent } from "./events/follows";
import { TeamMembers } from "./data/types";
import Team from "./users/Team";

const app = express();
app.use(bodyParser.json());

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5000",
      credentials: true,
    }),
  );
}

app.post(
  "/webhooks/subscribe/team/:member_id",
  asyncWrapper(async (req: Request, res: Response) => {
    const teamMembers: TeamMembers = await Team.getMembers();

    const member = teamMembers.find(
      (member) => member.user_id === req.params.member_id,
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
  }),
);

app.get(
  "/webhooks/subscribe/team/:member_id",
  asyncWrapper(async (req: Request, res: Response) => {
    try {
      const teamMembers: TeamMembers = await Team.getMembers();

      const member = teamMembers.find(
        (member) => member.user_id === req.params.member_id,
      );

      if (!member) {
        res.sendStatus(404);
        return;
      }

      res.status(200).send(req.query["hub.challenge"]);
      console.log(`↪️  Webhook subscribed for ${member.user_name} streams!`);
    } catch (error) {
      console.log(error);
    }
  }),
);

app.post(
  "/webhooks/subscribe/broadcaster/follow",
  asyncWrapper(async (req: Request, res: Response) => {
    console.log("🔔 Broadcaster follow received");

    if (req.body.data.length) {
      await sendBroadcasterFollowEvent(
        req.body.data[0].from_name,
        req.body.data[0].from_id,
      );
    }

    return res.status(200).send();
  }),
);

app.get(
  "/webhooks/subscribe/broadcaster/follow",
  (req: Request, res: Response) => {
    res.status(200).send(req.query["hub.challenge"]);
    console.log(`💘  Webhook subscribed for broadcaster follows!`);
  },
);

app.use("/", (req: Request, res: Response) => {
  res.send("🔥 Welcome to the p4nth3rb0t mainframe");
});

export const webServer = http.createServer(app);
