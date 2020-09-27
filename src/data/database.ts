import mongoose from "mongoose";

const connect = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/p4nth3rb0t", {
    user: "p4nth3rb0t",
    pass: "supersecretpassword",
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Database connected");
  });
};

export default { connect };
