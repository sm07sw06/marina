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
	var iD;    // MQTT에서 전달 받은 단말기 ID 
	var gpsX;  // MQTT에서 전달 받은 GPS 위도 
	var gpsY;  // MQTT에서 전달 받은 GPS 경도
	var time;  // MQTT에서 전달 받은 시각	
	var machineId;  //보트단말기 ID     
	var boatId;  //보트 ID     
	var lidarId;   // 정박지단말기 ID  
	var leftRight;  // 좌우구분  
}
var mObject  = new MessageObject(); //메세지 구조체
var mObject2 = new MessageObject(); //메세지 구조체


function LidarCheck(message) {
	this.message = message;
}

/**

//보트 단말기 정박 상태 분석
function analysisBoatLidar(sId, nGradex, nGradey) { 

    logger.info('Start getArea........');
    
    mObject.iD   = sId;
    mObject.gpsX = nGradex;
    mObject.gpsY = nGradey;
    
    mObject.gpsX = 100;
    mObject.gpsY = 55;

    var db = new DB(); 
    
    async.waterfall([
        function(callback) {
            db.SelectGateBound(mObject, function(rtn){
                if (rtn === 'OK') {
                	logger.info('정박상태 확인');
                    db.SelectLidarYN(mObject, function(rtn){
                        if (rtn === 'OK') {
                        	logger.info('보트출항중');
                        } else {
                            logger.info('보트입항중');
                        }   
                    });         
                } else {
                    logger.info('보트단말기 정박상태 분석');
                    callback(null, rtn);
                	// 보트단말기 정박상태 분석
                	analysisBoatLidar(mObject, function(rtn){ 
                    	;;
                    });                        
                }   
            });         
        },
        function(callback) {
        	// 대쉬보드에 현재 운항 상태 적용
        	setDashBoard(mObject, function(rtn){ 
            	;;
            });         
        }
        
    ],
    function (err, result) {
        if(err){
            console.log('Error 발생');
            throw( err );
        }  
    });
}


// 보트 GPS의 위치가 출입구 구역에 있는지 판단 
function getGPSAreaAnalysis(sId, nGradex, nGradey) { 

    logger.info('Start getArea........');
    
    mObject.iD   = sId;
    mObject.gpsX = nGradex;
    mObject.gpsY = nGradey;
    
    mObject.gpsX = 100;
    mObject.gpsY = 55;

    var db = new DB(); 
    
    async.waterfall([
        function(callback) {
            db.SelectGateBound(mObject, function(rtn){
                if (rtn === 'OK') {
                	logger.info('정박상태 확인');
                    db.SelectLidarYN(mObject, function(rtn){
                        if (rtn === 'OK') {
                        	logger.info('보트출항중');
                        } else {
                            logger.info('보트입항중');
                        }   
                    });         
                } else {
                    logger.info('보트단말기 정박상태 분석');
                    callback(null, rtn);
                	// 보트단말기 정박상태 분석
                	analysisBoatLidar(mObject, function(rtn){ 
                    	;;
                    });                        
                }   
            });         
        },
        function(callback) {
        	// 대쉬보드에 현재 운항 상태 적용
        	setDashBoard(mObject, function(rtn){ 
            	;;
            });         
        }
        
    ],
    function (err, result) {
        if(err){
            console.log('Error 발생');
            throw( err );
        }  
    });
}

**/

function  setDashBoard() {
    
	logger.info('Start setDashBoard........');

};

LidarCheck.prototype.getLidarCheck = function() {
    
	logger.info('Start getLidarCheck........');

    var db = new DB(); 
    
	var sData = this.message;  // MQTT에서 보내온 메세지
	var sId       		= sData[00];
	var sSendtime 		= sData[09];
	var sShipLeftYn 	= sData[15];
	var sShipRightYn 	= sData[17];
	
	logger.info("  sId:"+sId);
	logger.info("  sSendtime:"+sSendtime);   
	logger.info("  sShipLeftYn:"+sShipLeftYn);   
	logger.info("  sShipRightYn:"+sShipRightYn);   

	
	mObject.boatId   = "";
	mObject.lidarId = "";
	
	mObject2.machineId = "";
	mObject2.boatId = "";
	mObject2.lidarId = "";
	
	if ((sShipLeftYn === "1")||(sShipRightYn === "1")) { //lidar 왼쪽 또는 오른쪽에 정박한 경우
		
		if (sShipLeftYn === "1") { //lidar 왼쪽에 정박한 경우
			logger.info("boat is left lidared !!");
		    mObject.iD        = sId;
		    mObject.time      = sSendtime;	
		    mObject.leftRight = '0';	
	
		    //기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
		    db.GetBoatDataSearch(mObject, function(mObject2){ 
				
				if(mObject.boatId) {
					logger.info("GetBoatDataSearch machineId:" + mObject2.machineId);
					logger.info("GetBoatDataSearch boatId   :" + mObject2.boatId);
					logger.info("GetBoatDataSearch anchorId :" + mObject2.anchorId);
					// 보트 정박 처리
					db.SetBoatAnchor(mObject2, function(rtn){ 
						logger.info("SetBoatAnchor result:" + rtn);
				    	// 대쉬보드에 현재 운항 상태 적용
				        setDashBoard(mObject2, function(rtn){ 
				        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
			        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
				}
	        });     			 //기준 시간 범위내 단말기 수신 정보 찾기
		}
		if (sShipRightYn === "1") { //lidar 왼쪽에 정박한 경우
			logger.info("boat is right lidared !!");
		    mObject.iD        = sId;
		    mObject.time      = sSendtime;	
		    mObject.leftRight = '0';	

		    db.GetBoatDataSearch(mObject, function(mObject2){ 
				
				if(mObject.boatId) {
					logger.info("GetBoatDataSearch machineId:" + mObject2.machineId);
					logger.info("GetBoatDataSearch boatId   :" + mObject2.boatId);
					logger.info("GetBoatDataSearch anchorId :" + mObject2.anchorId);
					// 보트 정박 처리
					db.SetBoatAnchor(mObject2, function(rtn){ 
						logger.info("SetBoatAnchor result:" + rtn);
				    	// 대쉬보드에 현재 운항 상태 적용
				        setDashBoard(mObject2, function(rtn){ 
				        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
			        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
				}
	        });     			 //기준 시간 범위내 단말기 수신 정보 찾기
		}
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
module.exports = LidarCheck;

/***
var LidarCheck = require('./lidar');
var lidarCheck = new LidarCheck(message); 

lidarCheck.getLidarCheck();

***/

