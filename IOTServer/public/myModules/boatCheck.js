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
    var anchorId;   // 정박지단말기 ID  
    var leftRight;  // 좌우구분  좌우구분 (0:좌, 1:우)
    var boatInout;  // 입출항구분  
    var gradex;  // MQTT에서 전달 받은 GPS 위도 
    var gradey;  // MQTT에서 전달 받은 GPS 경도
    var latitude;   // 위도
    var longitude;  // 경도
    var cctv_cd  ;  // cctv
    var photo_base64; //전송이미지 텍스트
    var last_upd_tm;  //최종수정시각
}
//var mObject = new MessageObject(); //메세지 구조체


function BoatCheck(message) {
    this.message = message;
}


//보트 단말기 정박 상태 분석
/*******
function analysisBoatAnchor(mObject) { 

    logger.info("==================================");
    logger.info('Start analysisBoatAnchor........');
    logger.info('   marinaId :' + mObject.marinaId);
    logger.info('   machineId:' + mObject.machineId);
    logger.info('   Gradex:' + mObject.gradex);
    logger.info('   Gradey:' + mObject.gradey);
    logger.info("==================================");
    
//    mObject.gradex = 55;  //LDH
//    mObject.gradey = 99;

    var db = new DB(); 
    
    async.waterfall([
        function(callback) {
             
            try {
               db.SelectSectorBound(mObject, function(rtn){ //게류지 영역 확인
                    if (rtn == 'OK') {
                        logger.info('정박상태 확인1');
                        db.SelectAnchorYN(mObject, function(rtn){
                            if (rtn == 'OK') {
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
                        //  ;;
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
                logger.info('!! 대쉬보드에 현재 운항 상태 적용중1...'); 
                db.SetDashBoard(mObject, function(rtn){
                    if (rtn == 'OK') {
                        //최근 정박 이력 확인
                        logger.info('데쉬보드 적용 완료'); 
                        callback(null, mObject);  
                    } else {
                        logger.info('데쉬보드 적용 오류'); //보트단말기 정박상태 분석2
                        callback(null, rtn);  
                    }   
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
*****/

