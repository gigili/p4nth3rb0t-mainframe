import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5000",
      credentials: true,
    })
  );
}

app.use("/", (req: Request, res: Response) => {
  res.send("P4NTH3RB0T MAINFRAME");
});

//initialize a simple http server
export const webServer = http.createServer(app);
