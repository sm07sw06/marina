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
//var mObject = new MessageObject(); //메세지 구조체


function BoatCheck(message) {
    this.message = message;
}


//보트 GPS의 위치가 출입구 구역에 있는지 판단 
function getAreaAnalysis(mObject) { 


    logger.debug("==================================");
    logger.debug('Start getAreaAnalysis........'     );
    logger.debug('   marinaId :' + mObject.marinaId  );
    logger.debug('   machineId:' + mObject.machineId );
    logger.debug('   boatId   :' + mObject.boatId    );
    logger.debug('   gradex   :' + mObject.gradex    );
    logger.debug('   gradey   :' + mObject.gradey    );
    logger.debug('   latitude :' + mObject.latitude  );
    logger.debug('   longitude:' + mObject.longitude );
    logger.debug('   sendTime :' + mObject.sendTime  );    
    logger.debug("==================================");
    
   // mObject.gradex = 100;         // LDH  GPS 구역내로 설정
   // mObject.gradey = 55;

    var db = new DB();
    var result;
    
    async.waterfall([
        function(callback) {
            logger.debug('!! 삼각측정에 의한 좌표 계산...'); 
            db.SetXY(mObject, function(rtn, mObject2){
                if (rtn == 'OK') {
                	mObject.x = mObject2.x;
                	mObject.y = mObject2.y;
                //	logger.debug('삼각측정에 의한 좌표 Update OK : '+mObject.x); //보트 입항중
                //	logger.debug('삼각측정에 의한 좌표 Update OK : '+mObject.y); //보트 입항중
                    callback(null,'OK', mObject);  
                } else {
                    callback(null, 'ERROR', mObject);   
                }   
            });     
        },
        function(result, mObject, callback) {
        	if(result == "OK") {
	           // logger.debug('!! 삼각측정에 의한 좌표 Update...'); 
	            db.SetXYUpdate(mObject, function(rtn){
	                if (rtn == 'OK') {
	           //         logger.debug('삼각측정에 의한 좌표 Update OK'); //보트출항중
                        callback(null,'OK', mObject);  
	                } else {
	                    logger.debug('삼각측정에 의한 좌표 Update Error'); //보트 입항중
	                    callback(null, 'ERROR', mObject);   
	                }   
	            });
        	} else {
        		callback(null, 'ERROR', mObject);   
        	}
        },        
        function(result, mObject, callback) {
        	if(result == "OK") {
	            logger.debug('!! 출입구역영역안에 있는지 판단중...'); 
	            db.SelectGateBound(mObject, function(rtn){
	                if (rtn == 'OK') {
	                    logger.debug('출입구역 영역안에 있슴'); //보트출항중
	                    //최근 정박 이력 확인
	                    logger.debug('!! 최근 정박 이력 확인중...'); 
	                    db.SelectLastAnchor(mObject, function(rtn){
	                        if (rtn == 'OK') {
	                            logger.debug('보트는 마지막으로 정박상태에 있었음...현재 출항중'); //보트출항중
	                            mObject.boatInout = '0' 
	                        } else {
	                            logger.debug('보트는 마지막으로 외부에 있었음...현재 입항중'); //보트출항중
	                            mObject.boatInout = '1' 
	                        }   
	                        callback(null,'GPS', mObject);  
	                    });    
	                } else if (rtn == 'NOTOK') {
	                    logger.debug('출입구역 영역밖에 있슴'); //보트출항중
	                    logger.debug('보트 이동중'); //보트 입항중
	                    mObject.boatInout = '9' 
	                    callback(null, 'OK', mObject);   
	                } else {
	                    logger.debug('출입구역 영역 확인 요류'); //보트출항중
	                    mObject.boatInout = '9' 
	                    callback(null, 'ERROR', mObject);   
	                }   
	            });
        	} else {
        		callback(null, 'ERROR', mObject);   
        	}
        },
        function(result, mObject, callback) {
            logger.debug("==================================");
            logger.debug('!! 보트 일출항 이력 갱신중...'); 
            logger.debug('   marinaId  :' + mObject.marinaId);
            logger.debug('   machineId :' + mObject.machineId);
            logger.debug('   sendTime  :' + mObject.sendTime);
            logger.debug('   boatInout :' + mObject.boatInout);
            logger.debug('   gradex    :' + mObject.gradex  );
            logger.debug('   gradey    :' + mObject.gradey );
            logger.debug('   latitude  :' + mObject.latitude  );
            logger.debug('   longitude :' + mObject.longitude );  
            logger.debug("==================================");
            
            if (result == 'OK' ) {
	            // 보트 일출항 이력 갱신
	            db.UpdateBoatHist(mObject, function(rtn){
	                if (rtn == 'OK' ) {
	                    logger.debug('정박상태 확인3'); 
	                    callback(null, result, mObject); 
	                    //최근 정박 이력 확인
	                } else {
	                    logger.debug('보트단말기 정박상태 분석3'); //보트단말기 정박상태 분석2
	                    callback(null,'ERROR', rtn); 
	                }   
	            });  
            }
        },
        function(result, mObject, callback) {
            
            if(result != "ERROR") {
//	            if(result == "GPS") {
	                // 대쉬보드에 현재 운항 상태 적용
	                logger.debug("==================================");
	                logger.debug('!! 대쉬보드에 현재 운항 상태 적용중2...'); 
	                logger.debug('   marinaId  :' + mObject.marinaId);
	                logger.debug('   machineId :' + mObject.machineId);
	                logger.debug('   sendTime  :' + mObject.sendTime);
	                logger.debug('   boatInout :' + mObject.boatInout);
	                logger.debug('   gradex    :' + mObject.gradex  );
	                logger.debug('   gradey    :' + mObject.gradey );              
	                logger.debug('   latitude  :' + mObject.latitude  );
	                logger.debug('   longitude :' + mObject.longitude );              
	                logger.debug("==================================");
	                // 대쉬보드에 현재 운항 상태 적용
	                db.SetDashBoard(mObject, function(rtn){
	                    if (rtn == 'OK') {
	                        //최근 정박 이력 확인
	                        logger.debug('데쉬보드 적용 완료'); 
	                        callback(null, "OK");  
	                    } else { 
	                        logger.debug('데쉬보드 적용 오류1-1'); //보트단말기 정박상태 분석2
	                        callback(null, "ERROR");  //
	                    }   
	                });
	            } 
	                
//            } else {
//               logger.debug('데쉬보드 적용 오류1-2'); //보트단말기 정박상태 분석2
//                callback(null, "ERROR");  //
//            }   
        }
    ],
    function (err, result) {
        if(err){
            console.log('Error ');
            throw( err );
        }  
    });
}


