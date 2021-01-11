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
}
var mObject = new MessageObject(); //메세지 구조체


function AnchorCheck(message) {
	this.message = message;
}

/**

//보트 단말기 정박 상태 분석
function analysisBoatAnchor(sId, nGradex, nGradey) { 

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
                    db.SelectAnchorYN(mObject, function(rtn){
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
                	analysisBoatAnchor(mObject, function(rtn){ 
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
                    db.SelectAnchorYN(mObject, function(rtn){
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
                	analysisBoatAnchor(mObject, function(rtn){ 
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

AnchorCheck.prototype.getAnchorCheck = function() {
    
	logger.info('Start getAnchorCheck........');

    var db = new DB(); 
    
	var sData = this.message;  // MQTT에서 보내온 메세지
	var sId       = sData[0];
	var sIp       = sData[1];
	var nDistance = sData[2];
	var sStime    = sData[3];

	logger.info(sId);
	logger.info(sIp);   
	logger.info(nDistance);   

	if(nDistance   === "") { nDistance = 0; }

	if (nDistance  < 100 ) { //거리가 100mm 이하이면 정박 상태
		logger.info("boat is anchored !!");
	    mObject.iD   = sId;
	    mObject.time = sStime;		
		db.GetBoatDataSearch(mObject, function(rtn){ 
        	;;
        });     			 //기준 시간 범위내 단말기 수신 정보 찾기
	} else {
		logger.info("boat is not anchored !!");
    	// 대쉬보드에 현재 운항 상태 적용
        setDashBoard(mObject, function(rtn){ 
        	;;
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

