const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {


        //출입내역
        {
            const PAGE_NAME='3_3_'
            // 출입내역 조회
            socket.on(PAGE_NAME+'search_gubun_data', function (msg) {
                var sqlQuery = "SELECT a.cctv_cd, a.send_time, a.boatinout, b.detail_nm as boatinout_nm, a.photo, a.photo_base64 FROM tb_cctvdata a, tb_code_detail b ";
                sqlQuery += "WHERE a.marina_id = 1 AND a.boatinout = b.detail_cd AND b.group_cd ='BOATINOUT' ";

                if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && !API.isEmpty(msg.cctvName)) {//모든 정보가 있을때
                    sqlQuery += "AND a.cctv_cd like '%'||$1||'%' ";
                    sqlQuery += "AND a.send_time between $2 and $3";
                    SQL.postgresSQL(sqlQuery, Object.values(msg), [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        //console.log(data);
                    });

                } else if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && API.isEmpty(msg.cctvName)) {//조회 기간만 있을떄
                    sqlQuery += "AND a.send_time between $2 and $3";

                    SQL.postgresSQL(sqlQuery, [msg.startDay, msg.endDay], [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        //console.log(data);
                    });

                } else if (!API.isEmpty(msg.cctvName)) {//이름 검색 할때
                    sqlQuery += "AND a.cctv_cd like '%'||$1||'%' ";

                    
                    SQL.postgresSQL(sqlQuery, [msg.cctvName], [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        //console.log(data);
                    });

                } else {//조회만 누를때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME+'search_inout_gubun']).then(function (data) {
                        //console.log(data);
                    });
                }

                newData = false;

            });


        }


    });


}