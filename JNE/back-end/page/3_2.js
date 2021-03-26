const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        const PAGE_NAME = '3_2_';

            // 조회
            socket.on(PAGE_NAME+'search_data', function (msg) {
                var sqlQuery = "SELECT a.marina_id, a.send_time, a.boatinout, c.detail_nm as boatinout_nm, a.anchor_id,b.anchor_nm FROM tb_unreg_boatdata a, tb_anchor b, tb_code_detail c ";
                sqlQuery += "WHERE a.marina_id = 1 AND a.anchor_id = b.anchor_id AND a.boatinout = c.detail_cd AND c.group_cd ='BOATINOUT' ";

                if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay)) {//모든 정보가 있을때
                    sqlQuery += "AND a.send_time between $1 and $2";
                    SQL.postgresSQL(sqlQuery, Object.values(msg), [socket, PAGE_NAME+'search']).then(function (data) {
                        // console.log(data);
                    });

                } else {//조회만 누를때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME+'search']).then(function (data) {
                        // console.log(data);
                    });
                }

            });


        


    });


}