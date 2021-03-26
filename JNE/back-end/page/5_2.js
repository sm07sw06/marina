const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        const PAGE_NAME = '5_2_';

            // 조회
            socket.on(PAGE_NAME+'search_data', function (msg) {
                var sqlQuery = "SELECT a.marina_id, a.anchor_id, c.anchor_nm, a.boat_id, a.enter_dt, a.leave_dt, to_char(to_timestamp(a.leave_dt, 'YYYYMMDDHH24MISS')- to_timestamp(a.enter_dt, 'YYYYMMDDHH24MISS'),'HH24:MI') as times ";
                sqlQuery += "FROM public.tb_anchor_hist a,  tb_anchor c WHERE a.marina_id = 1 AND a.boat_id is null AND a.marina_id = c.marina_id AND a.anchor_id = c.anchor_id ";

                if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay)) {//모든 정보가 있을때
                    sqlQuery += "AND ( a.enter_dt between $1 and $2 or a.leave_dt between $1 and $2 )";
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