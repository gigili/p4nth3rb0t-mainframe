import express, { Request, Response } from "express";
import http from "http";

const app = express();

app.use("/", (req: Request, res: Response) => {
  res.send("P4NTH3RB0T MAINFRAME");
});

//initialize a simple http server
export const webServer = http.createServer(app);
