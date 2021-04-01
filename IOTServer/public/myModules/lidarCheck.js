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

function LidarCheck(message) {
    this.message = message;
}


LidarCheck.prototype.getLidarCheck = function() {
    
    logger.info('Start getLidarCheck........');
    
    var mObject  = new MessageObject(); //메세지 구조체
    var mObject2 = new MessageObject(); //메세지 구조체

    var db = new DB(); 
    
    var sData = this.message;  // MQTT에서 보내온 메세지
    mObject.marinaId   = 1;
    mObject.machineId  = sData[00];
    mObject.sendTime   = sData[09];
    var sShipLeftYn    = sData[15];
    var sShipRightYn   = sData[17];
    
    logger.info("==================================");
    logger.info("  marinaId    :"+mObject.marinaId);
    logger.info("  machineId   :"+mObject.machineId);
    logger.info("  boatId      :"+mObject.boatId);
    logger.info("  sendTime    :"+mObject.sendTime);   
    logger.info("  sShipLeftYn :"+sShipLeftYn);   
    logger.info("  sShipRightYn:"+sShipRightYn);   
    logger.info("==================================");

    mObject.lidarId     = "";
    
    mObject2.marinaId   = 1 ;
    mObject2.machineId  = "";
    mObject2.boatId     = "";
    mObject2.lidarId    = "";
    
    async.waterfall([
        function(callback) {
            db.GetRegAnchorMachindId(mObject, function(rtn){
	            if (rtn == 'OK') {
	                //최근 정박 이력 확인
	    			db.SetLidarData(sData, function(rtn){;    
		    			if (rtn == 'OK') {
//			                logger.info('등록된 단말기 있음'); 
			                callback(null, "OK", mObject);  
		    			} else {
//			                logger.info('등록된 단말기 있음'); 
			                callback(null, "ERROR", mObject);  
		    			}
	    			});
	            } else {
	                logger.info('등록된 단말기 없음'); 
	                callback(null, "ERROR", mObject);  //
	            }   
	        });          	
        },
        function(result, mObject, callback) {
            if (result == 'OK') {            
	        	
	            if ((sShipLeftYn == "1")||(sShipRightYn == "1")) { //lidar 왼쪽 또는 오른쪽에 정박한 경우
	                
	                if (sShipLeftYn == "1") { //lidar 왼쪽에 정박한 경우
	                    logger.info('!! 왼쪽 라이더에 기준 시간 범위내 단말기 수신 정보 찾기중...'); 
	                    mObject.leftRight = '0';    // 좌
	            
	                    //기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
	                    db.GetAnchorBoatDataSearch(mObject, function(result,mObject2){ 
	                        if(result == "OK") {
	                            logger.info("범위내에 등록된 보트가 존재합니다.!!");
	                            logger.info("  machineId:" + mObject2.machineId);
	                            logger.info("  boatId   :" + mObject2.boatId);
	                            logger.info("  anchorId :" + mObject2.anchorId);
	                            // 보트 정박 처리
	                            logger.info('!! 보트 정박 처리중...'); 
	                            db.SetBoatAnchor("1", mObject2, function(rtn){  //status = 1 정박
	                                if (rtn == 'OK') {
	                                    logger.info('보트 정박 처리 성공1'); 
	                                    /***
	                                    // 보트 일출항 이력 갱신
	                                    logger.info('!! 보트 일출항 이력 갱신중...'); 
	                                    db.UpdateBoatHist(mObject2, function(rtn){
	                                        if (rtn == 'OK') {
	                                            logger.info('보트 일출항 이력 갱신 성공');  
	                                        } else {
	                                            logger.info('보트 일출항 이력 갱신 실패'); 
	                                        }   
	                                    });        
	                                    ***/  
	                                } else {
	                                    logger.info('보트 정박 처리 실패1'); 
	                                }        
	                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
	                        } else {
	                            logger.info("범위내에 등록된 보트가 존재하지 않습니다.(미등록된 보트 탐지)!!");
	                            // 미등록 보트 정박 처리 // LDH
	                            db.SetBoatAnchor("0", mObject2, function(rtn){ //status = 0 미정박
	                                if (rtn == 'OK') {
	                                    logger.info('보트 정박 처리 성공2'); 
	                                    /***
	                                    // 보트 일출항 이력 갱신
	                                    logger.info('!! 보트 일출항 이력 갱신중...'); 
	                                    db.UpdateBoatHist(mObject2, function(rtn){
	                                        if (rtn == 'OK') {
	                                            logger.info('보트 일출항 이력 갱신 성공');  
	                                        } else {
	                                            logger.info('보트 일출항 이력 갱신 실패'); 
	                                        }   
	                                    });         
	                                    ***/ 
	                                } else {
	                                    logger.info('보트 정박 처리 실패2'); 
	                                }     
	                            });                              
	                        }
	                    });                  //기준 시간 범위내 단말기 수신 정보 찾기
	                }
	                if (sShipRightYn == "1") { //lidar 왼쪽에 정박한 경우
	                    logger.info('!! 오른쪽 라이더에 기준 시간 범위내 단말기 수신 정보 찾기중...'); 
	                    logger.info("boat is right lidared !!");
	                    mObject.leftRight = '1';    // 우
	
	                    //기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
	                    db.GetAnchorBoatDataSearch(mObject, function(result,mObject2){ 
	                        if(result == "OK") {
	                        //if(mObject.boatId) {
	                            logger.info("범위내에 등록된 보트가 존재합니다.!!");
	                            logger.info("  machineId:" + mObject2.machineId);
	                            logger.info("  boatId   :" + mObject2.boatId);
	                            logger.info("  anchorId :" + mObject2.anchorId);
	                            // 보트 정박 처리
	                            logger.info('!! 보트 정박 처리중...'); 
	                            db.SetBoatAnchor("1", mObject2, function(rtn){  //status = 1 정박
	                                logger.info("SetBoatAnchor result3:" + rtn);
	                                if (rtn == 'OK') {
	                                    logger.info('보트 정박 처리 성공3'); 
	                                    /***
	                                    // 보트 일출항 이력 갱신
	                                    logger.info('!! 보트 일출항 이력 갱신중3...'); 
	                                    db.UpdateBoatHist(mObject2, function(rtn){
	                                        if (rtn == 'OK') {
	                                            logger.info('보트 일출항 이력 갱신 성공3');  
	                                        } else {
	                                            logger.info('보트 일출항 이력 갱신 실패3'); 
	                                        }   
	                                    });       
	                                    ***/   
	                                } else {
	                                    logger.info('보트 정박 처리 실패3'); 
	                                }                                  
	                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
	                        } else {
	                            logger.info("범위내에 등록된 보트가 존재하지 않습니다.(미등록된 보트 탐지)!!");
	                            // 미등록 보트 정박 처리 // LDH
	                            db.SetBoatAnchor("0", mObject2, function(rtn){ //status = 0 미정박
	                                if (rtn == 'OK') {
	                                    logger.info('보트 정박 처리 성공4');
	                                    /***
	                                    // 보트 일출항 이력 갱신
	                                    logger.info('!! 보트 일출항 이력 갱신중4...'); 
	                                    db.UpdateBoatHist(mObject2, function(rtn){
	                                        if (rtn == 'OK') {
	                                            logger.info('보트 일출항 이력 갱신 성공4');  
	                                        } else {
	                                            logger.info('보트 일출항 이력 갱신 실패4'); 
	                                        }   
	                                    });     
	                                    ***/     
	                                } else {
	                                    logger.info('보트 정박 처리 실패4'); 
	                                }     
	                            });                              
	                        }
	                    });                  //기준 시간 범위내 단말기 수신 정보 찾기
	                }
	            } else {
	                logger.info("boat is not anchored3 !!");
	                logger.info('!! 보트 정박 처리중1...'); 
	                // 보트 정박 처리
	                mObject.leftRight = '0';    // 우
	                db.SetBoatNotAnchor(mObject, function(rtn){ 
	                    if (rtn == 'OK') {
	                        logger.info('보트 정박 처리 성공1');  
	                    } else {
	                        logger.info('보트 정박 처리 실패1'); 
	                    }   
	                });     
	                logger.info("boat is not anchored3 !!");
	                logger.info('!! 보트 정박 처리중2...'); 
	                // 보트 정박 처리
	                mObject.leftRight = '1';    // 우
	                db.SetBoatNotAnchor(mObject, function(rtn){  
	                    if (rtn == 'OK') {
	                        logger.info('보트 정박 처리 성공2');  
	                    } else {
	                        logger.info('보트 정박 처리 실패2'); 
	                    }   
	                });     
	            }
            }
        }
    ],
    function (err, result) {
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

