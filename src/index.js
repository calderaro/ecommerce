import http from "http";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";
import routes from "./routes";
import models from "./models/";

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app
.use(morgan("dev"))
.use(cookieParser())
.use(json())
.use(urlencoded({ extended: false }))
.use((req, res, next) => {
	req.mongoose = mongoose;
	req.models = mongoose.models;
	req.io = io;
	return next();
})
.use(routes);

mongoose.connect("mongodb://localhost/braum", (err) => {
  if(err) return console.log(err);
  mongoose.Promise = global.Promise;
  mongoose.connection.on("error", (err) => console.log(chalk.red("Mongoose default connection error: " + err)));
  mongoose.connection.on("disconnected", () => console.log(chalk.red("Mongoose default connection disconnected")));
  console.log("Mongoose connection open to mongodb://localhost/braum");
	server.listen(80, () => console.log("listening port 80"));
});

io.on("connection", (socket) => {
  const socketsCount = Object.keys(io.sockets.sockets).length;
  socket.emit("welcome", { message: "welcome", count: socketsCount });
  socket.broadcast.emit("user-connected", { message: "new user connection", count: socketsCount });
  socket.on('disconnect', () => {
    socket.broadcast.emit("user-disconnect", { message: "user disconnection", count: socketsCount });
  });
})
