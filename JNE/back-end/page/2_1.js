const API = require('../API');
const IMG = require('../IMAGE');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치

module.exports = function (app, io, SQL) {
    io.on('connection', function (socket) {

        //계류지 구역 관리
        {
            const PAGE_NAME1 = '2_1_1_';
            const DBNAME = 'tb_anchor_sector';
            const COLUM = ['sector_nm', 'sector_desc', 'gpsx1', 'gpsx2', 'gpsy1', 'gpsy2', 'sectorarea_cd'];

            var newData = false;//, searchMemData;

            //찾기(조회)
            socket.on(PAGE_NAME1 + 'search_data', function (msg) {
                var sqlQuery = "SELECT a.marina_id, a.sector_id, a.sector_nm, a.sectorarea_cd,b.detail_nm as sectorarea_nm , a.sector_desc, a.gpsx1, a.gpsy1, a.gpsx2, a.gpsy2 FROM public.tb_anchor_sector a, tb_code_detail b "
                sqlQuery += "WHERE a.sectorarea_cd = b.detail_cd AND b.group_cd ='SECTORAREA' ";

                if (Number(msg)) {
                    sqlQuery += "AND a.sector_id = $1";

                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data);
                    });

                } else if (msg) {//문자
                    sqlQuery += "AND a.sector_nm like '%'||$1||'%'";

                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data);
                    });

                } else {//아무것도 없을때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME1 + 'search']).then(function (data) {
                        //console.log(data);
                    });
                }

                newData = false;

            });


            //저장(신규) 
            socket.on(PAGE_NAME1 + 'save_data', function (msg) {
                newData = msg.new;

                //DB자동 count값 가져오기
                if (!msg.click) {
                    var sqlQuery = "SELECT max(sector_id) FROM " + DBNAME;
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME1 + 'search_count']);
                }

            });


            //변경,신규(저장)
            socket.on(PAGE_NAME1 + 'update_data', function (msg) {
                var newColumns = COLUM.slice();

                if (newData) {
                    var sqlData = SQL.AuToSQLData(newColumns, msg.save);

                    newColumns.unshift("marina_id");
                    sqlData.unshift(1);

                    //신규저장
                    var sqlQuery = SQL.AuToQuerySQL("INSERT", DBNAME, newColumns);


                    SQL.postgresSQL(sqlQuery, sqlData);

                    // 신규 저장후 모두 출력
                    var sqlQuery = "SELECT a.marina_id, a.sector_id, a.sector_nm, a.sectorarea_cd,b.detail_nm as sectorarea_nm , a.sector_desc, a.gpsx1, a.gpsy1, a.gpsx2, a.gpsy2 FROM public.tb_anchor_sector a, tb_code_detail b "
                    sqlQuery += "WHERE a.sectorarea_cd = b.detail_cd AND b.group_cd ='SECTORAREA' ";
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME1 + 'search'])

                } else {
                    var sqlData = SQL.AuToSQLData(newColumns, msg.save, msg.search);

                    //신규저장
                    var sqlQuery = SQL.AuToQuerySQL("UPDATE", DBNAME, newColumns);

                    SQL.postgresSQL(sqlQuery, sqlData);

                    // 신규 저장후 모두 출력
                    var sqlQuery = "SELECT a.marina_id, a.sector_id, a.sector_nm, a.sectorarea_cd,b.detail_nm as sectorarea_nm , a.sector_desc, a.gpsx1, a.gpsy1, a.gpsx2, a.gpsy2 FROM public.tb_anchor_sector a, tb_code_detail b "
                    sqlQuery += "WHERE a.sectorarea_cd = b.detail_cd AND b.group_cd ='SECTORAREA' ";
                    sqlQuery += 'and (sector_nm,gpsx1,gpsx2,gpsy1,gpsy2,sector_desc,sector_id,sectorarea_cd) = ($1,$2,$3,$4,$5,$6,$7,$8)';
                    SQL.postgresSQL(sqlQuery, Object.values(msg.save), [socket, PAGE_NAME1 + 'search'])
                }

                newData = false;
            });


            //삭제(삭제)
            socket.on(PAGE_NAME1 + 'delete_data', function (msg) {

                //회원삭제
                var sqlQuery = SQL.AuToQuerySQL("DELETE", DBNAME, Object.keys(msg));

                SQL.postgresSQL(sqlQuery, Object.values(msg));

                // 신규 저장후 모두 출력
                var sqlQuery = "SELECT a.marina_id, a.sector_id, a.sector_nm, a.sectorarea_cd,b.detail_nm as sectorarea_nm , a.sector_desc, a.gpsx1, a.gpsy1, a.gpsx2, a.gpsy2 FROM public.tb_anchor_sector a, tb_code_detail b "
                sqlQuery += "WHERE a.sectorarea_cd = b.detail_cd AND b.group_cd ='SECTORAREA' ";
                SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME1 + 'search'])

                newData = false;

            });

        }


        //계류지 정보관리
        {
            const PAGE_NAME2 = '2_1_2_';
            const DBNAME2 = 'tb_anchor';
            const COLUM2 = ['anchor_id', 'anchor_nm', 'sector_id', 'boat_id', 'anchor_status'];
            var newData = false;//, searchMemData;

            //찾기(조회)
            socket.on(PAGE_NAME2 + 'search_data', function (msg) {
                var sqlQuery = "SELECT a.marina_id, a.anchor_id,a.anchor_nm, a.sector_id, a.boat_id, c.boat_nm, a.anchor_status, b.sector_nm, b.sectorarea_cd,e.detail_nm as sectorarea_nm,d.detail_nm as anchor_status_nm "
                sqlQuery += "FROM  tb_anchor_sector b, tb_anchor a left outer join tb_boat c on a.boat_id = c.boat_id , tb_code_detail e, tb_code_detail d ";
                sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND b.sectorarea_cd = e.detail_cd AND e.group_cd ='SECTORAREA' AND a.anchor_status = d.detail_cd AND d.group_cd ='ANCHOR_STATUS' "

                if (Number(msg)) {
                    sqlQuery += "AND a.anchor_id = $1";

                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME2 + 'search']).then(function (data) {
                        // console.log(data);
                    });

                } else if (msg) {//문자
                    sqlQuery += "AND a.anchor_nm like '%'||$1||'%'";

                    SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME2 + 'search']).then(function (data) {
                        // console.log(data);
                    });

                } else {//아무것도 없을때
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'search']).then(function (data) {
                        // console.log(data);
                    });
                }

                newData = false;

            });


            //저장(신규) 
            socket.on(PAGE_NAME2 + 'save_data', function (msg) {
                newData = msg.new;

                //DB자동 count값 가져오기
                if (!msg.click) {
                    var sqlQuery = "SELECT max(anchor_id) FROM " + DBNAME2;
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'search_count']);
                }

            });

            {
                //변경 모달(구역명)
                socket.on(PAGE_NAME2 + 'area_search', function (msg) {
                    var sqlQuery = "SELECT a.marina_id, a.sector_id, a.sector_nm, b.detail_nm as sectorarea_nm "
                    sqlQuery += "FROM public.tb_anchor_sector a, tb_code_detail b WHERE a.sectorarea_cd = b.detail_cd AND b.group_cd ='SECTORAREA'";

                    if (msg) {//문자
                        sqlQuery += "AND a.sector_nm like '%'||$1||'%'";

                        SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME2 + 'area']).then(function (data) {
                            // console.log(data);
                        });

                    } else {//아무것도 없을때
                        SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'area']).then(function (data) {
                            // console.log(data);
                        });
                    }

                });



                //변경 모달(보트명)
                socket.on(PAGE_NAME2 + 'boat_search', function (msg) {
                    var sqlQuery = "select a.boat_id, a.boat_nm, b.user_nm "
                    sqlQuery += "from tb_boat a, tb_user_info b where a.user_id = b.user_id ";

                    if (msg) {//문자
                        sqlQuery += "AND a.boat_nm like '%'||$1||'%'";

                        SQL.postgresSQL(sqlQuery, [msg], [socket, PAGE_NAME2 + 'boat']).then(function (data) {
                            // console.log(data);
                        });

                    } else {//아무것도 없을때
                        SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'boat']).then(function (data) {
                            // console.log(data);
                        });
                    }

                });
            }


            //변경,신규(저장)
            socket.on(PAGE_NAME2 + 'update_data', function (msg) {
                var newColumns = COLUM2.slice();

                if (newData) {
                    var sqlData = SQL.AuToSQLData(newColumns, msg.save);

                    newColumns.unshift("marina_id");
                    sqlData.unshift(1);

                    //신규저장
                    var sqlQuery = SQL.AuToQuerySQL("INSERT", DBNAME2, newColumns);


                    SQL.postgresSQL(sqlQuery, sqlData);

                    // 신규 저장후 모두 출력
                    var sqlQuery = "SELECT a.marina_id, a.anchor_id,a.anchor_nm, a.sector_id, a.boat_id, c.boat_nm, a.anchor_status, b.sector_nm, b.sectorarea_cd,e.detail_nm as sectorarea_nm,d.detail_nm as anchor_status_nm "
                    sqlQuery += "FROM  tb_anchor_sector b, tb_anchor a left outer join tb_boat c on a.boat_id = c.boat_id , tb_code_detail e, tb_code_detail d ";
                    sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND b.sectorarea_cd = e.detail_cd AND e.group_cd ='SECTORAREA' AND a.anchor_status = d.detail_cd AND d.group_cd ='ANCHOR_STATUS' "
                    SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'search'])

                } else {
                    var sqlData = SQL.AuToSQLData(COLUM2, msg.save, msg.search);

                    //변경 
                    var sqlQuery = SQL.AuToQuerySQL("UPDATE", DBNAME2, COLUM2);

                    SQL.postgresSQL(sqlQuery, sqlData);

                    // 변경후 저장 모두 출력
                    var sqlQuery = "SELECT a.marina_id, a.anchor_id,a.anchor_nm, a.sector_id, a.boat_id, c.boat_nm, a.anchor_status, b.sector_nm, b.sectorarea_cd,e.detail_nm as sectorarea_nm,d.detail_nm as anchor_status_nm "
                    sqlQuery += "FROM  tb_anchor_sector b, tb_anchor a left outer join tb_boat c on a.boat_id = c.boat_id , tb_code_detail e, tb_code_detail d ";
                    sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND b.sectorarea_cd = e.detail_cd AND e.group_cd ='SECTORAREA' AND a.anchor_status = d.detail_cd AND d.group_cd ='ANCHOR_STATUS' "
                    sqlQuery += "AND (a.anchor_id,a.anchor_nm,a.sector_id,a.boat_id,a.anchor_status)=($1,$2,$3,$4,$5)"

                    var sqlData = SQL.AuToSQLData(COLUM2, msg.save);
                    
                    SQL.postgresSQL(sqlQuery, sqlData, [socket, PAGE_NAME2 + 'search'])
                }

                newData = false;
            });


            //삭제(삭제)
            socket.on(PAGE_NAME2 + 'delete_data', function (msg) {
                var newColumns = COLUM2.slice();
                newColumns.splice(newColumns.indexOf("sector_id"), 1);
                newColumns.splice(newColumns.indexOf("boat_id"), 1);

                
                //회원삭제
                var sqlData = SQL.AuToSQLData(newColumns, msg);
                var sqlQuery = SQL.AuToQuerySQL("DELETE", DBNAME2,newColumns);
                
                SQL.postgresSQL(sqlQuery, sqlData);

                // 신규 저장후 모두 출력
                var sqlQuery = "SELECT a.marina_id, a.anchor_id,a.anchor_nm, a.sector_id, a.boat_id, c.boat_nm, a.anchor_status, b.sector_nm, b.sectorarea_cd,e.detail_nm as sectorarea_nm,d.detail_nm as anchor_status_nm "
                    sqlQuery += "FROM  tb_anchor_sector b, tb_anchor a left outer join tb_boat c on a.boat_id = c.boat_id , tb_code_detail e, tb_code_detail d ";
                    sqlQuery += "WHERE a.marina_id = b.marina_id AND a.sector_id = b.sector_id AND b.sectorarea_cd = e.detail_cd AND e.group_cd ='SECTORAREA' AND a.anchor_status = d.detail_cd AND d.group_cd ='ANCHOR_STATUS' "
                SQL.postgresSQL(sqlQuery, null, [socket, PAGE_NAME2 + 'search'])

                newData = false;

            });

        }

    });


}