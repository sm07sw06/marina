const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        const PAGE_NAME = '4_1_';

        //관할마리나항만
        var sqlQuery = "SELECT marina_id, marina_nm FROM public.tb_marina;"
        SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'marina']);
        
        //실시간
        socket.on(PAGE_NAME+'updateData',function() {

            socket.emit(PAGE_NAME+'updateDefault');

            // 위험 보트
            var sqlQuery = "SELECT a.marina_id, a.boat_id, b.boat_nm, a.latitude, a.longitude, a.send_time FROM tb_sos_list a, tb_boat b "
            sqlQuery += "WHERE a.marina_id = 1 AND a.boat_id = b.boat_id AND (a.gradex > 60 or a.gradey > 60 ) ORDER by send_time DESC limit 1"
            SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'warning_boat']);


            // 입출항 보트
            var sqlQuery = "SELECT a.marina_id, a.boat_id, b.boat_nm, a.latitude, a.longitude, a.cctv_cd, a.photo, a.photo_base64, a.last_upd_tm "
            sqlQuery += "FROM tb_io_status a, tb_boat b WHERE a.marina_id = 1 AND a.boat_id = b.boat_id "
            SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'inOut_boat']).then(function (data) {
                // console.log(data);
            });


            // 전체 현황
            var sqlQuery = "SELECT a.marina_id, b.sectorarea_cd ,c.detail_nm as sectorarea_nm, count(*) as cnt FROM tb_anchor a,tb_anchor_sector b,tb_code_detail c "
            sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND b.sectorarea_cd = c.detail_cd AND c.group_cd = 'SECTORAREA' GROUP BY a.marina_id, b.sectorarea_cd, sectorarea_nm"
            SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'total']);


            // 보트정보
            var sqlQuery = "SELECT a.marina_id, b.sectorarea_cd ,c.detail_nm as sectorarea_nm, count(*) as cnt FROM tb_anchor a,tb_anchor_sector b,tb_code_detail c "
            sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND b.sectorarea_cd = c.detail_cd AND c.group_cd = 'SECTORAREA' GROUP BY a.marina_id, b.sectorarea_cd, sectorarea_nm"
            SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'about_boat']);

        });

        
    })
}