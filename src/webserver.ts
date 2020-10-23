import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";

import { sendLiveAnnouncement } from "./discord";

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

//Whenever twitch sends a notification to your subscribed webhook topic
//it will send it to this endpoint. You have to send back a 200
//otherwise twitch will think you did not recieve the notification and spam you
app.post("/webhooks/subscribe", async (req: Request, res: Response) => {
  console.log("🔔 Notification recieved");
  console.log("DATA ", req.body.data[0]);

  if (req.body.data[0].type === "live") {
    console.log("WE HAVE A LIVE ANNOUNCEMENT");
    await sendLiveAnnouncement(req.body.data[0]);
  }

  return res.status(200).send();
});

//When Twitch sends a post request to the callback url you provided
//it will expect a 200 and the 'hub.challenge' query string
app.get("/webhooks/subscribe", (req: Request, res: Response) => {
  res.status(200).send(req.query["hub.challenge"]);
  console.log(`↪️  Webhook subscribed! ${req.query["hub.topic"]}`);
});

app.use("/", (req: Request, res: Response) => {
  res.send("🔥 Welcome to the p4nth3rb0t mainframe");
});

//initialize a simple http server
export const webServer = http.createServer(app);
