/*jshint esversion: 6 */
/*
 * 보트 출입 인식
 */

var async = require('async');
var moment = require('moment');
var DB = require('./db');

const logger = require('../../config/winston');

var gpsX1;   // GPS 좌표 X1
var gpsX2;   // GPS 좌표 X2
var gpsY1;   // GPS 좌표 Y1
var gpsY2;   // GPS 좌표 Y2

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
	var machineNm;  //보트단말기명
    var x;   // 삼각측정 좌표 X
    var y;   // 삼각측정 좌표 Y
}
var mObject  = new MessageObject(); //메세지 구조체
var mObject2 = new MessageObject(); //메세지 구조체


function AnchorCheck(message) {
	this.message = message;
}

function  setDashBoard() {
    
	logger.info('Start setDashBoard........');

};

AnchorCheck.prototype.getAnchorCheck = function() {
    
	logger.info('Start getAnchorCheck........');

    var db = new DB(); 
    
	var sData = this.message;  // MQTT에서 보내온 메세지
	var sId          = sData[0];
	var nTemperature = sData[1];
	var nHumidity    = sData[2];
	var nDistance    = sData[3];
	var sStime       = sData[4];
	

	logger.info("  sId:"+sId);
	logger.info("  sStime:"+sStime);   
	logger.info("  nDistance:"+nDistance);   

	if(nDistance === "") { nDistance = 0; }
	
	
	mObject.boatId   = "";
	mObject.anchorId = "";
	
	mObject2.machineId = "";
	mObject2.boatId = "";
	mObject2.anchorId = "";
	
	db.InsertDBAnchorData(sData);  
	
	if (nDistance  < 100 ) { //거리가 100mm 이하이면 정박 상태
		logger.info("boat is anchored !!");
	    mObject.id   = sId;
	    mObject.time = sStime;		
	    mObject.leftRight = 0;		

	    db.GetAnchorBoatDataSearch(mObject, function(mObject2){ 
			
			if(mObject.boatId) {
				logger.info("GetAnchorBoatDataSearch machineId:" + mObject2.machineId);
				logger.info("GetAnchorBoatDataSearch boatId   :" + mObject2.boatId);
				logger.info("GetAnchorBoatDataSearch anchorId :" + mObject2.anchorId);
				// 보트 정박 처리
				db.SetBoatAnchor(mObject2, function(rtn){ 
					logger.info("SetBoatAnchor result:" + rtn);
			    	// 대쉬보드에 현재 운항 상태 적용
			        setDashBoard(mObject2, function(rtn){ 
			        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
		        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
			}
        });     			 //기준 시간 범위내 단말기 수신 정보 찾기
	} else {
		
		mObject2.machineId = sId;
		
		logger.info("boat is not anchored !!");
		// 보트 정박 처리
		db.SetBoatNotAnchor(mObject2, function(rtn){ 
			logger.info("SetBoatAnchor result:" + rtn);
	    	// 대쉬보드에 현재 운항 상태 적용
	        setDashBoard(mObject, function(rtn){ 
	        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
        });     				
	}

    return {message: this.message};
};



//객체를 바로 module.exports에 할당
module.exports = AnchorCheck;

/***
var AnchorCheck = require('./anchor');
var anchorCheck = new AnchorCheck(message); 

anchorCheck.getAnchorCheck();

***/

