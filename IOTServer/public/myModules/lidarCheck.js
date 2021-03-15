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
	var id;    // MQTT에서 전달 받은 단말기 ID 
	var gpsX;  // MQTT에서 전달 받은 GPS 위도 
	var gpsY;  // MQTT에서 전달 받은 GPS 경도
	var time;  // MQTT에서 전달 받은 시각	
	var machineId;  //보트단말기 ID     
	var boatId;  //보트 ID     
	var lidarId;   // 정박지단말기 ID  
	var leftRight;  // 좌우구분   좌우구분 (0:좌, 1:우)
	var sendtime;   // 전송일시  	
	var boatinout;  // 입출항구분  
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
    
    mObject.id   = sId;
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
    
    mObject.id   = sId;
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
	
    logger.info('-----------------------------');
	logger.info("  sId:"+sId);
	logger.info("  sSendtime:"+sSendtime);   
	logger.info("  sShipLeftYn:"+sShipLeftYn);   
	logger.info("  sShipRightYn:"+sShipRightYn);   
    logger.info('-----------------------------');

	
	mObject.boatId   = "";
	mObject.lidarId = "";
	
	mObject2.machineId = "";
	mObject2.boatId = "";
	mObject2.lidarId = "";
	
	async.waterfall([
	    function(callback) {
	    	
	    	if ((sShipLeftYn === "1")||(sShipRightYn === "1")) { //lidar 왼쪽 또는 오른쪽에 정박한 경우
	    		
	    		if (sShipLeftYn === "1") { //lidar 왼쪽에 정박한 경우
	    			logger.info('!! 왼쪽 라이더에 기준 시간 범위내 단말기 수신 정보 찾기중...'); 
	    			logger.info("boat is left lidared !!");
	    		    mObject.id        = sId;
	    		    mObject.time      = sSendtime;	
	    		    mObject.leftRight = '0';	// 좌
	    	
	    		    //기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
	    		    db.GetBoatDataSearch(mObject, function(mObject2){ 
	    				if(mObject2 == "ERROR") {
	    		    		logger.info("boat is not anchored1 !!");
	    		    		// 미등록 보트 정박 처리 // LDH
	    		    		callback(null, mObject2);  
	    				} else {
	    				//if(mObject.boatId) {
	    					logger.info("GetBoatDataSearch machineId:" + mObject2.machineId);
	    					logger.info("GetBoatDataSearch boatId   :" + mObject2.boatId);
	    					logger.info("GetBoatDataSearch anchorId :" + mObject2.anchorId);
	    					// 보트 정박 처리
	    	    			logger.info('!! 보트 정박 처리중...'); 
	    					db.SetBoatAnchor(mObject2, function(rtn){ 
	    						logger.info("SetBoatAnchor result:" + rtn);
	    				    	// 대쉬보드에 현재 운항 상태 적용
			    				callback(null, mObject2);  
	    			        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
	    				}
	    	        });     			 //기준 시간 범위내 단말기 수신 정보 찾기
	    		}
	    		if (sShipRightYn === "1") { //lidar 왼쪽에 정박한 경우
	    			logger.info('!! 오른쪽 라이더에 기준 시간 범위내 단말기 수신 정보 찾기중...'); 
	    			logger.info("boat is right lidared !!");
	    		    mObject.id        = sId;
	    		    mObject.time      = sSendtime;	
	    		    mObject.leftRight = '1';	// 우

	    		    //기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
	    		    db.GetBoatDataSearch(mObject, function(mObject2){ 
	    				if(mObject2 == "ERROR") {
	    		    		logger.info("boat is not anchored2 !!");
	    		    		callback(null, mObject2);  
	    		    		// 미등록 보트 정박 처리 // LDH
	    				} else {
	    				//if(mObject.boatId) {
	    					logger.info("GetBoatDataSearch machineId:" + mObject2.machineId);
	    					logger.info("GetBoatDataSearch boatId   :" + mObject2.boatId);
	    					logger.info("GetBoatDataSearch anchorId :" + mObject2.anchorId);
	    					// 보트 정박 처리
	    	    			logger.info('!! 보트 정박 처리중...'); 
	    					db.SetBoatAnchor(mObject2, function(rtn){ 
	    						logger.info("SetBoatAnchor result:" + rtn);
	    				    	// 대쉬보드에 현재 운항 상태 적용
			    				callback(null, mObject2);  
	    			        });     			 //기준 시간 범위내 단말기 수신 정보 찾기			
	    				}
	    	        });     			 //기준 시간 범위내 단말기 수신 정보 찾기
	    		}
	    	} else {
	    		mObject2.machineId = sId;
	    		logger.info("boat is not anchored3 !!");
    			logger.info('!! 보트 정박 처리중...'); 
	    		// 보트 정박 처리
	    		db.SetBoatNotAnchor(mObject2, function(rtn){ 
	    			logger.info("SetBoatAnchor result3:" + rtn);
    	        	// 보트 일출항 이력 갱신
	    			logger.info('!! 보트 일출항 이력 갱신중...'); 
    	            db.UpdateBoatHist(mObject, function(rtn){
    	                if (rtn === 'OK') {
    	                	logger.info('정박상태 확인3'); 
    	                	//최근 정박 이력 확인
    	                } else {
    	                    logger.info('보트단말기 정박상태 분석3'); //보트단말기 정박상태 분석2
    	                    callback(null, rtn); 
    	                }   
    	            });          
	            });     
	    	}
	    },
		function(callback) {
			// 대쉬보드에 현재 운항 상태 적용
			logger.info('!! 대쉬보드에 현재 운항 상태 적용중...'); 
			setDashBoard(mObject, function(rtn){ 
		    	;;
		    });         
		}
    ],
    function (err, result) {
    	logger.info('async....004'); 
        if(err){
            console.log('Error ');
            throw( err );
        }  
    });	    

};



//객체를 바로 module.exports에 할당
module.exports = LidarCheck;

/***
var LidarCheck = require('./lidar');
var lidarCheck = new LidarCheck(message); 

lidarCheck.getLidarCheck();

***/

