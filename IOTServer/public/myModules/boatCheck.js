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
	var gpsX;  // MQTT에서 전달 받은 GPS 위도 
	var gpsY;  // MQTT에서 전달 받은 GPS 경도
}
var mObject = new MessageObject(); //메세지 구조체


function BoatCheck(message) {
	this.message = message;
}

// 보트 GPS의 위치가 출입구 구역에 있는지 판단 
function getGPSAreaAnalysis(nGradex, nGradey) { 

    logger.info('Start getArea........');
    
    mObject.gpsX = nGradex;
    mObject.gpsY = nGradey;
    
    mObject.gpsX = 100;
    mObject.gpsY = 55;
    
    async.waterfall([
        function(callback) {
            var db = new DB(); 
            db.SelectGateBound(mObject, function(rtn){
                if (rtn === 'OK') {
                    callback(null, rtn);
                } else {
                    logger.info('SelectGateBound1 result : ' + rtn);
                    callback('err','ERROR');
                    return;
                }   
            });         
        },
        function(rtn, callback) {
            logger.info('SelectGateBound2 result : ' + rtn);
            callback(null, 'completed');
        }
    ],
    function (err, result) {
        if(err){
            console.log('Error 발생');
            throw( err );
        }else {
            console.log(result );
        }  
    });
}


BoatCheck.prototype.getBoatCheck = function() {
    
	logger.info('Start getBoatCheck........');

	var obj=JSON.parse(this.message);  // MQTT에서 보내온 메세지

	for (var sKey in obj) {
		if (obj.hasOwnProperty(sKey)) {
			logger.info(sKey);
			   
			if(sKey !== "boatData") { return -1; } // 보트 데이터가 아닌면 Skip

			var sData = obj[sKey].split(",");
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
				//setDashBoard();   // 대쉬보드 적용
			} else {
				getGPSAreaAnalysis(nGradex, nGradey); //GPS위치가 출입구 구역인지 확인
			}
		}    
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

