
const { PureServer } = require("./PureServer");
const open = require('open');

// 默认启动
let pureServer = new PureServer();

pureServer.port = 9876;

pureServer.setStatic(`/xmind_front_end/`, process.cwd() + "/");

// 使用默认浏览器打开
open('http://localhost:9876/xmind_front_end/index.html');