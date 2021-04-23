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
    var latitudeDir;   // 위도
    var longitude;  // 경도
    var longitudeDir;  // 경도
    var cctv_cd  ;  // cctv
    var photo_base64; //전송이미지 텍스트
    var last_upd_tm;  //최종수정시각
    var temperature;
    var humidity   ;
	var machineNm;  //보트단말기명
    var x;   // 삼각측정 좌표 X
    var y;   // 삼각측정 좌표 Y
}


function MessageSubObject()
{ 
    var marinaId;   //마리나 ID      
    var machineId;  //보트단말기 ID     
    var sendTime;   // 전송일시     
    var boatId;  //보트 ID     
    var lidarId;   // 정박지단말기 ID  
    var leftRight;  // 좌우구분   좌우구분 (0:좌, 1:우)
    var boatInout;  // 입출항구분  
    var boatMachineId;  // MQTT에서 전달 받은 GPS 위도 
    var rssi;  // MQTT에서 전달 받은 GPS 경도
    var rssi2;  // MQTT에서 전달 받은 GPS 경도
}

function LidarCheck(message) {
    this.message = message;
}


LidarCheck.prototype.getLidarCheck = function() {
    
    logger.debug('Start getLidarCheck........');
    
    var mObject     = new MessageObject(); //메세지 구조체
    var mObjectRtn    = new MessageObject(); //메세지 구조체
    var mSubObjectLeft  = new MessageSubObject(); //메세지 구조체    
    var mSubObjectLeftRtn = new MessageSubObject(); //메세지 구조체    
    var mSubObjectRight = new MessageSubObject(); //메세지 구조체    
    var mSubObjectRightRtn = new MessageSubObject(); //메세지 구조체
    
    var db = new DB(); 
    
    var sData = this.message;  // MQTT에서 보내온 메세지
    mObject.marinaId   = 1;
    mObject.machineId  = sData[0];
    mObject.sendTime   = sData[09];
    var sShipLeftYn    = sData[15];
    var sShipRightYn   = sData[17];
    
    logger.debug("==================================");
    logger.debug("  marinaId    :"+mObject.marinaId);
    logger.debug("  machineId   :"+mObject.machineId);
    logger.debug("  boatId      :"+mObject.boatId);
    logger.debug("  sendTime    :"+mObject.sendTime);   
    logger.debug("  sShipLeftYn :"+sShipLeftYn);   
    logger.debug("  sShipRightYn:"+sShipRightYn);   
    logger.debug("==================================");

    mObject.lidarId     = "";
    
    mObjectRtn.marinaId   = 1 ;
    mObjectRtn.machineId  = "";
    mObjectRtn.boatId     = "";
    mObjectRtn.lidarId    = "";

    if ((sShipRightYn == "1")||(sShipLeftYn == "1")) { //lidar 오른쪽(왼쪽)에 정박한 경우 
    
        if ((sShipRightYn == "1")) { //lidar 오른쪽에 정박한 경우 
		    
		    async.waterfall([
		        function(callback) {
		            db.GetRegAnchorMachindId(mObject, function(rtn){
			            if (rtn == 'OK') {
			                //최근 정박 이력 확인
			    			db.SetLidarData(sData, function(rtn){;    
				    			if (rtn == 'OK') {
		//			                logger.debug('등록된 단말기 있음'); 
					                callback(null, "OK", mObject);  
				    			} else {
		//			                logger.debug('등록된 단말기 있음'); 
					                callback(null, "ERROR", mObject);  
				    			}
			    			});
			            } else {
			                logger.debug('등록된 단말기 없음'); 
			                callback(null, "ERROR", mObject);  //
			            }   
			        });          	
		        },
		        function(result, mObject, callback) {
		        	
		            if (result == 'OK') {            
			        	
		            	mSubObjectRight.marinaId = mObject.marinaId;   //마리나 ID      
		            	mSubObjectRight.machineId = mObject.machineId;  //보트단말기 ID     
		                mSubObjectRight.sendTime = mObject.sendTime;   // 전송일시     
		                mSubObjectRight.boatId = "";  //보트 ID     
		                mSubObjectRight.boatMachineId =  "";  // MQTT에서 전달 받은 GPS 위도 
		                mSubObjectRight.rssi = 0.0;  // MQTT에서 전달 받은 GPS 경도
	                
	                    logger.debug('!! 오른쪽  라이더에  단말기 수신 정보 찾기중...'); 
	                    mSubObjectRight.leftRight = '1';    // 우
	            
	                    // 왼쪽(오른쪽) 방향에 보트 식별시 가장 가까운 보트 찾기(보트 단말기 신호 기록)
	                    db.GetlidarNearBoatSearch(mSubObjectRight, function(result, mSubObjectRightRtn){  // LDH boatId 찾는 방법 ??? 
	                        if(result == "OK") {
	                            logger.info("범위내에 등록된 보트가 존재합니다.!!");
	                            logger.info("  boatMachineId : " + mSubObjectRightRtn.boatMachineId);
	                            logger.info("  rssi :" + mSubObjectRightRtn.rssi);
	                            logger.info(' ＆＆＆＆＆＆＆＆  leftRight: ' + mSubObjectRight.leftRight);	
	                            
	                            mSubObjectRight.boatMachineId = mSubObjectRightRtn.boatMachineId;
	                            mSubObjectRight.rssi = mSubObjectRightRtn.rssi;
	                            // 보트 정박 처리
	                            logger.info('!! 찾은 보트가 정박 상태 인지 확인...'); 
	                            db.GetBoatInAnchor( mSubObjectRight, function(rtn){  //status = 1 정박
	                                if (rtn == 'OK') {
	                                    logger.info('이미 정박된 보트임1'); 
	                                    callback(null, "OK", mSubObjectRight);  
	                                } if (rtn == 'NOOK') {
	                                    logger.info('정박된 보트 없음1'); 
	                                    callback(null, "NOOK", mSubObjectRight);  
	                                } else {
	                                    logger.error('보트 찾기시 오류1'); 
	                                    callback(null, "ERROR", mSubObjectRight);  
	                                }        
	                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
	                        } else {
	                            logger.info(" 오른쪽(왼쪽) 방향에 보트 식별시 가장 가까운 보트 찾기 실폐");
                                callback(null, "ERROR", mSubObjectRight);  
	                        }
	                    });                  //기준 시간 범위내 단말기 수신 정보 찾기
		            }
		        },
		       function(result, mSubObjectRight, callback) {
		        	
		        	logger.info('  ■■■■   ■   ■   ■■■■■ leftRight: ' + mSubObjectRight.leftRight);	
		        	logger.info('  ■■■■   ■   ■   ■■■■■ machineId: ' + mSubObjectRight.machineId);	
		        	
		            if (result == 'NOOK') {            
			        	
			                    logger.debug('!! 오른쪽 방향에 있는 가장 가까운 lidar로 식별된 보트의 rssi 찾기...'); 
			            
			                    // 왼쪽(오른쪽) 방향에 보트 식별시 가장 가까운 보트 찾기(보트 단말기 신호 기록)
			                    db.GetNextlidarBoatSearch(mSubObjectRight, function(result, mSubObjectRightRtn){ 
			                        if(result == "OK") {
			                            logger.info("범위내에 등록된 보트가 존재합니다.!!");
			                            logger.info("  boatMachineId : " + mSubObjectRightRtn.boatMachineId);
			                            logger.info("  rssi :" + mSubObjectRightRtn.rssi);
			                            
			                            mSubObjectRight.boatMachineId = mSubObjectRightRtn.boatMachineId;
			                            mSubObjectRight.rssi2 = mSubObjectRightRtn.rssi2;
			                            // 보트 정박 처리
			                            logger.info('!! 찾은 보트가 정박 상태 인지 확인...'); 
			                            db.GetBoatInAnchor( mSubObjectRight, function(rtn){  //status = 1 정박
			                                if (rtn == 'OK') {
			                                    logger.info('이미 정박된 보트임2'); 
			                                    callback(null, "OK", mSubObjectRight);  
			                                } else if (rtn == 'NOOK') {
			                                    logger.info('정박된 보트 없음2'); 
			                                    callback(null, "NOOK", mSubObjectRight);  
			                                } else {
			                                    logger.error('보트 찾기시 오류2'); 
			                                    callback(null, "ERROR", mSubObjectRight);  
			                                }        
			                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
			                        } else {
			                            logger.info(" 오른쪽(왼쪽) 방향에 보트 식별시 가장 가까운 보트 찾기 실폐");
		                                callback(null, "ERROR", mSubObjectRight);  
			                        }
			                    	
			                    });                  //기준 시간 범위내 단말기 수신 정보 찾기
		            } else {
		            	
		            }
		        },
		       function(result, mSubObjectRight, callback) {
		        	logger.info(" 최종 판정:" + result);
		        	logger.info(" mSubObjectRight rssi:" + mSubObjectRight.rssi);
		        	logger.info(" mSubObjectRight rssi2:" + mSubObjectRight.rssi2);
		                if(result == "NOOK") {
		                	
		                	if(mSubObjectRight.rssi > mSubObjectRight.rssi2) {
		                        logger.info("※※※※※ 결과 - 미등록 보트1");  // 정박지에 설정
	                            db.SetBoatAnchor("0", mSubObjectRight, function(rtn){  //불법정박
	                                logger.info("SetBoatAnchor result3:" + rtn);
	                                if (rtn == 'OK') {
	                                    logger.info('보트 정박 처리 성공3'); 
	    		                        callback(null, "OK", mSubObjectRight);  
	                                } else {
	                                    logger.info('보트 정박 처리 실패3'); 
	    		                        callback(null, "ERROR", mSubObjectRight);  
	                                }                                  
	                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
		                	} else if(mSubObjectRight.rssi <= mSubObjectRight.rssi2) {
		                        logger.info("※※※※※ 결과 - 등록 보트1");
	                            db.SetBoatAnchor("1", mSubObjectRight, function(rtn){  //정상정박
	                                logger.info("SetBoatAnchor result3:" + rtn);
	                                if (rtn == 'OK') {
	                                    logger.info('보트 정박 처리 성공3'); 
	    		                        callback(null, "OK", mSubObjectRight);  
	                                } else {
	                                    logger.info('보트 정박 처리 실패3'); 
	    		                        callback(null, "ERROR", mSubObjectRight);  
	                                }                                  
	                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
		                	}
		                } else {
		                    logger.info(" 오른쪽(왼쪽) 방향에 보트 식별시 가장 가까운 보트 찾기 실폐");
                            db.SetBoatAnchor("1", mSubObjectRight, function(rtn){  // 보트가 정박되지 않음
                                logger.info("SetBoatNotAnchor result3:" + rtn);
                                if (rtn == 'OK') {
                                    logger.info('보트 정박 처리 성공3'); 
    		                        callback(null, "OK", mSubObjectRight);  
                                } else {
                                    logger.info('보트 정박 처리 실패3'); 
    		                        callback(null, "ERROR", mSubObjectRight);  
                                }                                  
                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
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
       
        if ((sShipLeftYn == "1")) { //lidar 왼쪽에 정박한 경우 
		    
		    async.waterfall([
		        function(callback) {
		            db.GetRegAnchorMachindId(mObject, function(rtn){
			            if (rtn == 'OK') {
			                //최근 정박 이력 확인
			    			db.SetLidarData(sData, function(rtn){;    
				    			if (rtn == 'OK') {
		//			                logger.debug('등록된 단말기 있음'); 
					                callback(null, "OK", mObject);  
				    			} else {
		//			                logger.debug('등록된 단말기 있음'); 
					                callback(null, "ERROR", mObject);  
				    			}
			    			});
			            } else {
			                logger.debug('등록된 단말기 없음'); 
			                callback(null, "ERROR", mObject);  //
			            }   
			        });          	
		        },
		        function(result, mObject, callback) {
		        	
		            if (result == 'OK') {            
		        	
		            	mSubObjectLeft.marinaId = mObject.marinaId;   //마리나 ID      
		            	mSubObjectLeft.machineId = mObject.machineId;  //보트단말기 ID     
		                mSubObjectLeft.sendTime = mObject.sendTime;   // 전송일시     
		                mSubObjectLeft.boatId = "";  //보트 ID     
		                mSubObjectLeft.boatMachineId =  "";  // MQTT에서 전달 받은 GPS 위도 
		                mSubObjectLeft.rssi = 0.0;  // MQTT에서 전달 받은 GPS 경도
		                
	                    logger.debug('!! 왼쪽 라이더에  단말기 수신 정보 찾기중...'); 
	                    mSubObjectLeft.leftRight = '0';    // 좌
	            
	                    // 왼쪽  방향에 보트 식별시 가장 가까운 보트 찾기(보트 단말기 신호 기록)
	                    db.GetlidarNearBoatSearch(mSubObjectLeft, function(result, mSubObjectLeftRtn){ 
	                        if(result == "OK") {
	                            logger.info("범위내에 등록된 보트가 존재합니다.!!");
	                            logger.info("  boatMachineId : " + mSubObjectLeftRtn.boatMachineId);
	                            logger.info("  rssi :" + mSubObjectLeftRtn.rssi);
	                            logger.info(' ＆＆＆＆＆＆＆＆  leftRight: ' + mSubObjectLeft.leftRight);	

	                            mSubObjectLeft.boatMachineId = mSubObjectLeftRtn.boatMachineId;
	                            mSubObjectLeft.rssi = mSubObjectLeftRtn.rssi;
	                            // 보트 정박 처리
	                            logger.info('!! 찾은 보트가 정박 상태 인지 확인...'); 
	                            db.GetBoatInAnchor( mSubObjectLeft, function(rtn){  //status = 1 정박
	                                if (rtn == 'OK') {
	                                    logger.info('이미 정박된 보트임3'); 
	                                    callback(null, "OK", mSubObjectLeft);  
	                                } else if (rtn == 'NOOK') {
	                                    logger.info('정박된 보트 없음3'); 
	                                    callback(null, "NOOK", mSubObjectLeft);  
	                                } else {
	                                    logger.error('보트 찾기시 오류3'); 
	                                    callback(null, "ERROR", mSubObjectLeft);  
	                                }        
	                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
	                        } else {
	                            logger.info(" 왼쪽 방향에 보트 식별시 가장 가까운 보트 찾기 실폐");
                                callback(null, "ERROR", mSubObjectLeft);  
	                        }
	                    });                  //기준 시간 범위내 단말기 수신 정보 찾기
	        

		            }
		        },
		       function(result, mSubObjectLeft, callback) {
		        	
		        	logger.info('  ■■■■   ■   ■   ■■■■■ leftRight: ' + mSubObjectLeft.leftRight);	
		        	logger.info('  ■■■■   ■   ■   ■■■■■ machineId: ' + mSubObjectLeft.machineId);	

		        	
		            if (result == 'NOOK') {            
			        	
			                    logger.debug('!! 왼쪽 방향에 있는 가장 가까운 lidar로 식별된 보트의 rssi 찾기...'); 
			            
			                    // 왼쪽(오른쪽) 방향에 보트 식별시 가장 가까운 보트 찾기(보트 단말기 신호 기록)
			                    db.GetNextlidarBoatSearch(mSubObjectLeft, function(result, mSubObjectLeftRtn){ 
			                        if(result == "OK") {
			                            logger.info("범위내에 등록된 보트가 존재합니다.!!");
			                            logger.info("  boatMachineId : " + mSubObjectLeftRtn.boatMachineId);
			                            logger.info("  rssi :" + mSubObjectLeftRtn.rssi);
			                            
			                            mSubObjectLeft.boatMachineId = mSubObjectLeftRtn.boatMachineId;
			                            mSubObjectLeft.rssi2 = mSubObjectLeftRtn.rssi;
			                            // 보트 정박 처리
			                            logger.info('!! 찾은 보트가 정박 상태 인지 확인...'); 
			                            db.GetBoatInAnchor( mSubObjectLeft, function(rtn){  //status = 1 정박
			                                if (rtn == 'OK') {
			                                    logger.info('이미 정박된 보트임4'); 
			                                    callback(null, "OK", mSubObjectLeft);  
			                                } else if (rtn == 'NOOK') {
			                                    logger.info('정박된 보트 없음4'); 
			                                    callback(null, "NOOK", mSubObjectLeft);  
			                                } else {
			                                    logger.error('보트 찾기시 오류4'); 
			                                    callback(null, "ERROR", mSubObjectLeft);  
			                                }        
			                            });                  //기준 시간 범위내 단말기 수신 정보 찾기           
			                        } else {
			                            logger.info(" 왼쪽 방향에 보트 식별시 가장 가까운 보트 찾기 실폐");
		                                callback(null, "ERROR", mSubObjectLeft);  
			                        }
			                    	
			                    });                  //기준 시간 범위내 단말기 수신 정보 찾기
		            } else {
		            	
		            }
		        },
		       function(result, mSubObjectLeft, callback) {
		        	
		                if(result == "NOOK") {
		                	
		                	if(mSubObjectLeft.rssi > mSubObjectLeft.rssi2) {
		                        logger.info("※※※※※ 결과 - 미등록 보트2");
		                        callback(null, "OK", mSubObjectLeft);  
		                	} else if(mSubObjectLeft.rssi <= mSubObjectLeft.rssi2) {
		                        logger.info("※※※※※ 결과 - 등록 보트2");
		                        callback(null, "OK", mSubObjectLeft);  
		                	}
		                } else {
		                    logger.info(" 왼쪽방향에 보트 식별시 가장 가까운 보트 찾기 실폐");
		                    callback(null, "ERROR", mSubObjectLeft);  
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
    };
        
};


//객체를 바로 module.exports에 할당
module.exports = LidarCheck;

/***
var LidarCheck = require('./lidar');
var lidarCheck = new LidarCheck(message); 

lidarCheck.getLidarCheck();

***/

