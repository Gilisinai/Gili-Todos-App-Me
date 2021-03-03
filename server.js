const dotenv = require('dotenv');
dotenv.config();
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");
const path = require('path')
const express = require('express')


const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

if(process.env.MODE === 'production'){
  //set a static folder
  app.use(express.static('dist'))
  // app.get('*', (req, res) => {
  //     res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  // })
  app.use((req, res, next) => {

    res.sendFile(path.join(__dirname, "dist/mean-app", "index.html"))
  })
}

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

app.listen(port, ()=>console.log('server started!'));
