const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        //회원기초정보관리
        {

            var newData = false;//, searchMemData;
            var columns = ["user_id", "user_cd", "user_nm", "telephone", "email"]


            //회원정보 찾기(조회)
            socket.on('search_data', function (msg) {
                var sqlQuery = "SELECT * FROM tb_user_info ";

                if (msg) {//회원명일때
                    sqlQuery += "where user_cd = $1 or user_nm like '%'||$1||'%'";

                    SQL.postgresSQL(sqlQuery, [msg], [socket, 'search']).then(function (data) {
                        //console.log(data);
                    });

                } else {//아무것도 없을때
                    SQL.postgresSQL(sqlQuery, null, [socket, 'search']).then(function (data) {
                        //console.log(data);
                    });
                }


                newData = false;

            });

            //클릭한 회원 이미지 정보 출력
            socket.on('click_members_search', function (msg) {
                var sqlQuery = SQL.AuToQuerySQL("SELECT", "tb_user_info", columns)

                SQL.postgresSQL(sqlQuery, Object.values(msg), [socket, 'click_members']);

                newData = false;

            });


            //회원정보 저장(신규) 
            socket.on('save_data', function (msg) {

                newData = msg.new;

                //DB자동 count값 가져오기
                if (!msg.click) {
                    var sqlQuery = "SELECT max(user_id) FROM tb_user_info ";
                    SQL.postgresSQL(sqlQuery, null, [socket, 'search_count']);
                }

            });


            //회원정보 변경(저장)
            socket.on('update_data', function (msg) {
                var save = Object.values(msg.change);

                if (newData) {
                    //신규저장
                    var newColumns = columns.slice();
                    newColumns.unshift("marina_id");
                    newColumns.unshift("use_yn");
                    var sqlQuery = SQL.AuToQuerySQL("INSERT", "tb_user_info", newColumns)
                    save.unshift(1)
                    save.unshift('Y')
                    SQL.postgresSQL(sqlQuery, save);

                    //신규 이미지 저장
                    var sqlQuery = SQL.AuToQuerySQL("UPDATE", "tb_user_info", columns, ["picture"])

                    IMG.imageGetUpload(app, SQL, sqlQuery, [upload, '/img/post', 'image_Data_Param']);

                    // 신규 저장후 모두 출력
                    sqlQuery = "SELECT * FROM tb_user_info;";
                    SQL.postgresSQL(sqlQuery, null, [socket, 'search'])

                } else {
                    var sqlData = save.concat(Object.values(msg.search))
                    //회원수정
                    var sqlQuery = SQL.AuToQuerySQL("UPDATE", "tb_user_info", columns)
                    SQL.postgresSQL(sqlQuery, sqlData);

                    //회원 이미지 수정
                    var sqlQuery = SQL.AuToQuerySQL("UPDATE", "tb_user_info", columns, ["picture"])

                    IMG.imageGetUpload(app, SQL, sqlQuery, [upload, '/img/post', 'image_Data_Param']);

                    // 수정후 조회
                    var sqlQuery = SQL.AuToQuerySQL("SELECT", "tb_user_info", columns)

                    SQL.postgresSQL(sqlQuery, Object.values(msg.change), [socket, 'search']);
                }

                newData = false;
            });


            //회원정보 삭제(삭제)
            socket.on('delete_data', function (msg) {
                //회원삭제
                var sqlQuery = SQL.AuToQuerySQL("DELETE", "tb_user_info", columns)
                SQL.postgresSQL(sqlQuery, Object.values(msg));

                // 신규 저장후 모두 출력
                sqlQuery = "SELECT * FROM tb_user_info;";
                SQL.postgresSQL(sqlQuery, null, [socket, 'search'])

                newData = false;

            });


        }


        //출입내역
        {
            // 출입내역 조회
            socket.on('search_inout_data', function (msg) {
                var sqlQuery = "SELECT a.reg_date, b.dvc_nm, a.user_nm, c.detail_nm as status from tb_ate_hist a, tb_face_device b, tb_code_detail c ";
                sqlQuery += "where a.dvc_id = b.dvc_id and (a.status = c.detail_cd and c.group_cd = 'ATE_STATUS') ";

                if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && !API.isEmpty(msg.userName)) {//모든 정보가 있을때
                    sqlQuery += "and (a.reg_date between $1 and $2) ";
                    sqlQuery += "and (a.user_nm LIKE '%'||$3||'%' OR a.user_cd = $3 )";
                    SQL.postgresSQL(sqlQuery, Object.values(msg), [socket, 'search_inout']).then(function (data) {
                        //console.log(data);
                    });

                } else if (!API.isEmpty(msg.startDay) && !API.isEmpty(msg.endDay) && API.isEmpty(msg.userName)) {//조회 기간만 있을떄
                    sqlQuery += "and (a.reg_date between $1 and $2) ";

                    SQL.postgresSQL(sqlQuery, [msg.startDay, msg.endDay], [socket, 'search_inout']).then(function (data) {
                        //console.log(data);
                    });

                } else {//조회만 누를때
                    SQL.postgresSQL(sqlQuery, null, [socket, 'search_inout']).then(function (data) {
                        //console.log(data);
                    });
                }

                newData = false;

            });


        }


    });


}