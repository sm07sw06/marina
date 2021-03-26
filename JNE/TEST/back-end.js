
const express = require('express');//express접근
const app = express();

app.use(express.static('./'));//정적파일

app.use(express.static('img'));//정적파일
const http = require('http').Server(app);//http접근
const io = require('socket.io')(http);//socket접근
const ip = require("ip");

const PORT = 3330;//포트번호

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/1_1.html');//html출력
});

//postgreSQL사용
const { Client } = require('pg');
const client = new Client({
    user: 'jne',
    host: 'localhost',
    database: 'test',
    password: 'jnesystech1234',
    port: 5432,
});
client.connect(err => {
    if (err) throw err;
    else {
        console.log("DB연결 성공");
    }
});

//이미지 사용할때 사용
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: './upload/' }) //dest : 저장 위치


/*이미지 업로드*/
var image = {
    files: null,
    path: null,
    imageUpload: function () {

        fs.readFile(files.path, function (err, data) {
            fs.writeFile(path, data, function (error) {
                if (error) {
                    throw error;
                } else {
                    fs.unlink(files.path, function (removeFileErr) {
                        if (removeFileErr) {
                            throw removeFileErr;
                        }
                    });
                }
            });
        });
        console.log(files, path)
    },

}


io.on('connection', function (socket) {
    console.log("접속");

    //회원기초정보관리
    {
        //회원정보 찾기(조회)
        socket.on('search_data', function (msg) {

            //회원코드 일때
            if (parseInt(msg)) {

                //DB 데이터 조회
                client.query("SELECT * FROM tb_user_info WHERE marina_id = $1;", [parseInt(msg)], (err, res) => {
                    var rows = res.rows;
                    rows.map(row => {
                        socket.emit('search', row);
                    });
                });

            } else {
                //DB 데이터 조회
                client.query("SELECT * FROM tb_user_info WHERE user_cd = $1;", [msg], (err, res) => {
                    var rows = res.rows;
                    rows.map(row => {
                        socket.emit('search', row);
                    });

                });
            }

        })

        //클릭한 회원정보
        socket.on('click_members_search', function (msg) {
            //console.log(msg)
            //DB 데이터 조회
            client.query("SELECT * FROM tb_user_info WHERE marina_id=$1 and user_cd=$2 and telephone=$3 and email=$4;", [msg.id, msg.name, msg.tel, msg.email], (err, res) => {
                var rows = res.rows;
                rows.map(row => {
                    //console.log(row)
                    socket.emit('click_members', row);
                });
            });


        })

        //회원정보 저장(신규)
        socket.on('save_data', function (msg) {


            //DB 데이터 저장
            client.query("INSERT INTO tb_user_info (marina_id, user_cd,telephone,email) VALUES ($1,$2,$3,$4);", [Number(msg.id), msg.name, msg.tel, msg.email]);

            //이미지 저장
            app.post('/img/post', upload.single('new_image'), (req, res) => {
                var msg = JSON.parse(req.body.new_image);
                console.log(msg)
                imgfilename = './upload/' + msg.id + '_' + msg.name + '_' + req.file.originalname;

                //console.log(req)


                image.imageUpload(path = imgfilename, files = req.file);


                client.query("UPDATE tb_user_info SET picture=$5 WHERE (marina_id=$1 and user_cd=$2 and telephone=$3 and email=$4);", [Number(msg.id), msg.name, msg.tel, msg.email, imgfilename]);
                //console.log(imgfilename);
                //console.log(id, name)

            });



        })

        //회원정보 변경(저장)
        socket.on('update_data', function (msg) {
            selectMember = msg.search
            sql = "UPDATE tb_user_info SET (marina_id,user_cd,telephone ,email )=($1,$2,$3,$4) \
                                                        WHERE (marina_id=$5 and user_cd=$6 and telephone=$7 and email=$8);"




            //DB 데이터 조회
            client.query("SELECT * FROM tb_user_info WHERE marina_id=$1 and user_cd=$2 and telephone=$3 and email=$4;", [selectMember.id, selectMember.name, selectMember.tel, selectMember.email], (err, res) => {

                /*
                var rows = res.rows;
                rows.map(row => {
                    //console.log(row.picture)
                    //console.log(row)
                    //이미지 저장
                    
                    app.post('/img/change', upload.single('update_image'), (req, res) => {

                        //기존 이미지 삭제
                        fs.unlink(row.picture, function (removeFileErr) {
                            if (removeFileErr) {
                                console.log(removeFileErr)
                            }
                        });

                        imgfilename = './upload/' + msg.id + '_' + msg.name + '_' + req.file.originalname;

                        imageUpload(req.file);

                        client.query("UPDATE tb_user_info SET picture=$5 WHERE (marina_id=$1 and user_cd=$2 and telephone=$3 and email=$4);", [selectMember.id, selectMember.name, selectMember.tel, selectMember.email, imgfilename])

                    });
                    
                    // socket.emit('click_members', row);

                });
                */

            });




            client.query(sql, [msg.id, msg.name, msg.tel, msg.email,
            selectMember.id, selectMember.name, selectMember.tel, selectMember.email])

        })


        //회원정보 삭제(삭제)
        socket.on('delete_data', function (msg) {
            console.log(msg)

            client.query("DELETE FROM tb_user_info WHERE (marina_id=$1 and user_cd=$2 and telephone=$3 and email=$4);", [msg.id, msg.name, msg.tel, msg.email])

        })
    }

    //출입내역 조회
    {
        socket.on('search_inout_data', function (msg) {

            //해당형식으로 변환
            //console.log((msg.startDay).replace(/\-/g,""),msg.endDay,msg.userName)
            //DB 데이터 조회
            client.query("SELECT * FROM tb_ate_hist WHERE (atte_time BETWEEN $1 AND $2) AND user_nm =$3;", [(msg.startDay).replace(/\-/g, ""), (msg.endDay).replace(/\-/g, ""), msg.userName], (err, res) => {
                var rows = res.rows;
                console.log(err, rows)
                rows.map(row => {
                    socket.emit('search_inout', row);
                });
            });

        })

    }



    //입출항 CCTV 확인
    {
        socket.on('search_gubun_data', function (msg) {

            //해당형식으로 변환
            console.log((msg.startDay).replace(/\-/g, ""), msg.endDay, msg.cctvName)
            //DB 데이터 조회
            client.query("SELECT * FROM tb_cctvdata WHERE (sendtime BETWEEN $1 AND $2) AND cctv_cd =$3;", [(msg.startDay).replace(/\-/g, ""), (msg.endDay).replace(/\-/g, ""), msg.cctvName], (err, res) => {
                var rows = res.rows;
                console.log(err, rows)
                rows.map(row => {
                    socket.emit('search_inout_gubun', row);
                });
            });

        })

    }



})


//서버 생성
http.listen(PORT, function () {
    console.log('listening on *:' + PORT);
    console.log('Open Browser : http://' + ip.address() + ':' + PORT + '/');
});
