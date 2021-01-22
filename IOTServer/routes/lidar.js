
var express = require('express');
var router = express.Router();

const logger = require('../config/winston');

const { Pool, clientpg } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "192.168.123.105",
  database: "postgres",
  password: "topadmin",
  port: "5432"
});



//Android APP에서 추가된 부분
router.get('/:sensor', function(req, res, next){	

	var DB = require('../public/myModules/db');
	// message를 DB에 반영하도록 modules 호출
	var db = new DB(); // 모듈에 전달인자 할당 
	//db.SetDB(message);
	
	logger.info('message:' + req.params.sensor);
	
	var obj=JSON.parse(req.params.sensor);  // MQTT에서 보내온 메세지
	
	for (var sKey in obj) {
		
		logger.info('sKey:' + sKey);
		
		if (obj.hasOwnProperty(sKey)) {
			
			var sData = obj[sKey].split(",");
			
			logger.info('sData:' + sData);
			
			db.InsertDBLidarData(sData);  
			// 정박지 단말기에서 보내온 신호 분석
			var LidarCheck = require('../public/myModules/lidarCheck');
			var lidarCheck = new LidarCheck(sData); 
			lidarCheck.getLidarCheck();				
		}    
	}

	res.send("OK");
		
});

module.exports = router;


/** {"lidarData":"F832E4878CBB,1,20,100,200,10,10,0,0,20210118160139,20,0,20,0,1,0,1,0,3|"} */
/*
http://192.168.123.166:3000/lidar/{"boatData":"20210106164615,Cordinatior,0013A20041B1B5E7,0000,100B,XBEE3,Highest,0013A20041BB95F7,aduino_0,0013A20041BB95F7,4B3A,100B,424C,04,R,23,13,04,04,$GPGGA,074615.00,101,,51,,0,00,99.99,,,,,,*67 , 123456789012345678901234567890123412345"}
*/
