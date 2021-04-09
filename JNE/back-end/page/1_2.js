const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        //정보관리
        const PAGE_NAME = '1_2_';
        const DBNAME = 'tb_boat';
        const COLUM = ['user_id','boat_nm', 'boat_status', 'boat_desc'];

        var newData = false;//, searchMemData;

        //찾기(조회)
        socket.on(PAGE_NAME + 'search_data', function (msg) {
            var sqlQuery  = "SELECT a.boat_id,b.user_nm, a.boat_nm, b.user_cd, c.detail_nm AS boat_status, a.boat_desc, a.user_id \n";
            	sqlQuery += "  FROM tb_boat a LEFT OUTER JOIN tb_user_info b ON a.user_id = b.user_id \n";
            	sqlQuery += "                 LEFT OUTER JOIN tb_code_detail c ON 'a.boat_status' = c.detail_cd AND c.group_cd = 'BOAT_STATUS' ";

            if (msg) {//문자
                sqlQuery += "and (a.boat_nm LIKE '%'||$1||'%');";

                SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME + 'search']).then(function (data) {
                    //console.log(data);
                });

            } else {//아무것도 없을때
                SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'search']).then(function (data) {
                    //console.log(data);
                });
            }

            newData = false;

        });


        //저장(신규) 
        socket.on(PAGE_NAME + 'save_data', function (msg) {
            newData = msg.new;

            //DB자동 count값 가져오기
            if (!msg.click) {
                var sqlQuery = "SELECT max(boat_id) FROM " + DBNAME;
                SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'search_count']);
            }
        });


        //변경 모달(회원코드)
        {
            socket.on(PAGE_NAME + 'user_search', function (msg) {
                var sqlQuery = "SELECT marina_id, user_id, user_cd, user_nm, telephone FROM public.tb_user_info";

                if (msg) {//문자
                    sqlQuery += "AND user_nm like '%'||$1||'%'";

                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME + 'user']).then(function (data) {
                        // console.log(data);
                    });

                } else {//아무것도 없을때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'user']).then(function (data) {
                        // console.log(data);
                    });
                }

            });

        }


        //변경,신규(저장)
        socket.on(PAGE_NAME + 'update_data', function (msg) {
            if (newData) {
                //신규저장
                var newColumns = COLUM.slice();
                var sqlData = SQL.AuToSQLData(newColumns, msg.save)

                newColumns.unshift("marina_id");
                sqlData.unshift(1);

                //회원수정
                var sqlQuery = SQL.AuToQuerySQL("INSERT", DBNAME, newColumns);
                SQL.postgresSQL(sqlQuery, sqlData);

                // 신규 저장후 모두 출력
                var sqlQuery = "SELECT a.boat_id,b.user_nm, a.boat_nm, b.user_cd, c.detail_nm AS boat_status, a.boat_desc,a.user_id FROM tb_boat a, tb_user_info b, tb_code_detail c ";
                sqlQuery += "WHERE a.user_id = b.user_id and a.boat_status = c.detail_cd and c.group_cd = 'BOAT_STATUS' ";
                SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'search']);

            } else {

                //회원수정
                var sqlData = SQL.AuToSQLData(COLUM, msg.save, msg.search);
                var sqlQuery = SQL.AuToQuerySQL("UPDATE", DBNAME, COLUM);
                SQL.postgresSQL(sqlQuery, sqlData);


                // var updateColum=['user_cd','boat_id']
                // var updateUser ={
                //     search:{user_cd: msg.search.user_cd,boat_id:msg.search.boat_id},
                //     save :{user_cd: msg.save.user_cd,boat_id:msg.save.boat_id}
                // }
                // var sqlData = SQL.AuToSQLData(updateColum, updateUser.save,updateUser.search);
                // var sqlQuery = SQL.AuToQuerySQL("UPDATE", 'tb_user_info',updateColum);
                // SQL.postgresSQL(sqlQuery, sqlData);

                // 수정후 조회
                var sqlQuery = "SELECT a.boat_id,b.user_nm, a.boat_nm, b.user_cd, c.detail_nm AS boat_status, a.boat_desc,a.user_id FROM tb_boat a, tb_user_info b, tb_code_detail c ";
                sqlQuery += "WHERE a.user_id = b.user_id and a.boat_status = c.detail_cd and c.group_cd = 'BOAT_STATUS' ";
                sqlQuery += "and (a.user_id,a.boat_nm,a.boat_status,a.boat_desc)=($1,$2,$3,$4);";

                var sqlData = SQL.AuToSQLData(COLUM, msg.save);

                SQL.postgresSQL(sqlQuery, sqlData, [socket, PAGE_NAME + 'search']);
            }


            newData = false;
        });


        //삭제(삭제)
        socket.on(PAGE_NAME + 'delete_data', function (msg) {
            var newColumns = COLUM.slice();
            newColumns.unshift("boat_id");
            var sqlData = SQL.AuToSQLData(newColumns, msg)


            //회원삭제
            var sqlQuery = SQL.AuToQuerySQL("DELETE", DBNAME, newColumns)
            SQL.postgresSQL(sqlQuery, sqlData);

            // 삭제후 모든 출력
            var sqlQuery = "SELECT a.boat_id,b.user_nm, a.boat_nm, b.user_cd, c.detail_nm AS boat_status, a.boat_desc, a.user_id FROM tb_boat a, tb_user_info b, tb_code_detail c ";
            sqlQuery += "WHERE a.user_id = b.user_id and a.boat_status = c.detail_cd and c.group_cd = 'BOAT_STATUS' ";
            SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME + 'search']);

            newData = false;

        });





    });


}