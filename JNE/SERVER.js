const SQL = require("./back-end/SQL.js");

const express = require('express');//express접근
const app = express();
app.use(express.static('./front-end'));//정적파일(FRONT)
app.use(express.static('./'));//정적파일(이미지)

const PORT = 3330;//포트번호
const ip = require("ip");
const http = require('http').Server(app);//http접근
const io = require('socket.io')(http);//socket접근

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/front-end/1_1.html');//html출력
});

/* 해당 html 정리 */
// require("./TEST/1_1_test.js")(app, io, SQL);
require("./back-end/page/1_1.js")(app, io, SQL);
require("./back-end/page/1_2.js")(app, io, SQL);
require("./back-end/page/1_3.js")(app, io, SQL);

require("./back-end/page/2_1.js")(app, io, SQL);
require("./back-end/page/2_2.js")(app, io, SQL);

require("./back-end/page/3_1.js")(app, io, SQL);
require("./back-end/page/3_2.js")(app, io, SQL);
require("./back-end/page/3_3.js")(app, io, SQL);
require("./back-end/page/3_4.js")(app, io, SQL);

require("./back-end/page/4_1.js")(app, io, SQL);

require("./back-end/page/5_1.js")(app, io, SQL);
require("./back-end/page/5_2.js")(app, io, SQL);

//서버 생성
http.listen(PORT, function () {
    console.log('listening on *:' + PORT);
    console.log('Open Browser : http://' + ip.address() + ':' + PORT + '/');
});

//접속 확인
io.on('connection', function (socket) {
    console.log("접속IP : " + socket.handshake['address']);
});