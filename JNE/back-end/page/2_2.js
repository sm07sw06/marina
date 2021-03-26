const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        {
            const PAGE_NAME1 = '2_2_1_';

            // 조회
            socket.on(PAGE_NAME1 + 'search_data', function (msg) {
                var sqlQuery = " SELECT a.marina_id, a.anchor_id,a.anchor_nm, a.sector_id, a.boat_id, c.boat_nm, a.anchor_status, b.sector_nm, b.sectorarea_cd,e.detail_nm as sectorarea_nm,d.detail_nm as anchor_status_nm "
                sqlQuery += "FROM public.tb_anchor a,tb_anchor_sector b, tb_boat c, tb_code_detail e, tb_code_detail d ";
                sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND a.boat_id = c.boat_id AND ";
                sqlQuery += "b.sectorarea_cd = e.detail_cd AND e.group_cd ='SECTORAREA' AND a.anchor_status = d.detail_cd AND d.group_cd ='ANCHOR_STATUS' ";

                if (Number(msg)) {//모든 정보가 있을때
                    sqlQuery += "AND (a.anchor_id =  $1 )";
                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data);
                    });

                } else if (msg) {
                    sqlQuery += "AND (a.anchor_nm like '%'||$1||'%' )";
                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data);
                    });
                } else {//조회만 누를때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data);
                    });
                }

            });

        }

        {
            const PAGE_NAME2 = '2_2_2_';

            var sqlQuery = "SELECT detail_cd, detail_nm FROM tb_code_detail WHERE group_cd ='SECTORAREA'"
            SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'searchlist']);

            // 조회
            socket.on(PAGE_NAME2 + 'search_data', function (msg) {
                var sqlQuery = "SELECT e.detail_nm as sectorarea_nm, a.marina_id, a.anchor_id,a.anchor_nm, b.sector_nm,d.detail_nm as anchor_status_nm, a.sector_id, a.boat_id, c.boat_nm, a.anchor_status, b.sectorarea_cd "
                sqlQuery += "FROM public.tb_anchor a,tb_anchor_sector b, tb_boat c, tb_code_detail e, tb_code_detail d ";
                sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND a.boat_id = c.boat_id AND ";
                sqlQuery += "b.sectorarea_cd = e.detail_cd AND e.group_cd ='SECTORAREA' AND a.anchor_status = d.detail_cd ";
                sqlQuery+="AND d.group_cd ='ANCHOR_STATUS' and b.sectorarea_cd = $1";



                SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME2 + 'search']).then(function (data) {
                    // console.log(data);
                });
            });

        }


    });


}