BoatCheck.prototype.getBoatCheck = function() {
    
    var mObject  = new MessageObject(); //메세지 구조체
    var mObject2 = new MessageObject(); //메세지 구조체

    logger.debug('Start getBoatCheck........');

    var sData = this.message;  // MQTT에서 보내온 메세지

    mObject.marinaId     = 1;
    mObject.machineId    = sData[9];
    mObject.sendTime     = sData[15];
    mObject.temperature  = sData[16];
    mObject.humidity     = sData[17];
    mObject.gradex       = sData[18];
    mObject.gradey       = sData[19];
    mObject.latitude     = sData[22];
    mObject.latitudeDir  = sData[23];
    mObject.longitude    = sData[24];
    mObject.longitudeDir = sData[25];
    var gps_qual         = sData[26];
    
//  if(gps_qual == '1') {
    if('1' == '1') {
	    
	    logger.debug("==================================");
	    logger.debug('   marinaId     :' + mObject.marinaId    );
	    logger.debug('   machineId    :' + mObject.machineId   );
	    logger.debug('   sendTime     :' + mObject.sendTime    );
	    logger.debug('   temperature  :' + mObject.temperature );
	    logger.debug('   humidity     :' + mObject.humidity    );
	    logger.debug('   gradex       :' + mObject.gradex      );
	    logger.debug('   gradey       :' + mObject.gradey      );
	    logger.debug('   latitude     :' + mObject.latitude    );
	    logger.debug('   latitudeDir  :' + mObject.latitudeDir );
	    logger.debug('   longitude    :' + mObject.longitude   );
	    logger.debug('   longitudeDir :' + mObject.longitudeDir);
	    logger.debug('   gps qual     :' + mObject.latitude    );
	    logger.debug("==================================");
	
	    if(mObject.temperature == "") { mObject.temperature = 0; }
	    if(mObject.humidity    == "") { mObject.humidity    = 0; }
	    if(mObject.gradex      == "") { mObject.gradex      = 0; }
	    if(mObject.gradey      == "") { mObject.gradey      = 0; }
	    if(mObject.latitude    == "") { mObject.latitude    = 0; }
	    if(mObject.longitude   == "") { mObject.longitude   = 0; }
	
	    //mObject.gradex = 70; //LDH
		
	    var db = new DB();
	   
	    db.GetRegBoatMachindId(mObject, function(rtn){
	        if (rtn == 'OK') {
				logger.debug('등록된 보트 디바이스임'); 
				db.SetBoatData(sData, function(rtn){;    // 
					if (rtn == 'OK') {
						if ((Math.abs(mObject.gradex) > global.grade) || (Math.abs(mObject.gradey) > global.grade)) { //기울기가 60도 이상이면 보트가 좌초하는 경우로 자동 SOS 요청신호로 간주
							logger.debug('!! SOS 신호 처리중...'); 
							db.SetSOS(mObject, function(rtn) {
								if (rtn == 'OK') {
									//최근 정박 이력 확인
									logger.debug('SOS 완료'); 
								} else {
									logger.debug('SOS 오류'); //보트단말기 정박상태 분석2
								}   
							});  
						} else {
							getAreaAnalysis(mObject); //GPS위치가 출입구 구역인지 확인
						}
					} else {
						;;
					}
				 });    				
	        } else {
	            logger.debug('등록된 보트 디바이스 아님'); //보트단말기 정박상태 분석2
	        }   
	    });    
    }
	    
};



//객체를 바로 module.exports에 할당
module.exports = BoatCheck;

/***
var BoatCheck = require('./boatCheck');
var boatCheck = new BoatCheck(message); 

boatCheck.getBoatCheck();

***/

