
//이미지 사용할때 사용
const fs = require('fs');
const API = require('./API');

module.exports = {
    /**
     * 이미지 업로드
     * @param {*} files : 이미지 데이터 정보(필수)
     * @param {*} path : 저장 위치(필수)
     */
    imageUpload(files, path) {
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
    },

    /**
     * 
     * @param {*} app :  require('express')한 모든 데이터 정보(필수)
     * @param {*} SQL :  require('SQL')한 모든 데이터 정보(필수)
     * @param {*} sqlQuery : SQL쿼리문 입력
     * @param {*} post_get_need : app의 매개변수(Parameter) 데이터를 찾을 정보[multer의 저장위치, 서버 경로, 일치한 함수명]
     */
    imageGetUpload(app, SQL, sqlQuery = null, post_get_need = []) {
        //이미지 저장
        if (!API.isEmpty(post_get_need)) {
            app.post(post_get_need[1], post_get_need[0].single(post_get_need[2]), (req, res) => {
                // console.log(req) //문제시 확인해 볼것
                
                var msg = JSON.parse(req.body[post_get_need[2]]);
                var imgfilename = './upload/' + msg.user_id + '_' + msg.user_cd + '_'+msg.user_nm+ '_' + req.file.originalname;
                var param = Object.values(msg);
                
                param.unshift(imgfilename);
                SQL.postgresSQL(sqlQuery, param);
                this.imageUpload(req.file, imgfilename);

            });
        }
    },


}