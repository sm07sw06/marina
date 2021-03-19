var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var multer  = require('multer'); 
var async   = require('async');
var moment  = require('moment');
var DB      = require('../public/myModules/db');
var fetch   = require("fetch");
var FileReader = require('filereader');
var fapi 	= require('file-api');
var reader 	= new FileReader();
var File = fapi.File;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();


const logger = require('../config/winston');

var app = express();

var dir = './uploadedFiles'; 
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir); 
}

var storage  = multer.diskStorage({  
	destination(req, file, cb) {
		cb(null, 'uploadedFiles/');
	},
	filename(req, file, cb) {
		cb(null, `${Date.now()}__${file.originalname}`);
	},
});
var upload = multer({ storage: storage }); 

function MessageObject()
{ 
    var marinaId;   //마리나 ID      
    var machineId;  //보트단말기 ID     
    var sendTime;   // 전송일시     
    var boatId;  //보트 ID     
    var lidarId;   // 정박지단말기 ID  
    var leftRight;  // 좌우구분   좌우구분 (0:좌, 1:우)
    var boatInout;  // 입출항구분  
    var gradex;  // MQTT에서 전달 받은 GPS 위도 
    var gradey;  // MQTT에서 전달 받은 GPS 경도
    var latitude;   // 위도
    var longitude;  // 경도
    var cctv_cd  ;  // cctv
    var photo_base64; //전송이미지 텍스트
    var last_upd_tm;  //최종수정시각
    var temperature;
    var humidity   ;
}

var mObject  = new MessageObject(); //메세지 구조체

function toDataURL(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var reader = new FileReader();
		reader.onloadend = function() {
			callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
	};
	console.log("url : " + url); //form files
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}

function encodeImageFileAsURL(element) {
	var file = element;
	var reader = new FileReader();
	reader.onloadend = function() {
		console.log('RESULT', reader.result)
	}
	reader.readAsDataURL(file);
}

router.post('/uploadFile', upload.single('attachment'), function(req,res){
//	console.log(req.body);

   if (req.file) {
	      console.log("originalname   : " + req.file.originalname); //form files
	      console.log("file path      : " + req.file.destination); //form files
	      console.log("file full name : " + req.file.path); //form files
	      console.log("file filename  : " + req.file.filename); //form files
	      console.log("file size      : " + req.file.size); //form files

	      console.log("fileaaaaa : " + "../bin/"+req.file.path); //form files
	      
//			toDataURL("https://t1.daumcdn.net/b2/creative/261423/d22ae8fe17e60810bb30d7e6dda3bd9c.png", function(dataUrl) {
//			  console.log('RESULT:', dataUrl);
//			});

			encodeImageFileAsURL(new File("../bin/uploadedFiles/1111111.png"));			
	      
			
			//new File("../bin/uploadedFiles\1616144154786__20200324_111007.png")
			
	      mObject.marinaId 	    =  1;					// 마리나 ID      
	      mObject.cctv_cd   	=  req.body.cameraId;	// cctv
	      mObject.sendTime  	=  req.body.sendtime;	// 전송일시     
	      mObject.boatinout 	=  req.body.boatinout;	// 입출항구분 (1:입항 0:출항)     
	      mObject.boatinout 	= "1";
	      mObject.photo_base64 	= "" ;
	      /***
	      var db = new DB(); 	  
	      
          logger.info('!! CCTV 데이터 수집중...'); 
          db.CCtvReceive(mObject, function(rtn){
              if (rtn === 'OK') {
                  logger.info('CCTV 데이터 수집 성공');  
              } else {
                  logger.info('CCTV 데이터 수집 실패'); 
              }   
          });         
	      ***/
	 	 /*
	      res.render('profile', {
	         title: 'success',
	         imagename1: img_name1,
	         imagename2: img_name2
	      });
	      */
	      
	      res.render('confirmation', { file:req.file.originalname });      
   }
 
   res.status(204).end(); 
		   
});

module.exports = router;


/**

var form = new FormData();
form.append("attachment", "C:\\Users\\dhlee\\Pictures\\APR2020_1920x1080.png");
form.append("cameraId", "1234567890");
form.append("sendtime", "20210128101010");

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:3000/uploadfile",
  "method": "POST",
  "headers": {
    "cache-control": "no-cache",
    "Postman-Token": "7e64c887-12a6-4637-9c5b-b532a850c553"
  },
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": form
}

$.ajax(settings).done(function (response) {
  console.log(response);
});




var fs = require("fs");
var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:3100/uploadfile',
  headers: 
   { 'Postman-Token': 'a3274671-f7a8-4ce8-a7f5-8ab625bac0f7',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { attachment: 
      { value: 'fs.createReadStream("C:\\Users\\dhlee\\Pictures\\APR2020_1920x1080.png")',
        options: 
         { filename: 'C:\\Users\\dhlee\\Pictures\\APR2020_1920x1080.png',
           contentType: null } },
     cameraId: '1234567890',
     sendtime: '20210128101010' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});


**/
