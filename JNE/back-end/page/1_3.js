const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        //장치 관리 tb_boat_device
        {
            const PAGE_NAME1 = '1_3_1_';
            const COLUM = ["boat_id", "boat_nm", "machine_id"];
            const DBNAME = "tb_boat_device";

            // var newData = false;

            //장치 관리 찾기(조회)
            socket.on(PAGE_NAME1 + 'search_data', function (msg) {
                var sqlQuery = "SELECT a.boat_id, a.boat_nm, COALESCE(b.machine_id,'') as machine_id  FROM tb_boat a ";
                sqlQuery += "left outer join tb_boat_device b on a.marina_id = b.marina_id AND a.boat_id = b.boat_id ";
                sqlQuery += "WHERE (a.marina_id = 1) ";
                var param = msg.searchData;

                if (param) {//설비명 일때
                    sqlQuery += "AND (a.boat_nm LIKE '%'||$1||'%');";

                    SQL.postgresSQL(sqlQuery, [param], [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });
                } else {//아무것도 없을때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });
                }

                // newData = false;
            });


            // //장치 관리 저장(신규) 
            // socket.on(PAGE_NAME1 + 'save_data', function (msg) {
            //     //newData = msg;
            // });



            //장치 관리 변경(저장)
            socket.on(PAGE_NAME1 + 'update_data', function (msg) {
                var newColumns = COLUM.slice();
                newColumns.splice(newColumns.indexOf("boat_nm"), 1);
                
                // if (//newData && msg.search.machine_id == 'null') { //신규 버튼 누를때
                if (API.isEmpty(msg.search.machine_id)) {
                    
                    //신규저장
                    var sqlData = SQL.AuToSQLData(newColumns, msg.save)

                    newColumns.unshift("marina_id");
                    sqlData.unshift(1);

                    var sqlQuery = SQL.AuToQuerySQL("INSERT", DBNAME, newColumns);
                    SQL.postgresSQL(sqlQuery, sqlData);
                    
                    // 신규 저장후 출력
                    var sqlData = SQL.AuToSQLData(COLUM, msg.save)
                    var sqlQuery = "SELECT a.boat_id, a.boat_nm, COALESCE(b.machine_id,'') as machine_id  FROM tb_boat a ";
                    sqlQuery += "left outer join tb_boat_device b on a.marina_id = b.marina_id AND a.boat_id = b.boat_id ";
                    sqlQuery += "WHERE (a.marina_id = 1) and (b.boat_id=$1 and a.boat_nm=$2 and b.machine_id=$3)";
                    SQL.postgresSQL(sqlQuery, sqlData, [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });

                } else {
                    newColumns.unshift("marina_id");
                    msg.save.marina_id = 1;
                    msg.search.marina_id = 1;

                    var sqlData = SQL.AuToSQLData(newColumns, msg.save, msg.search)
                    var sqlQuery = SQL.AuToQuerySQL("UPDATE", DBNAME, newColumns);
                    SQL.postgresSQL(sqlQuery, sqlData);

                    // 변경 저장후 출력
                    var sqlQuery = "SELECT a.boat_id, a.boat_nm, b.machine_id  FROM tb_boat a ";
                    sqlQuery += "left outer join tb_boat_device b on a.marina_id = b.marina_id AND a.boat_id = b.boat_id ";
                    sqlQuery += "WHERE (a.marina_id = 1) and (a.boat_nm=$1 and b.machine_id=$2 and b.boat_id=$3 and b.marina_id=$4)";

                    SQL.postgresSQL(sqlQuery, Object.values(msg.save), [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });
                }

                //newData = false;
            });



            //장치 관리 삭제(삭제)
            socket.on(PAGE_NAME1 + 'delete_data', function (msg) {
                var newColumns = COLUM.slice();
                newColumns.splice(newColumns.indexOf("boat_nm"), 1);
                
                //회원삭제
                var sqlData = SQL.AuToSQLData(newColumns, msg)
                var sqlQuery = SQL.AuToQuerySQL("DELETE", DBNAME, newColumns)
                SQL.postgresSQL(sqlQuery, sqlData);

                // 삭제후 전체 출력
                var sqlQuery = "SELECT a.boat_id, a.boat_nm, b.machine_id  FROM tb_boat a ";
                sqlQuery += "left outer join tb_boat_device b on a.marina_id = b.marina_id AND a.boat_id = b.boat_id ";
                sqlQuery += "WHERE (a.marina_id = 1) ";
                SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME1 + 'search']).then(function (data) {
                    //console.log(data[0]);
                });

            });

        }


        //장치 관리 tb_anchor_lidar
        {
            const PAGE_NAME2 = '1_3_2_';
            const COLUM = ["anchor_id", "anchor_nm", "machine_id", "left_right", "marina_id"];
            const DBNAME = "tb_anchor_lidar";
            

            // var //newData = false;

            //장치 관리 찾기(조회)
            socket.on(PAGE_NAME2 + 'search_data', function (msg) {
                var sqlQuery = "SELECT a.anchor_id, a.marina_id,   a.anchor_nm, COALESCE(b.machine_id,'') as machine_id, COALESCE(b.left_right,'') as left_right FROM tb_anchor a ";
                sqlQuery += "left outer join tb_anchor_lidar b on a.marina_id = b.marina_id AND a.anchor_id = b.anchor_id ";
                sqlQuery += "WHERE a.marina_id = 1 ";

                if (msg) {//설비명 일때
                    sqlQuery += "AND (a.anchor_nm like '%'||$1||'%');";

                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME2 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });
                } else {//아무것도 없을때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });
                }

                //newData = false;
            });


            //장치 관리 저장(신규) 
            socket.on(PAGE_NAME2 + 'save_data', function (msg) {
                //newData = msg;
            });



            //장치 관리 변경(저장)
            socket.on(PAGE_NAME2 + 'update_data', function (msg) {
                var newColumns = COLUM.slice();
                // newColumns.splice(newColumns.indexOf("anchor_nm"), 1);
                // if (//newData && msg.search.machine_id == 'null') { //신규버튼 누를때
                if (msg.search.machine_id == 'null') {

                    //신규저장
                    var sqlData = SQL.AuToSQLData(COLUM, msg.save)
                    var sqlQuery = SQL.AuToQuerySQL("INSERT", DBNAME, COLUM);

                    SQL.postgresSQL(sqlQuery, sqlData);

                    // 신규 저장후 출력
                    var sqlQuery = "SELECT  a.anchor_id, a.marina_id,   a.anchor_nm, COALESCE(b.machine_id,'') as machine_id, COALESCE(b.left_right,'') as left_right FROM tb_anchor a ";
                    sqlQuery += "left outer join tb_anchor_lidar b on a.marina_id = b.marina_id AND a.anchor_id = b.anchor_id ";
                    sqlQuery += "WHERE a.marina_id = $1 and b.machine_id=$2 and b.left_right=$3 and a.anchor_id=$4";
                    SQL.postgresSQL(sqlQuery, sqlData, [socket, PAGE_NAME2 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });

                } else {
                    
                    var sqlData = SQL.AuToSQLData(COLUM, msg.save, msg.search)

                    var sqlQuery = SQL.AuToQuerySQL("UPDATE", DBNAME, COLUM);
                    SQL.postgresSQL(sqlQuery, sqlData);

                    var sqlData = SQL.AuToSQLData(COLUM, msg.save)

                    // 신규 저장후 출력
                    var sqlQuery = "SELECT a.anchor_id, a.marina_id, a.anchor_nm, b.machine_id, b.left_right FROM tb_anchor a ";
                    sqlQuery += "left outer join tb_anchor_lidar b on a.marina_id = b.marina_id AND a.anchor_id = b.anchor_id ";
                    sqlQuery += "WHERE a.marina_id = $1 and b.machine_id=$2 and b.left_right=$3 and a.anchor_id=$4";
                    SQL.postgresSQL(sqlQuery, sqlData, [socket, PAGE_NAME2 + 'search']).then(function (data) {
                        //console.log(data[0]);
                    });
                }

                //newData = false;
            });



            //장치 관리 삭제(삭제)
            socket.on(PAGE_NAME2 + 'delete_data', function (msg) {
                //회원삭제
                var sqlData = SQL.AuToSQLData(COLUM, msg)

                var sqlQuery = SQL.AuToQuerySQL("DELETE", DBNAME, COLUM)
                SQL.postgresSQL(sqlQuery, sqlData);

                var sqlQuery = "SELECT a.anchor_id, a.marina_id, a.anchor_nm, b.machine_id, b.left_right FROM tb_anchor a ";
                sqlQuery += "left outer join tb_anchor_lidar b on a.marina_id = b.marina_id AND a.anchor_id = b.anchor_id ";
                sqlQuery += "WHERE a.marina_id = 1 ";
                SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'search']).then(function (data) {
                    //console.log(data[0]);
                });
            });

        }



    });


}