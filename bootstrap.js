// bootstrap.js

const WebFramework = require('@midwayjs/web').Framework;
const SocketFramework = require('@midwayjs/socketio').Framework;
const { Bootstrap } = require('@midwayjs/bootstrap');

// 加载主 web 框架
const webFramework = new WebFramework().configure({
  port: 7001,
  path: '/',
});

// 加载副 socket.io 框架，自动适配主框架
const socketFramework = new SocketFramework().configure({
  path: '/socket.io',
});

Bootstrap.load(webFramework).load(socketFramework).run();
