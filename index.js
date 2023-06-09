import http from "node:http";
import express from "express";
import path from "node:path";
import * as dotenv from "dotenv";
import createBareServer from "@tomphttp/bare-server-node";
dotenv.config();
const __dirname = process.cwd();
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "static")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});
app.get("/web", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "web.html"));
});
app.get("/play", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "play.html"));
});

app.get("/apps", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "apps.html"));
});

app.get("/math", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "math.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "chat.html"));
});
app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "settings.html"));
});
app.get("/404", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "404.html"));
});
app.get("/*", (req, res) => {
  res.redirect("/404");
});
server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});
server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});
server.on("listening", () => {
  console.log(`Port: http://localhost:${process.env.PORT}`);
});
server.listen({
  port: process.env.PORT,
});
