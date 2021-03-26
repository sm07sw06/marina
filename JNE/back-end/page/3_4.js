const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        //출입내역
        {
            const PAGE_NAME='3_4_'
            // 출입내역 조회
            socket.on(PAGE_NAME+'search_gubun_data', function (msg) {
                var sqlQuery = "SELECT a.marina_id, a.send_time, a.boat_id, b.boat_nm, a.latitude, a.longitude, case when a.gradex > a.gradey then a.gradex else a.gradey end as grade FROM public.tb_sos_list a, tb_boat b ";
                sqlQuery += "WHERE a.marina_id = 1 AND a.boat_id = b.boat_id ";

                if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && !API.isEmpty(msg.cctvName)) {//모든 정보가 있을때
                    sqlQuery += "AND (b.boat_nm LIKE '%'||$1||'%') and (a.send_time between $2 and $3)";
                    SQL.postgresSQL(sqlQuery, Object.values(msg), [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        //console.log(data);
                    });

                } else if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && API.isEmpty(msg.cctvName)) {//조회 기간만 있을떄
                    sqlQuery += "and (a.send_time between $1 and $2) ";

                    SQL.postgresSQL(sqlQuery, [msg.startDay, msg.endDay], [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        //console.log(data);
                    });

                } else {//조회만 누를때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        //console.log(data);
                    });
                }

            });


        }


    });


}