//보트 GPS의 위치가 출입구 구역에 있는지 판단 
function getAreaAnalysis(mObject) { 


    logger.info("==================================");
    logger.info('Start getAreaAnalysis........'     );
    logger.info('   marinaId :' + mObject.marinaId  );
    logger.info('   machineId:' + mObject.machineId );
    logger.info('   boatId   :' + mObject.boatId    );
    logger.info('   gradex   :' + mObject.gradex    );
    logger.info('   gradey   :' + mObject.gradey    );
    logger.info('   latitude :' + mObject.latitude  );
    logger.info('   longitude:' + mObject.longitude );
    logger.info('   sendTime :' + mObject.sendTime  );    
    logger.info("==================================");
    
    mObject.gradex = 100;         // LDH  GPS 구역내로 설정
    mObject.gradey = 55;

    var db = new DB();
    var result;
    
    async.waterfall([
        function(callback) {
            logger.info('!! 출입구역영역안에 있는지 판단중...'); 
            db.SelectGateBound(mObject, function(rtn){
                if (rtn == 'OK') {
                    logger.info('출입구역 영역안에 있슴'); //보트출항중
                    //최근 정박 이력 확인
                    logger.info('!! 최근 정박 이력 확인중...'); 
                    db.SelectLastAnchor(mObject, function(rtn){
                        if (rtn == 'OK') {
                            logger.info('보트는 마지막으로 정박상태에 있었음...현재 출항중'); //보트출항중
                            mObject.boatInout = '0' 
                        } else {
                            logger.info('보트는 마지막으로 외부에 있었음...현재 입항중'); //보트출항중
                            mObject.boatInout = '1' 
                        }   
                        callback(null,'GPS', mObject);  
                    });    
                } else {
                    logger.info('출입구역 영역밖에 있슴'); //보트출항중
                    logger.info('보트 이동중'); //보트 입항중
                    mObject.boatInout = '9' 
                    callback(null, 'OK', mObject);   
                }   
            });     
        },
        function(result, mObject, callback) {
            logger.info("==================================");
            logger.info('!! 보트 일출항 이력 갱신중...'); 
            logger.info('   marinaId  :' + mObject.marinaId);
            logger.info('   machineId :' + mObject.machineId);
            logger.info('   sendTime  :' + mObject.sendTime);
            logger.info('   boatInout :' + mObject.boatInout);
            logger.info('   gradex      :' + mObject.gradex  );
            logger.info('   gradey      :' + mObject.gradey );
            logger.info('   latitude  :' + mObject.latitude  );
            logger.info('   longitude :' + mObject.longitude );  
            logger.info("==================================");
            
            // 보트 일출항 이력 갱신
            db.UpdateBoatHist(mObject, function(rtn){
                if (rtn == 'OK' ) {
                    logger.info('정박상태 확인3'); 
                    callback(null, result, mObject); 
                    //최근 정박 이력 확인
                } else {
                    logger.info('보트단말기 정박상태 분석3'); //보트단말기 정박상태 분석2
                    callback(null,'ERROR', rtn); 
                }   
            });          
        },
        function(result, mObject, callback) {
            
            if(result != "ERROR") {
	            if(result == "GPS") {
	                // 대쉬보드에 현재 운항 상태 적용
	                logger.info("==================================");
	                logger.info('!! 대쉬보드에 현재 운항 상태 적용중2...'); 
	                logger.info('   marinaId  :' + mObject.marinaId);
	                logger.info('   machineId :' + mObject.machineId);
	                logger.info('   sendTime  :' + mObject.sendTime);
	                logger.info('   boatInout :' + mObject.boatInout);
	                logger.info('   gradex    :' + mObject.gradex  );
	                logger.info('   gradey    :' + mObject.gradey );              
	                logger.info('   latitude  :' + mObject.latitude  );
	                logger.info('   longitude :' + mObject.longitude );              
	                logger.info("==================================");
	                // 대쉬보드에 현재 운항 상태 적용
	                db.SetDashBoard(mObject, function(rtn){
	                    if (rtn == 'OK') {
	                        //최근 정박 이력 확인
	                        logger.info('데쉬보드 적용 완료'); 
	                        callback(null, "OK");  
	                    } else { 
	                        logger.info('데쉬보드 적용 오류1-1'); //보트단말기 정박상태 분석2
	                        callback(null, "ERROR");  //
	                    }   
	                });
	            } 
	                
            } else {
                logger.info('데쉬보드 적용 오류1-2'); //보트단말기 정박상태 분석2
                callback(null, "ERROR");  //
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


BoatCheck.prototype.getBoatCheck = function() {
    
    var mObject = new MessageObject(); //메세지 구조체

    logger.info('Start getBoatCheck........');

    var sData = this.message;  // MQTT에서 보내온 메세지

    mObject.marinaId    = 1;
    mObject.sendTime    = sData[0];
    mObject.machineId   = sData[9];
    mObject.temperature = sData[16];
    mObject.humidity    = sData[17];
    mObject.gradex      = sData[18];
    mObject.gradey      = sData[19];
    mObject.latitude    = sData[22];
    mObject.longitude   = sData[24];

    logger.info("==================================");
    logger.info('   marinaId   :' + mObject.marinaId)   ;
    logger.info('   machineId  :' + mObject.machineId   );
    logger.info('   sendTime   :' + mObject.sendTime    );
    logger.info('   temperature:' + mObject.temperature );
    logger.info('   humidity   :' + mObject.humidity    );
    logger.info('   gradex     :' + mObject.gradex      );
    logger.info('   gradey     :' + mObject.gradey      );
    logger.info('   latitude   :' + mObject.latitude    );
    logger.info('   longitude  :' + mObject.longitude   );
    logger.info("==================================");

    if(mObject.temperature == "") { mObject.temperature = 0; }
    if(mObject.humidity    == "") { mObject.humidity    = 0; }
    if(mObject.gradex      == "") { mObject.gradex      = 0; }
    if(mObject.gradey      == "") { mObject.gradey      = 0; }
    if(mObject.latitude    == "") { mObject.latitude    = 0; }
    if(mObject.longitude   == "") { mObject.longitude   = 0; }

    var db = new DB();

    db.GetRegBoatMachindId(mObject, function(rtn){
        if (rtn == 'OK') {
        	
			db.InsertDBBoatData(sData);    // LDH

    	   if ((mObject.gradex > global.grade) || (mObject.gradey > global.grade)) { //기울기가 60도 이상이면 보트가 좌초하는 경우로 자동 SOS 요청신호로 간주
    	        logger.info('!! SOS 신호 처리중...'); 
    	        db.SetSOS(mObject, function(rtn){
    	            if (rtn == 'OK') {
    	                //최근 정박 이력 확인
    	                logger.info('SOS 완료'); 
    	                callback(null, mObject);  
    	            } else {
    	                logger.info('SOS 오류'); //보트단말기 정박상태 분석2
    	                callback(null, rtn);  //
    	            }   
    	        });  
    	        // 대쉬보드에 현재 운항 상태 적용
    	        // 대쉬보드에 현재 운항 상태 적용
    	        /***
    	        logger.info('!! 대쉬보드에 현재 운항 상태 적용중4...'); 
    	        db.SetDashBoard(mObject, function(rtn){
    	            if (rtn == 'OK') {
    	                //최근 정박 이력 확인
    	                logger.info('데쉬보드 적용 완료'); 
    	                callback(null, mObject);  
    	            } else {
    	                logger.info('데쉬보드 적용 오류'); //보트단말기 정박상태 분석2
    	                callback(null, rtn);  //
    	            }   
    	        }); 
    	        ***/                
    	    } else {
    	        getAreaAnalysis(mObject); //GPS위치가 출입구 구역인지 확인
    	    }
        }   
    });  
    
 
    return {message: this.message};
};



//객체를 바로 module.exports에 할당
module.exports = BoatCheck;

/***
var BoatCheck = require('./boatCheck');
var boatCheck = new BoatCheck(message); 

boatCheck.getBoatCheck();

***/

