const API = require("./API")

//postgreSQL사용
const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: '192.168.123.105',
    database: 'postgres',
    password: 'topadmin',
    port: 5432,
});
client.connect(err => {
    if (err) throw err;
    else {
        console.log("DB연결 성공");
    }
});



module.exports = {

    /** 
     * DB저장
     *  @param sql : SQL 쿼리문 입력(필수)
     * @param params : 쿼리문에서 입력 받을 파라미터 입력
     * @param socketdata : 소켓으로 보낼데이터 입력 [소켓 기본값 : 필수, 주고받을 이벤트명]
    */
    postgresSQL(sql, params = null, socketdata = []) {
        console.log(sql, params)
        if (!API.isEmpty(params)) {
            return new Promise(resolve => (

                client.query(sql, params, (err, res) => {
                    if (!API.isEmpty(socketdata)) {
                        try {
                            
                            var rows = res.rows;
    
                            resolve(rows.map(row => {
                                socketdata[0].emit(socketdata[1], row);
                                return row
                            }));
                        } catch (error) {
                            
                        }

                    }

                })
            ));

        } else {
            return new Promise(resolve => (

                client.query(sql, (err, res) => {
                    if (!API.isEmpty(socketdata)) {
                        try {
                            
                            var rows = res.rows;
    
                            resolve(rows.map(row => {
                                socketdata[0].emit(socketdata[1], row);
                                return row
                            }));
                        } catch (error) {
                            
                        }

                    }

                })
            ));
        }

    },


    /** 
     * DB Query문 자동 생성
     *  @param query : Query문 종류 (필수 : INSERT, SELECT, UPDATE, DELETE)
     * @param DBname : DB이름 (필수)
     * @param columns : 컬럼 개수
     * @param columnsSearch : 찾을 컬럼 개수
    */
    AuToQuerySQL(query, DBname, columns = [], columnsSearch = []) {
        var sqlQuery;

        switch (query) {
            case "INSERT":
                sqlQuery = "INSERT INTO " + DBname

                if (!API.isEmpty(columns)) {
                    var data = '';
                    for (let i = 1; i <= columns.length; i++) {
                        if (i != columns.length)
                            data += "$" + String(i) + ",";
                        else
                            data += "$" + String(i);
                    }
                    sqlQuery += " (" + columns.toString() + ") VALUES (" + data + ")";
                } else {
                    sqlQuery = "3번째 파라미터(Columns) 값 필요"
                }

                return sqlQuery;


            case "SELECT":
                sqlQuery = "SELECT * FROM " + DBname

                if (!API.isEmpty(columns)) {
                    var data = '';
                    for (let i = 1; i <= columns.length; i++) {
                        if (i != columns.length)
                            data += "$" + String(i) + ",";
                        else
                            data += "$" + String(i);
                    }
                    sqlQuery += " WHERE (" + columns.toString() + ")=(" + data + ")";
                }

                return sqlQuery;


            case "UPDATE":
                sqlQuery = "UPDATE " + DBname

                if (!API.isEmpty(columns) && columnsSearch.length == 1) {
                    var data = '';
                    sqlQuery += " SET " + columnsSearch.toString() + "=$1";

                    for (let j = 2; j <= columns.length + 1; j++) {
                        if (j != columns.length + 1)
                            data += "$" + String(j) + ",";
                        else
                            data += "$" + String(j);
                    }

                    sqlQuery += " WHERE (" + columns.toString() + ")=(" + data + ")";

                } else if (!API.isEmpty(columns) && API.isEmpty(columnsSearch) && columns.length == 1) {
                    sqlQuery += " SET " + columns.toString() + "=$1";
                    sqlQuery += " WHERE " + columns.toString() + "=$2";

                } else if (!API.isEmpty(columns) && !API.isEmpty(columnsSearch)) {
                    var data = '';
                    let i = 1;
                    for (; i <= columnsSearch.length; i++) {
                        if (i != columnsSearch.length)
                            data += "$" + String(i) + ",";
                        else
                            data += "$" + String(i);
                    }

                    sqlQuery += " SET (" + columnsSearch.toString() + ")=(" + data + ")";

                    data = ''
                    for (let j = 1; j <= columns.length; j++, i++) {
                        if (j != columns.length)
                            data += "$" + String(i) + ",";
                        else
                            data += "$" + String(i);
                    }

                    sqlQuery += " WHERE (" + columns.toString() + ")=(" + data + ")";

                } else if (!API.isEmpty(columns) && API.isEmpty(columnsSearch)) {
                    var data = '';
                    let i = 1;
                    for (; i <= columns.length; i++) {
                        if (i != columns.length)
                            data += "$" + String(i) + ",";
                        else
                            data += "$" + String(i);
                    }

                    sqlQuery += " SET (" + columns.toString() + ")=(" + data + ")";

                    data = ''
                    for (let j = 1; j <= columns.length; j++, i++) {
                        if (j != columns.length)
                            data += "$" + String(i) + ",";
                        else
                            data += "$" + String(i);
                    }

                    sqlQuery += " WHERE (" + columns.toString() + ")=(" + data + ")";

                } else {
                    sqlQuery = "3번째 파라미터(Columns, Search Columns) 값 필요"
                }

                return sqlQuery;


            case "DELETE":
                sqlQuery = "DELETE FROM " + DBname

                if (!API.isEmpty(columns)) {
                    var data = '';
                    for (let i = 1; i <= columns.length; i++) {
                        if (i != columns.length)
                            data += "$" + String(i) + ",";
                        else
                            data += "$" + String(i);
                    }
                    sqlQuery += " WHERE (" + columns.toString() + ")=(" + data + ")";
                } else {
                    sqlQuery = "3번째 파라미터(Columns) 값 필요"
                }

                return sqlQuery;
            default:
                break;
        }
    },


    /** 
     * DB UPDATE문 자동 파라미터 생성
     *  @param Colums : 컬럼수 (필수 : 무조건 배열)
     * @param save : 변경할 데이터 값 (필수 : Object)
     * @param search : 찾을 컬럼 개수
    */
    AuToSQLData(Colums, save = {}, search = {}) {
        var sqlData = [];
        if (Colums.length <= Object.keys(save).length) {
            for (let index = 0; index < Object.keys(save).length; index++) {
                if (Colums[index]) {
                    sqlData.push(save[Colums[index]])
                }
            }
        }else if(Colums.length > Object.keys(save).length) {
            for (let index = 0; index < Colums.length; index++) {
                if (save[Colums[index]]) {
                    sqlData.push(save[Colums[index]])
                }
            }
        }

        if (Colums.length <= Object.keys(search).length) {
            for (let index = 0; index < Object.keys(search).length; index++) {
                if (Colums[index]) {
                    sqlData.push(search[Colums[index]])
                }
            }
        }else if(Colums.length > Object.keys(search).length) {
            for (let index = 0; index < Colums.length; index++) {
                if (search[Colums[index]]) {
                    sqlData.push(search[Colums[index]])
                }
            }
        }
        
        return sqlData;
    },


}