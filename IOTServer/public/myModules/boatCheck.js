/*jshint esversion: 6 */
/*
 * 보트 출입 인식
 */

const logger = require('../../config/winston');
var path   = require('path');
var async  = require('async');
var moment = require('moment');
var DB     = require('./db');

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
	var anchorId;   // 정박지단말기 ID  
	var leftRight;  // 좌우구분  좌우구분 (0:좌, 1:우)
	var sendtime;   // 전송일시  
	var boatinout;  // 입출항구분  
}
var mObject = new MessageObject(); //메세지 구조체


function BoatCheck(message) {
	this.message = message;
}


//보트 단말기 정박 상태 분석
function analysisBoatAnchor(sId, nGradex, nGradey) { 

    logger.info('Start analysisBoatAnchor........');
    logger.info('   sId:' + sId);
    logger.info('   nGradex:' + nGradex);
    logger.info('   nGradey:' + nGradey);
    
    mObject.id   = sId;
    mObject.gpsX = nGradex;
    mObject.gpsY = nGradey;
    
    mObject.gpsX = 55;  //LDH
    mObject.gpsY = 99;

    var db = new DB(); 
    
    async.waterfall([
        function(callback) {
        	 
        	try {
	           db.SelectSectorBound(mObject, function(rtn){	//게류지 영역 확인
	                if (rtn === 'OK') {
	                	logger.info('정박상태 확인1');
	                    db.SelectAnchorYN(mObject, function(rtn){
	                        if (rtn === 'OK') {
	                        	logger.info('보트출항중1-1');
	                        } else {
	                            logger.info('보트입항중1-2');
	                        }   
	                    });         
	                } else {
	                    logger.info('보트단말기 정박상태 분석1');
	                    callback(null, rtn);
	                	// 보트단말기 정박상태 분석1
	                	//analysisBoatAnchor(mObject, function(rtn){ 
	                    //	;;
	                    //});                        
	                }   
	            });   
        	} catch (error) {
        		logger.info('eeeeeeeeeeeeeeeeeeeeeee1');
        		callback(error, null);
        	}
        },
        function(callback) {
        	try {        	
	        	// 대쉬보드에 현재 운항 상태 적용
	        	setDashBoard(mObject, function(rtn){ 
	            	;;
	            });   
        	} catch (error) {
        		logger.info('eeeeeeeeeeeeeeeeeeeeeee2');
        		callback(error, null);
        	}	        	
        }
        
    ],
    function (err, result) {
        if(err){
            console.log('Error ');
            throw( err );
        }  
    });
}

//보트 GPS의 위치가 출입구 구역에 있는지 판단 
function getGPSAreaAnalysis(sId, nLatitude, nLongitude, sSendTime) { 

    logger.info('Start getGPSAreaAnalysis........');
    logger.info('   sId:' + sId);
    logger.info('   nLatitude :' + nLatitude  );
    logger.info('   nLongitude:' + nLongitude );
    logger.info('   sSendTime:'  + sSendTime  );    
    
    mObject.id       = sId;			//단말기ID
    mObject.gpsX     = nLatitude;	//현재위치(위도)
    mObject.gpsY     = nLatitude;	//현재위치(경도)
    mObject.sendtime = sSendTime;	//전송일시
    
    mObject.gpsX = 100;			// LDH
    mObject.gpsY = 55;

    var db = new DB(); 
    
    async.waterfall([
        function(callback) {
        	logger.info('!! 최근 정박 이력 확인중...'); 
            db.SelectGateBound(mObject, function(rtn){
                if (rtn === 'OK') {
                	//최근 정박 이력 확인
                	logger.info('정박상태 확인2'); 
                    db.SelectLastAnchor(mObject, function(rtn){
                        if (rtn === 'OK') {
                        	logger.info('보트 출항중'); //보트출항중
                        	mObject.boatinout = '0' 
                        } else {
                            logger.info('보트 입항중'); //보트 입항중
                            mObject.boatinout = '1' 
                        }   
                        callback(null, mObject);  
                    });    
                } else {
                    logger.info('보트단말기 정박상태 분석2'); //보트단말기 정박상태 분석2
                    callback(null, rtn);  // LDH
                	// 보트단말기 정박상태 분석2
                	//analysisBoatAnchor(mObject, function(rtn){ 
                    //	;;
                    //});                        
                }   
            });   
        },
        function(mObject, callback) {
        	logger.info('!! 보트 일출항 이력 갱신중...'); 
        	logger.info('   id    : ' + mObject.id);
        	logger.info('   sendtime  : ' + mObject.sendtime);
        	logger.info('   boatinout : ' + mObject.boatinout);
        	
        	// 보트 일출항 이력 갱신
            db.UpdateBoatHist(mObject, function(rtn){
                if (rtn === 'OK') {
                	logger.info('정박상태 확인3'); 
                	//최근 정박 이력 확인
                } else {
                    logger.info('보트단말기 정박상태 분석3'); //보트단말기 정박상태 분석2
                    callback(null, rtn); 
                }   
            });          
		},
		function(callback) {
			logger.info('!! 대쉬보드에 현재 운항 상태 적용중...'); 
			// 대쉬보드에 현재 운항 상태 적용
			logger.info('!! 대쉬보드에 현재 운항 상태 적용중...'); 
			setDashBoard(mObject, function(rtn){ 
		    	;;
		    });         
		}
        
    ],
    function (err, result) {
        if(err){
            console.log('Error ');
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
	var sSendTime    = sData[0];
	var sId          = sData[9];
	var nTemperature = sData[16];
	var nHumidity    = sData[17];
	var nGradex      = sData[18];
	var nGradey      = sData[19];
	var nLatitude    = sData[22];
	var nLongitude   = sData[24];

    logger.info('-----------------------------');
    logger.info('   sId:' + sId);
    logger.info('   nTemperature:' + nTemperature);
    logger.info('   nHumidity:' + nHumidity);
    logger.info('   nGradex:' + nGradex);
    logger.info('   nGradey:' + nGradey);
    logger.info('   nLatitude:' + nLatitude);
    logger.info('   nLongitude:' + nLongitude);
    logger.info('   sSendTime:' + sSendTime);
    logger.info('-----------------------------');


	if(nTemperature === "") { nTemperature = 0; }
	if(nHumidity    === "") { nHumidity = 0; }
	if(nGradex      === "") { nGradex = 0; }
	if(nGradey      === "") { nGradey = 0; }
	if(nLatitude    === "") { nLatitude = 0; }
	if(nLongitude   === "") { nLongitude = 0; }

	if ((nGradex > 60) || (nGradey > 60)) { //기울기가 60도 이상이면 보트가 좌초하는 경우로 자동 SOS 요청신호로 간주
		logger.info("Starting SOS processing.......");
    	// SOS 신호 처리 //LDH
        //setDashBoard(mObject, function(rtn){
        	//
        //}
    	// 대쉬보드에 현재 운항 상태 적용
        setDashBoard(mObject, function(rtn){ 
        	;;
        });     				
	} else {
		getGPSAreaAnalysis(sId, nLatitude, nLongitude, sSendTime); //GPS위치가 출입구 구역인지 확인
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

