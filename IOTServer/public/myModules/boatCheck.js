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


function BoatCheck(message) {
	this.message = message;
}


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



function setDashBoard() {
    
	logger.info('Start setDashBoard........');

};

BoatCheck.prototype.getBoatCheck = function() {
    
	logger.info('Start getBoatCheck........');

	var sData = this.message;  // MQTT에서 보내온 메세지
	var sId          = sData[9];
	var nTemperature = sData[16];
	var nHumidity    = sData[17];
	var nGradex      = sData[18];
	var nGradey      = sData[19];
	var nLatitude    = sData[22];
	var nLongitude   = sData[24];

	logger.info(nGradex);
	logger.info(nGradey);   

	if(nTemperature === "") { nTemperature = 0; }
	if(nHumidity    === "") { nHumidity = 0; }
	if(nGradex      === "") { nGradex = 0; }
	if(nGradey      === "") { nGradey = 0; }
	if(nLatitude    === "") { nLatitude = 0; }
	if(nLongitude   === "") { nLongitude = 0; }

	if ((nGradex > 60) || (nGradey>60)) { //기울기가 60도 이상이면 보트가 좌초하는 경우로 자동 SOS 요청신호로 간주
		logger.info("Starting SOS processing.......");
    	// 대쉬보드에 현재 운항 상태 적용
        setDashBoard(mObject, function(rtn){ 
        	;;
        });     				
	} else {
		getGPSAreaAnalysis(sId, nGradex, nGradey); //GPS위치가 출입구 구역인지 확인
	}

    return {message: this.message};
};



//객체를 바로 module.exports에 할당
module.exports = BoatCheck;

/***
var BoatCheck = require('./boatCheck');
var boatCheck = new BoatCheck(message); 

boatCheck.getBoatCheck();

***/

