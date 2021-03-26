const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {


        //출입내역
        {
            const PAGE_NAME='3_1_'
            // 출입내역 조회
            socket.on(PAGE_NAME+'search_gubun_data', function (msg) {
                var sqlQuery = "SELECT a.marina_id, a.boat_id, b.boat_nm, a.send_time, a.boatinout,c.detail_nm as boatinout_nm FROM tb_boat_hist a, tb_boat b, tb_code_detail c ";
                sqlQuery += "WHERE a.marina_id = b.marina_id AND a.boat_id = a.boat_id AND c.group_cd = 'BOATINOUT' AND a.boatinout = c.detail_cd ";

                if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && !API.isEmpty(msg.cctvName)) {//모든 정보가 있을때
                    sqlQuery += "and (b.boat_nm LIKE '%'||$1||'%')";
                    sqlQuery += "and (a.send_time between $2 and $3) ";
                    SQL.postgresSQL(sqlQuery, Object.values(msg), [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        // console.log(data);
                    });

                } else if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && API.isEmpty(msg.cctvName)) {//조회 기간만 있을떄
                    sqlQuery += "and (a.send_time between $1 and $2)";

                    SQL.postgresSQL(sqlQuery, [msg.startDay, msg.endDay], [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        // console.log(data);
                    });

                } else if (!API.isEmpty(msg.cctvName)) {//이름 조회
                    sqlQuery += "and (b.boat_nm LIKE '%'||$1||'%')";

                    SQL.postgresSQL(sqlQuery, [msg.cctvName], [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        // console.log(data);
                    });

                }else {//조회만 누를때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        // console.log(data);
                    });
                }

                newData = false;

            });


        }


    });


}