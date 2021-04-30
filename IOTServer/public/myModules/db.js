/*jshint esversion: 6 */
/*
 * PostgreSQL DB 처리
 */
const logger = require('../../config/winston');
var path   = require('path');
var async  = require('async');
var moment = require('moment');
const config = require('config');
const imageToBase64 = require('image-to-base64');


const { Pool } = require("pg");
//const { Pool, clientdb } = require("pg");
//const { sequelize } = require('../../database/models'); // db.sequelize

const pool = new Pool({
	user: config.get('development.username'),
	host: config.get('development.host'),
	database: config.get('development.database'),
	password: config.get('development.password'),
	port: config.get('development.port')
});
 
pool.on('error', function(error) { 
	console.log("328 ERROR!!" + error);
});



/**
 * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
 * @param str       : 체크할 문자열
 */
function isEmpty(str){
    if(typeof str == "undefined" || str == null || str == "")
        return true;
    else
        return false ;
}
 
/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param str           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
function nvl(str, defaultStr){
    if(typeof str == "undefined" || str == null || str == "")
        str = defaultStr ;
    return str ;
}
	
//const pgp= require("pg-promise")({});
//const db= pgp(databaseConfig);

/**
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
var mObject = new MessageObject(); //메세지 구조체


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
}


**/


function ConfigObject()
{ 
	var weather_url; 
	var weather_point; 
}
var configMy  = new ConfigObject(); //메세지 구조체


// MQTT에서 전달된 메세지를 인자로 받음
function DB() {
	var message ;
}

//정박지 데이터 분석 처리
function getCalcRssiDistance(rssi) {
	
	var c = 256 ;  //전파속도 256kbps
	var f = 2.405; //주파수 2.405GHz
	var dist = 0;
	
	var dist = (c / (4 * 3.14 * f)) * Math.pow(10,(rssi/20));
	
	return dist/10;   // LDH   mm -> m
}

//정박지 데이터 분석 처리
function rssidataInsert(sData) {
	
	var marinaId     = 1;
	var machineId    = sData[0];  //정박단말기ID
	var sendTime 	 = sData[1];  //전송시각
	var machineNm    = sData[2];  //정박단말기명
	var transId      = sData[3];  //중계기ID
	var boatId    	 = sData[4];  //보트ID
	
//    if(typeof sData[7] == "undefined" ) {		// LDH
//		logger.debug('undefined........');
//		var sendRecvTime = sData[1];  //보트전송기각
//		var rssi    	 = sData[5];  //rssi
//	} else {
//		logger.debug('not undefined.......');
		var sendRecvTime = sData[5];  //보트전송기각
		var rssi    	 = sData[6];  //rssi
//	}

	if(rssi == "")  { rssi = 0; }

	if( rssi > 0 ) {
		
		logger.debug("----------------------------------");
		logger.debug('Start rssidataInsert insert........');
		logger.debug("  length      :" + sData.length);
	    logger.debug("  marinaId    :"+marinaId);
	    logger.debug("  machineId   :"+machineId);
	    logger.debug("  machineNm   :"+machineNm);
	    logger.debug("  sendTime    :"+sendTime);   
	    logger.debug("  transId     :"+transId);
	    logger.debug("  boatId      :"+boatId);
	    logger.debug("  sendRecvTime:"+sendRecvTime);
	    logger.debug("  rssi        :"+rssi);
		logger.debug("----------------------------------");
	
		
		// 아래와 같이 .query 로 쿼리를 날릴 수 있다
		var sQueryString  = "INSERT INTO /* rssidataInsert */ public.tb_rssidata(marina_id, machine_id, send_time, machine_nm, trans_id, boat_machine_id, send_recv_time, rssi)  \n";
		    sQueryString += "values(1,'" + machineId + "','"  + sendTime + "','"  + machineNm + "','"  + transId + "','"  + boatId + "','"  + sendRecvTime + "',"  + rssi + "  );  \n";
		logger.debug(sQueryString);
	
	    try {

			pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						//callback('ERROR');
				    } else {
				    	logger.debug("Rssidata Insert OK:");
				    }
					clientdb.release();
				}); 
			}); 
	
	    } catch (e) {
			logger.error("ERROR:"+err);
			//callback('ERROR');
		}
	
	}	 
}



//DB.prototype.getDB = function() {
//	return {message: this.message};
//}


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.SetDB = function(message) {
	this.message = message;
};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.InsertDBRssiData = function(message) {
	rssidataInsert(message);
};


// 환경변수값 추출
DB.prototype.GetConfig = function (configMy, callback) {

	logger.debug("----------------------------------");
	logger.debug('Start GetConfig........');
	logger.debug("----------------------------------");

	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT /* GetConfig */ c.weather_url, m.weather_point\n";
	    sQueryString += "  FROM tb_marina m, tb_config c   \n";
	    sQueryString += " WHERE m.marina_id = c.curr_marina" ;
	
	logger.debug(sQueryString);

	try {	
		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					if( res.rowCount > 0 ) {
						for(var i = 0; i < res.rowCount ; i ++) {
							configMy.weather_url   = res.rows[i].weather_url;
							configMy.weather_point = res.rows[i].weather_point;
						}						
						callback("OK", configMy);
					} else {
						callback("ERROR", null);
					}
			    }
				clientdb.release();
			});
		}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

};



//등록된 만말기 인지 확인 
DB.prototype.GetRegBoatMachindId = function (mObject, callback) {

//	logger.debug("----------------------------------");
//	logger.debug('Start GetRegBoatMachindId........');
//	logger.debug('  marinaId  : ' + mObject.marinaId);
//	logger.debug('  machineId : ' + mObject.machineId);
//	logger.debug("----------------------------------");

	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT /* GetRegBoatMachindId */ machine_id  \n";
	    sQueryString += "  FROM tb_boat_device   \n";
	    sQueryString += " WHERE marina_id = " + mObject.marinaId +  " AND machine_id = '" + mObject.machineId + "' " ;
	
//	logger.debug(sQueryString);

	try {	
		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					if( res.rowCount > 0 ) {
						logger.debug("등록된 보트단말기 있음.........!!");
						callback('OK');
					} else {
						logger.debug("등록된 보트단말기 없음........!!" + mObject.machineId);
						callback('ERROR');
					}
			    }
				clientdb.release();
			});
		}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

};



//보트 데이터 분석 처리
DB.prototype.SetBoatData = function (sData, callback) {	

	var sId           = sData[9];
	var ssend_time    = sData[15];
	var nTemperature  = sData[16];
	var nHumidity     = sData[17];
	var nGradex       = sData[18];
	var nGradey       = sData[19];
	var nGpsquality   = sData[26];  
	var nLatitude     = sData[22];
	var sLatitudeDir  = sData[23];
	var nLongitude    = sData[24];
	var sLongitudeDir = sData[25];
	var nSatellite    = sData[27];
	var nGpsage       = sData[33];
	var sSenttype     = sData[14];

 
	logger.debug("----------------------------------");
	logger.debug('Start SetBoatData insert........');
	logger.debug("  sData        :" + sData        );	
	logger.debug("  sId          :" + sId          );	
	logger.debug("  nTemperature :" + nTemperature );	
	logger.debug("  nHumidity    :" + nHumidity    );	
	logger.debug("  nGradex      :" + nGradex      );	
	logger.debug("  nGradey      :" + nGradey      );	
	logger.debug("  nGpsquality  :" + nGpsquality  );	
	logger.debug("  nLatitude    :" + nLatitude    );	
	logger.debug("  sLatitudeDir   :" + sLatitudeDir   );	
	logger.debug("  nLongitude   :" + nLongitude   );	
	logger.debug("  sLongitudeDir  :" + sLongitudeDir  );	
	logger.debug("  nSatellite   :" + nSatellite   );	
	logger.debug("  nGpsage      :" + nGpsage      );	
	logger.debug("  sSenttype    :" + sSenttype    );	
	logger.debug("  ssend_time   :" + ssend_time   );
	logger.debug("----------------------------------");

	if(nTemperature == "") { nTemperature = 0; }
	if(nHumidity    == "") { nHumidity    = 0; }
	if(nTemperature == "nan") { nTemperature = 0; }
	if(nHumidity    == "nan") { nHumidity    = 0; }
	if(nGradex      == "") { nGradex      = 0; }
	if(nGradey      == "") { nGradey      = 0; }
	if(nGpsquality  == "") { nGpsquality  = 0; }
	if(nLatitude    == "") { nLatitude    = 0; }
	if(nLongitude   == "") { nLongitude   = 0; }
	if(nSatellite   == "") { nSatellite   = 0; }
	if(nGpsage      == "") { nGpsage      = 0; }
	if(sSenttype    == "") { sSenttype    = 'R'; }


//아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "INSERT INTO tb_boatdata(marina_id, machine_id, temperature, humidity, gradex, gradey, gpsquality, latitude, longitude,latitude_direction, longitude_direction, satellite, gpsage, sent_type, send_time) \n ";
	sQueryString += " values(1,'" + sId + "',"  + nTemperature + ","  + nHumidity + ","  + nGradex + ","  + nGradey + ","  + nGpsquality + ","  + nLatitude + "," + nLongitude + ",'"  + sLatitudeDir + "','" + sLongitudeDir + "' ";
	sQueryString += ","  + nSatellite + ","  + nGpsage + ",'"  + sSenttype + "','"  + ssend_time + "' );  \n";
	logger.debug("[INSERT INTO tb_boatdata]:"+sQueryString);

	  try {

		  pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						callback('ERROR');
				    } else {
				    	logger.debug("Boatdata Insert OK:");
				    	callback('OK');
				    }
					clientdb.release();
				}); 
			}); 
	    } catch (err) {
			logger.error("ERROR:"+err);
			callback('ERROR');
		} 
}

//정박지 데이터 분석 처리
DB.prototype.SetLidarData = function (sData, callback) {	
	var sId       		= sData[00];
	var nAngleMin   	= sData[01];
	var nAngleMax 		= sData[02];
	var nLoadMin 		= sData[03];
	var nShipMax 		= sData[04];
	var nLoadThreshold 	= sData[05];
	var nShipThreshold 	= sData[06];
	var nTempo 			= sData[07];
	var nHuminity 		= sData[08];
	var ssend_time 		= sData[09];
	var nLoadLeftCount 	= sData[10];
	var nShipLeftCount 	= sData[11];
	var nLoadRightCount = sData[12];
	var nShipRightCount = sData[13];
	var sLoadLeftYn 	= sData[14];
	var sShipLeftYn 	= sData[15];
	var sLoadRightYn 	= sData[16];
	var sShipRightYn 	= sData[17];
	var sLongData  		= sData[18];

 if(nAngleMin       == "")  { nAngleMin       = 0; }
 if(nAngleMax       == "")  { nAngleMax       = 0; }
 if(nLoadMin        == "")  { nLoadMin        = 0; }
 if(nShipMax        == "")  { nShipMax        = 0; }
 if(nLoadThreshold  == "")  { nLoadThreshold  = 0; }
 if(nShipThreshold  == "")  { nShipThreshold  = 0; }
 if(nTempo          == "")  { nTempo          = 0; }
 if(nHuminity       == "")  { nHuminity        = 0; }
 if(nLoadLeftCount  == "")  { nLoadLeftCount  = 0; }
 if(nShipLeftCount  == "")  { nShipLeftCount  = 0; }
 if(nLoadRightCount == "")  { nLoadRightCount = 0; }
 if(nShipRightCount == "")  { nShipRightCount = 0; }

	logger.debug("----------------------------------");
	logger.debug('Start lidardata insert........');
	logger.debug("  sId                :" + sId               );
	logger.debug("  왼쪽에 보트 판단 여부        :" + sShipLeftYn       );
	logger.debug("  오른쪽에 보트 판단 여부      :" + sShipRightYn      );
	logger.debug("  온도                            :" + nTempo            );
	logger.debug("  습도                            :" + nHuminity         );
//	logger.debug("  nAngleMin          :" + nAngleMin         );
//	logger.debug("  nAngleMax          :" + nAngleMax         );
//	logger.debug("  nLoadMin           :" + nLoadMin          );
//	logger.debug("  nShipMax           :" + nShipMax          );
//	logger.debug("  nLoadThreshold     :" + nLoadThreshold    );
//	logger.debug("  nShipThreshold     :" + nShipThreshold    );
//	logger.debug("  ssend_time         :" + ssend_time        );
//	logger.debug("  nLoadLeftCount     :" + nLoadLeftCount    );
//	logger.debug("  nShipLeftCount     :" + nShipLeftCount    );
//	logger.debug("  nLoadRightCount    :" + nLoadRightCount   );
//	logger.debug("  nShipRightCount    :" + nShipRightCount   );
//	logger.debug("  sLoadLeftYn        :" + sLoadLeftYn       );
//	logger.debug("  sLoadRightYn       :" + sLoadRightYn      );
//	logger.debug("  sLongData          :" + sLongData         );
	logger.debug("----------------------------------");

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString = "INSERT INTO public.tb_lidardata(marina_id, machine_id,angle_min,angle_max,load_min,ship_max,load_threshold,ship_threshold,temperature,huminity,send_time,  \n";
	sQueryString += " load_left_count,ship_left_count,load_right_count,ship_right_count,load_left_yn,ship_left_yn,load_right_yn,ship_right_yn,etcdata)  \n";
	sQueryString += " values(1,'" + sId + "',"  + nAngleMin + ","  + nAngleMax + ","  + nLoadMin + ","  + nShipMax + ","  + nLoadThreshold + ","  + nShipThreshold  ;
	sQueryString += ", " + nTempo + ","  + nHuminity + ",'"  + ssend_time ;
	sQueryString += "', " + nLoadLeftCount + ","  + nShipLeftCount + ","  + nLoadRightCount + ","  + nShipRightCount + ",'"  + sLoadLeftYn + "','"  + sShipLeftYn + "','"  + sLoadRightYn + "','"  + sShipRightYn + "','"  + sLongData + "' )  \n" ;
	logger.debug(sQueryString);

 try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
			    	logger.debug("Lidardata Insert OK:");
			    	callback('OK');
			    }
				clientdb.release();
			});
		}); 
 } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
		
}



//등록된 라이더장치 인지 확인 
DB.prototype.GetRegAnchorMachindId = function (mObject, callback) {

	logger.debug("----------------------------------");
	logger.debug('Start GetRegAnchorMachindId........');
	logger.debug('  marinaId  : ' + mObject.marinaId);
	logger.debug('  machineId : ' + mObject.machineId);
	logger.debug("----------------------------------");

	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT /* GetRegAnchorMachindId */ machine_id  \n";
	    sQueryString += "  FROM tb_anchor_lidar   \n";
	    sQueryString += " WHERE marina_id = " + mObject.marinaId +  " AND machine_id = '" + mObject.machineId + "' " ;
	
 	logger.debug(sQueryString);

	try {	
		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					if( res.rowCount > 0 ) {
						logger.debug("등록된 정박지단말기 있음.........!!");
						callback('OK');
					} else {
						logger.debug("등록된 정박지단말기 없음........!!");
						callback('ERROR');
					}
			    }
				clientdb.release();
			});
		}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
//출입구역영역안에 있는지 판단
DB.prototype.SelectGateBound = function (mObject, callback) {

	logger.debug("----------------------------------");
	logger.debug('Start SelectGateBound........');
	logger.debug('  marinaId : ' + mObject.marinaId);
	logger.debug('  GPS X    : ' + mObject.latitude);
	logger.debug('  GPS Y    : ' + mObject.longitude);
	logger.debug("----------------------------------");
	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT /* SelectGateBound */ sector_nm  \n";
	    sQueryString += "  FROM tb_anchor_sector   \n";
	    sQueryString += " WHERE marina_id = " + mObject.marinaId + " AND sectorarea_cd = 'Z' AND gpsx1 <= " + mObject.latitude + " AND gpsx2 >= " + mObject.latitude + "  \n" ;
	    sQueryString += "   AND gpsy1 <= " + mObject.longitude + " AND gpsy2 >= " + mObject.longitude ;
	
	logger.debug(sQueryString);

	try {	
		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					if( res.rowCount > 0 ) {
						logger.debug("GPS 출입영역 안에 있음.........!!");
						callback('OK');
					} else {
						logger.debug("GPS 출입영역 밖에 있음........!!");
						callback('ERROR');
					}
			    }
				clientdb.release();
			});
		}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

};


//기 정박상태 인지 확인
DB.prototype.SelectAnchorYN = function(mObject, callback) {
	
	logger.debug("----------------------------------");
	logger.debug('Start SelectAnchorYN........');
	logger.debug('  marina_id: '  + mObject.marinaId);
	logger.debug('  machine_id: ' + mObject.machineId);
	logger.debug("----------------------------------");

	try {
		//	var sQueryString  = "SELECT anchor.anchor_status FROM tb_anchor_lidar LEFT JOIN anchor  ON anchor_lidar.anchor_id = anchor.anchor_id WHERE anchor_lidar.machine_id = '" + mObject.machineId + "'";
		var sQueryString  = "SELECT /* SelectAnchorYN */ 1 FROM tb_anchor_lidar  \n WHERE marina_id = " + mObject.marinaId + " AND machine_id = '" + mObject.machineId + "'"; //  
		logger.debug(sQueryString);

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					if( res.rowCount > 0 ) {
						callback('OK');
					} else {
						callback('ERROR');
					}
			    }
				clientdb.release();
			});
		}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
	 
};



//최근 정박 이력 확인(입항 내역이 있는지 확인)
DB.prototype.SelectLastAnchor = function(mObject, callback) {
	
	logger.debug("----------------------------------");
	logger.debug('Start SelectLastAnchor........'    );
	logger.debug('  marinaId :' + mObject.marinaId   );
	logger.debug('  machineId:' + mObject.machineId  );
	logger.debug('  Sendtime :' + mObject.sendTime   );
	logger.debug("----------------------------------");

	try {
		/***
		var sQueryString  = "SELECT /-* SelectLastAnchor *-/ a.boat_id  \n";  
		    sQueryString += "  FROM tb_boat_hist a, tb_boat_device b \n";
		    sQueryString += " WHERE a.marina_id = " + mObject.marinaId + " \n";
		    sQueryString += "   AND a.marina_id = b.marina_id \n";
		    sQueryString += "   AND a.boat_id = b.boat_id \n";
		    sQueryString += "   AND a.boatinout = '1' -- 입항상태 \n";  // 입항상태
		    sQueryString += "   AND b.machine_id = '" + mObject.machineId + "' \n"
		    sQueryString += "   AND a.send_time  between to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') - interval '5 min'),'YYYYMMDDHH24MISS') \n";
		    sQueryString += "   AND to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS')),'YYYYMMDDHH24MISS')  \n";
		    sQueryString += " union all    \n";
		    ***/
		var sQueryString  = "SELECT  /* SelectLastAnchor */ a.boat_id  \n";
		    sQueryString += "  FROM public.tb_anchor a, tb_boat_device b \n";
		    sQueryString += " WHERE a.marina_id = " + mObject.marinaId + " \n";
		    sQueryString += "   AND a.anchor_status = '1' -- 정박상태 \n";  // 정박상태
		    sQueryString += "   AND a.marina_id = b.marina_id  \n";
		    sQueryString += "   AND a.boat_id = b.boat_id     \n";
		    sQueryString += "   AND b.machine_id = '" + mObject.machineId + "' \n";		

		logger.debug(sQueryString);

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					if( res.rowCount > 0 ) {
						callback('OK');
					} else {
						callback('ERROR');
					}
			    }
				clientdb.release();
			});
		}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
	 
};

//기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 GPS 영역 )
DB.prototype.GetGPSBoatDataSearch = function(mObject, callback) {
	var machine_id ;
	
	logger.debug("----------------------------------");
	logger.debug('Start GetGPSBoatDataSearch........');
	logger.debug('  marinaId : ' + mObject.marinaId);
	logger.debug('  sendTime : ' + mObject.sendTime);
	logger.debug("----------------------------------");

	try {		 
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
		var sQueryString = " SELECT /* GetGPSBoatDataSearch */ f.boat_id \n";
		sQueryString += "   FROM tb_boatdata e,tb_boat_device f, tb_anchor_sector s  \n";
		sQueryString += "  WHERE e.marina_id  = " + mObject.marinaId + " \n";
		sQueryString += "    AND e.marina_id  = f.marina_id  \n";
		sQueryString += "    AND e.machine_id = f.machine_id \n";
		sQueryString += "    AND e.marina_id  = s.marina_id \n";
		sQueryString += "    AND e.send_time between to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') - interval '1 min'),'YYYYMMDDHH24MISS') \n";
		sQueryString += "    AND to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') + interval '1 min'),'YYYYMMDDHH24MISS') \n";
		sQueryString += "    AND e.latitude BETWEEN s.gpsx1 AND s.gpsx2 AND e.longitude between s.gpsy1 AND s.gpsy2 \n";
		sQueryString += "    AND s.sectorarea_cd = 'Z' \n";
		    
		logger.debug("보트 찾기:" + sQueryString);

			pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						callback('ERROR');
				    } else {
						for(var i = 0; i < res.rowCount ; i ++) {
							mObject.boatId    = res.rows[i].boat_id;
							logger.debug("  boat_id   :" +res.rows[i].boat_id);   
						}
						if( res.rowCount > 0 && !isEmpty(res.rows[0].boat_id)) {
							logger.debug("기준 시간 GPS 범위내에 단말기 수신 정보가 있습니다." + res.rows[0].boat_id);
							callback("OK", mObject);
						} else {
							logger.debug("기준 시간 GPS 범위내에 단말기 수신 정보가 없습니다.");
							callback("ERROR", mObject);
						}
				    }
					clientdb.release();
				});
			}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
			
 
};



//기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
DB.prototype.GetAnchorBoatDataSearch = function(mObject, callback) {
	var machine_id ;
	
	logger.info("----------------------------------");
	logger.info('Start GetAnchorBoatDataSearch........');
	logger.info('  marinaId : ' + mObject.marinaId);
	logger.info('  machineId: ' + mObject.machineId);
	logger.info('  sendTime : ' + mObject.sendTime);
	logger.info('  leftRight: ' + mObject.leftRight);
	logger.info("----------------------------------");
/**
 * 
		var sQueryString  = "SELECT // GetAnchorBoatDataSearch /// AA.machine_id, AA.anchor_id, BB.boat_id \n";
		sQueryString += "  FROM  (  \n";
		sQueryString += "        SELECT b.machine_id, b.anchor_id, c.sector_id, d.gpsx1, d.gpsx2, d.gpsy1, d.gpsy2  \n";
		sQueryString += "          FROM tb_anchor_lidar b, tb_anchor c, tb_anchor_sector d  \n";
		sQueryString += "         WHERE 1 = 1   \n";
		sQueryString += "           AND b.machine_id = '" + mObject.machineId + "' \n";
		sQueryString += "           AND b.left_right = '" + mObject.leftRight + "' \n";
		sQueryString += "   		AND b.anchor_id = c.anchor_id \n ";
		sQueryString += "   		AND c.sector_id = d.sector_id  \n";
		sQueryString += "   		AND b.marina_id = c.marina_id  \n";
		sQueryString += "   		AND c.marina_id = d.marina_id  \n";
		sQueryString += "   		AND b.marina_id = " + mObject.marinaId + "  \n";
		sQueryString += " ) AA LEFT OUTER JOIN \n";
		sQueryString += " ( \n";
		sQueryString += " SELECT f.boat_id ,e.latitude, e.longitude \n";
		sQueryString += "   FROM tb_boatdata e,tb_boat_device f  \n";
		sQueryString += "  WHERE e.marina_id = " + mObject.marinaId + " \n";
		sQueryString += "    AND e.marina_id  = f.marina_id  \n";
		sQueryString += "    AND e.machine_id = f.machine_id \n";
		sQueryString += "    AND e.send_time between to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') - interval '1 min'),'YYYYMMDDHH24MISS') \n";
		sQueryString += "    AND to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') + interval '1 min'),'YYYYMMDDHH24MISS') \n";
		sQueryString += " ) BB ON BB.latitude  BETWEEN AA.gpsx1 AND AA.gpsx2 AND BB.longitude between AA.gpsy1 AND AA.gpsy2 \n";


 */
	try {		 
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
		var sQueryString  = "SELECT /* GetAnchorBoatDataSearch */ AA.machine_id, AA.anchor_id, BB.boat_id \n";
		sQueryString += "  FROM  (  \n";
		sQueryString += "        SELECT b.machine_id, b.anchor_id, c.sector_id, d.gpsx1, d.gpsx2, d.gpsy1, d.gpsy2 , d.posx1, d.posx2, d.posy1, d.posy2 \n";
		sQueryString += "          FROM tb_anchor_lidar b, tb_anchor c, tb_anchor_sector d  \n";
		sQueryString += "         WHERE 1 = 1   \n";
		sQueryString += "           AND b.machine_id = '" + mObject.machineId + "' \n";
		sQueryString += "           AND b.left_right = '" + mObject.leftRight + "' \n";
		sQueryString += "   		AND b.anchor_id = c.anchor_id \n ";
		sQueryString += "   		AND c.sector_id = d.sector_id  \n";
		sQueryString += "   		AND b.marina_id = c.marina_id  \n";
		sQueryString += "   		AND c.marina_id = d.marina_id  \n";
		sQueryString += "   		AND b.marina_id = " + mObject.marinaId + "  \n";
		sQueryString += " ) AA LEFT OUTER JOIN \n";
		sQueryString += " ( \n";
		sQueryString += " SELECT f.boat_id ,e.latitude, e.longitude, e.positionx, e.positiony  \n";
		sQueryString += "   FROM tb_boatdata e,tb_boat_device f  \n";
		sQueryString += "  WHERE e.marina_id = " + mObject.marinaId + " \n";
		sQueryString += "    AND e.marina_id  = f.marina_id  \n";
		sQueryString += "    AND e.machine_id = f.machine_id \n";
		sQueryString += "    AND e.send_time between to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') - interval '1 min'),'YYYYMMDDHH24MISS') \n";
		sQueryString += "    AND to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') + interval '1 min'),'YYYYMMDDHH24MISS') \n";
		sQueryString += " ) BB ON ((BB.latitude  BETWEEN AA.gpsx1 AND AA.gpsx2 AND BB.longitude between AA.gpsy1 AND AA.gpsy2 AND 1 = 0 ) or \n";
		sQueryString += "          (BB.positionx BETWEEN AA.posx1 AND AA.posx2 AND BB.positiony between AA.posy1 AND AA.posy2 AND 1 = 1)) \n";
		    logger.info("보트 찾기:" + sQueryString);

			pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						callback('ERROR');
				    } else {
						for(var i = 0; i < res.rowCount ; i ++) {
							mObject.machineId = res.rows[i].machine_id;
							mObject.boatId    = res.rows[i].boat_id;
							mObject.anchorId  = res.rows[i].anchor_id;
							logger.info("  machine_id:" +res.rows[i].machine_id);   
							logger.info("  boat_id   :" +res.rows[i].boat_id);   
							logger.info("  anchor_id :" +res.rows[i].anchor_id);   
						}
						if( res.rowCount > 0 && !isEmpty(res.rows[0].boat_id)) {
							logger.info("기준 시간 범위내에 단말기 수신 정보가 있습니다." + res.rows[0].boat_id);
							callback("OK", mObject);
						} else {
							logger.info("기준 시간 범위내에 단말기 수신 정보가 없습니다.");
							callback("ERROR", mObject);
						}
				    }
					clientdb.release();
				});
			}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
			

};



//보트 일출항 이력 갱신
DB.prototype.UpdateBoatHist = function(mObject, callback) {
	
	var machine_id ;
	
	logger.debug("----------------------------------");
	logger.debug('Start UpdateBoatHist........');
    logger.debug('   marinaId  : ' + mObject.marinaId);
	logger.debug('   machineId : ' + mObject.machineId);
	logger.debug('   sendTime  : ' + mObject.sendTime);
	logger.debug('   boatInout : ' + mObject.boatInout);
	logger.debug("----------------------------------");

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString = "SELECT /* UpdateBoatHist */ marina_id, boat_id FROM tb_boat_device WHERE machine_id = '" + mObject.machineId + "' limit 1 \n";
	logger.debug(sQueryString);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
			    	
					for(var i = 0; i < res.rowCount ; i ++) {
						mObject.boatId    = res.rows[i].boat_id;
						logger.debug(" boat_id   :" +res.rows[i].boat_id);   
					}

			    	sQueryString  = "INSERT INTO /* UpdateBoatHist */ public.tb_boat_hist(marina_id, boat_id,send_time,boatinout)  \n";
				    sQueryString += "values ( " + mObject.marinaId + ", "  + mObject.boatId + ", '"  + mObject.sendTime + "', '"  + mObject.boatInout + "')  \n";
				
				    logger.debug(sQueryString);

					clientdb.query(sQueryString, function (err, res) {
						if (err) {
							logger.error("ERROR!!" + err);
							callback('ERROR');
					    } else {
					    	callback('OK');
					    }
					}); 
			    }
				clientdb.release();
			}); 
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
};


//삼각측정에 의한 좌표 계산
DB.prototype.SetXY = function(mObject, callback) {
	
	var machine_id ;

	callback('OK',mObject);  //LDH
	
	/****
	
	var dist = [];
	var posx = 0.0; //기준점 X
	var posy = 0.0; //기준점 Y
	var posa = 0.0; //2차 기준점 위치
	var calx = 0.0;
	var caly = 0.0;
		
	logger.info("-------!@#$%!@#$%!@#$%!@#$%!@#$%!@#$%---------------------------");
	logger.debug('Start SetXY........');
    logger.debug('   marinaId  : ' + mObject.marinaId);
	logger.debug('   machineId : ' + mObject.machineId);
	logger.debug('   sendTime  : ' + mObject.sendTime);
	logger.debug("----------------------------------");

	
	// 보트 신호건에 대한 RSSI 값 3개 찾기 
	var sQueryString  = "SELECT  b.marina_id,b.machine_id,b.send_time, r.boat_machine_id, r.rssi, r.send_recv_time ,d.positionx,d.positiony,d.set_order,d.gate_class \n";
    	sQueryString += "  from tb_boatdata b, tb_rssidata r , tb_anchor_device d \n";
    	sQueryString += " WHERE b.machine_id = r.boat_machine_id  \n";
    	sQueryString += "   AND r.machine_id = d.machine_id  \n";
    	sQueryString += "   AND r.marina_id  = d.marina_id  \n";
    	sQueryString += "   AND b.send_time BETWEEN to_char((to_timestamp(r.send_recv_time, 'YYYYMMDDHH24MISS') - interval '4 sec'),'YYYYMMDDHH24MISS') \n";
    	sQueryString += "   AND to_char((to_timestamp(r.send_recv_time, 'YYYYMMDDHH24MISS') + interval '4 sec'),'YYYYMMDDHH24MISS')  \n";
    	sQueryString += "   AND b.marina_id  = "  + mObject.marinaId  + "  \n";
    	sQueryString += "   AND b.machine_id = '" + mObject.machineId + "' \n";
    	sQueryString += "   AND b.send_time  = '" + mObject.sendTime  + "' \n";
    	sQueryString += " ORDER by d.set_order \n";

    logger.debug("882:"+sQueryString);
	
    try {

        pool.connect(function (err, clientdb, done) {
            if (err) throw new Error(err);
            clientdb.query(sQueryString, function (err, res) {
                if (err) {
                    logger.error("ERROR!!" + err);
                    callback('ERROR', mObject);
                } else {
                    if( res.rowCount == 3 ) { 
                    	logger.debug("	RSSI 계산 시작...");
                        for(var i = 0; i < res.rowCount ; i ++) {
                        	
                        	if(res.rows[i].set_order == 1) {
                        		posx = Number(res.rows[i].positionx);
                        		posy = Number(res.rows[i].positiony);
                        		logger.debug('   posx : ' + posx);
                        		logger.debug('   posy : ' + posy);
                        	}
                        	if(res.rows[i].set_order == 2) {
                        		posa = Number(res.rows[i].positionx - posx);
                        		logger.debug('   posa : ' + posa);
                        	}
                        	
                        	// * RSSI값을 이용한 거리 게산
                        	// * d = (C/4pif)*10^(L/20)
                        	// *  res.rows[i].rssi;
                        	
                        	dist[i] = getCalcRssiDistance(res.rows[i].rssi);  //RSSI
                        }  
                    	logger.debug('   dist[0] : ' + dist[0]);
                    	logger.debug('   dist[1] : ' + dist[1]);
                    	logger.debug('   dist[2] : ' + dist[2]);

                        
                    	 //* 삼각 측정에의한 좌표 계산
                    	 
                        calx = (  Math.abs(Math.pow(dist[0],2) - Math.pow(dist[1],2) + Math.pow(posa,2) ) / (2 * posa) ); 
                        logger.debug("calx==:" + calx);
                        
                        if(( Math.pow(dist[0],2) - Math.pow(calx,2) ) == 0) {
                        	caly = 0;
                        } else {
                        	caly = Math.sqrt( Math.abs(Math.pow(dist[0],2) - Math.pow(calx,2)) );
                        }
                        logger.debug("caly:" + caly);
                        	
                        calx = Math.round((calx + posx),2);
                        caly = Math.round((caly + posy),2);
                        
                        logger.debug("calx:" + calx);
                        logger.debug("caly:" + caly);
                        
                    	mObject.x = calx; 
                    	mObject.y = caly;
                        logger.info("mObject.x:" + mObject.x);
                        logger.info("mObject.y:" + mObject.y);
                        
                    	callback('OK', mObject);                        
                    } else {
                    	logger.info("RSSI 건수 오류");
                        callback("ERROR", null);
                    }
                }
                clientdb.release();
            }); 
        }); 
    } catch (e) {
        logger.error("ERROR:"+err);
        callback('ERROR',mObject);
    }
    **/
};

DB.prototype.SetXYUpdate = function(mObject, callback) {
	
	var machine_id ;
	
	callback('OK',mObject);  //LDH
	
	/***
	logger.debug("----------------------------------");
	logger.debug('Start SetXYUpdate........');
    logger.debug('   marinaId  : ' + mObject.marinaId);
	logger.debug('   machineId : ' + mObject.machineId);
	logger.debug('   sendTime  : ' + mObject.sendTime);
	logger.debug('   x  : ' + mObject.x);
	logger.debug('   y  : ' + mObject.y);
	logger.debug("----------------------------------");


	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "UPDATE   public.tb_boatdata \n";
        sQueryString += "   SET positionx  = " + mObject.x + ", positiony = "  + mObject.y + " \n";
        sQueryString += " WHERE marina_id  = "  + mObject.marinaId  + "  \n";
        sQueryString += "   AND machine_id = '" + mObject.machineId + "' \n";
        sQueryString += "   AND send_time  = '" + mObject.sendTime  + "' \n";
	logger.debug(sQueryString);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR', mObject);
			    } else {
	    	
			    	callback('OK',mObject);
			    }
				clientdb.release();
			}); 
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR',mObject);
	}
    ***/
};

//계류지에 정박보트 설정
/*
 * status = 1 : 정상적인 정박
 * status = 0 : 불법 정박 
 */
DB.prototype.SetBoatAnchor = function(status, mObject, callback) {
	
	var machine_id ;
	 
	logger.info("----------------------------------");
	logger.info('Start SetBoatAnchor........');
	logger.info('   status  : ' + status          );
	logger.info('   marinaId: ' + mObject.marinaId);
	logger.info('   anchorId: ' + mObject.anchorId);
	logger.info('   boatId  : ' + mObject.boatId  );
	logger.info("----------------------------------");

 
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	if(status == '1') {
		var sQueryString  = "UPDATE /* SetBoatAnchor */ tb_ANCHOR a SET boat_id = " + mObject.boatId + ",anchor_status = '1' \n";
		    sQueryString += " WHERE a.marina_id = " + mObject.marinaId + "  \n";
		    sQueryString += "   AND a.anchor_id = (select b.anchor_id from tb_ANCHOR_lidar b where  b.marina_id = " + mObject.marinaId + " AND b.machine_id = '" + mObject.machineId + "' AND b.left_right = '" + mObject.leftRight + "') " ;
	} else {
		var sQueryString  = "UPDATE /* SetBoatAnchor */ tb_ANCHOR a SET boat_id = null ,anchor_status = '1'  \n";
			sQueryString += " WHERE a.marina_id = " + mObject.marinaId + " \n";
		    sQueryString += "   AND a.anchor_id = (select b.anchor_id from tb_ANCHOR_lidar b where  b.marina_id = " + mObject.marinaId + " AND b.machine_id = '" + mObject.machineId + "' AND b.left_right = '" + mObject.leftRight + "') " ;
	}

    logger.info(sQueryString);
    
    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					logger.info("Anchor Update OK:");
					callback('OK');			    	
			    }
				clientdb.release();
			}); 
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

};


//기준 시간 범위내 단말기 수신 정보 찾기
/* 보트가 정박 되지않음 
 *  
 */
DB.prototype.SetBoatNotAnchor = function(mObject, callback) {
	
	var machine_id ;
	
	logger.debug("----------------------------------");
	logger.debug('Start SetBoatNotAnchor........');
	logger.debug('   marinaId : ' + mObject.marinaId);
	logger.debug('   machineId: ' + mObject.machineId);
	logger.debug('   leftRight: ' + mObject.leftRight);
	logger.debug("----------------------------------");


	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "UPDATE /* SetBoatNotAnchor */ tb_ANCHOR a SET boat_id = 0, anchor_status = '0'   " ;
    sQueryString += " WHERE a.marina_id = " + mObject.marinaId + " AND a.anchor_id = (select b.anchor_id from tb_ANCHOR_lidar b where  b.marina_id = " + mObject.marinaId + " AND b.machine_id = '" + mObject.machineId + "' AND b.left_right = '" + mObject.leftRight + "') " ;

    logger.debug(sQueryString);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					logger.debug("Anchor Update OK:");
					callback('OK');			    	
			    }
				clientdb.release();
			}); 
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
	
};



//기준 시간 범위내 단말기 수신 정보 찾기
DB.prototype.SetUnregBoatIn = function(mObject, callback) {
	
	var machine_id ;
	
	logger.debug("----------------------------------");
	logger.debug('Start SetUnregBoatIn........');
	logger.debug('   marinaId : ' + mObject.marinaId);
	logger.debug('   sendTime : ' + mObject.sendTime);
	logger.debug('   boatInout : ' + mObject.boatInout);
	logger.debug('   cctv_cd : ' + mObject.cctv_cd);
 	logger.debug('   photo_base64 : ' + mObject.photo_base64);
	logger.debug("----------------------------------");

	var sQueryString = "";

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다

    try {

    	imageToBase64(mObject.photo_base64) // Path to the image
		    .then(
		        (response) => {
		        	sQueryString = "INSERT INTO tb_unreg_boatdata(marina_id, boatinout,send_time,photo_base64) \n";
		        	sQueryString += " values(" + mObject.marinaId+ ",'" + mObject.boatInout + "','"  + mObject.sendTime + "','"  + response + "' )  \n" ;
		        	logger.debug(sQueryString);

		    		pool.connect(function (err, clientdb, done) {
		    			if (err) throw new Error(err);
		    			clientdb.query(sQueryString, function (err, res) {
		    				if (err) {
		    					logger.error("ERROR!!" + err);
		    					callback('ERROR');
		    			    } else {
		    			    	logger.debug("tb_unreg_boatdata Insert OK:");
		    			    }
		    				clientdb.release();
		    			});
		    		}); 
		        }
		    )
		    .catch(
		        (error) => {
		            console.log(error); // Logs an error if there was one
		        }
		    )	      

    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

	
};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.SetDashBoard = function (mObject, callback) {
	
	logger.debug("----------------------------------");
	logger.debug('Start SetDashBoard........');
	logger.debug('  marinaId : ' + mObject.marinaId);
	logger.debug('  machineId: ' + mObject.machineId);
	logger.debug('  boatId   : ' + mObject.boatId);
	logger.debug('  gradex   : ' + mObject.gradex);
	logger.debug('  gradey   : ' + mObject.gradey);
	logger.debug('  latitude : ' + mObject.latitude);
	logger.debug('  longitude: ' + mObject.longitude);
	logger.debug('  cctv_cd  :[' + mObject.cctv_cd + "]");
	//logger.debug('  photo_base64: ' + mObject.photo_base64);
	logger.debug('  sendTime  :' + mObject.sendTime);
	logger.debug('  boatInout :' + mObject.boatInout);
	logger.debug("----------------------------------");

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "UPDATE /* SetDashBoard */ tb_io_status " ;
		sQueryString += "   SET marina_id = " + mObject.marinaId  ;

		if( isEmpty(mObject.boatId)) {
			sQueryString += "       , boat_id = null, gradex = null, gradey = null, latitude = null, longitude = null " ;
		} else {
			sQueryString += "       , boat_id = " + mObject.boatId + ", gradex = " + mObject.gradex + ", gradey = " + mObject.gradey + ", latitude = " + mObject.latitude + ", longitude = " + mObject.longitude ;
		}
		if( isEmpty(mObject.cctv_cd)) {
			sQueryString += "       , cctv_cd = '', photo_base64 = '' " ;
		} else {
			sQueryString += "       , cctv_cd = '" + mObject.cctv_cd + "', photo_base64 = '" + mObject.photo_base64 + "' " ;
		}
	    sQueryString += "       , last_upd_tm = to_char(now(), 'YYYYMMDDHH24MISS') " ;
        sQueryString += " WHERE marina_id = " + mObject.marinaId  ;

    logger.debug(sQueryString);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					logger.debug("Anchor Update OK:");
					callback('OK');			    	
			    }
				clientdb.release();
			}); 
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

 
};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.SetSOS = function (mObject, callback) {
	
	logger.debug("----------------------------------");
	logger.debug('Start SetSOS........');
	logger.debug('  marinaId : ' + mObject.marinaId);
	logger.debug('  sendTime : ' + mObject.sendTime);
	logger.debug('  boatId   : ' + mObject.boatId);
	logger.debug('  gradex   : ' + mObject.gradex);
	logger.debug('  gradey   : ' + mObject.gradey);
	logger.debug('  latitude : ' + mObject.latitude);
	logger.debug('  longitude: ' + mObject.longitude);
	logger.debug("----------------------------------");

	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString = "SELECT /* SetSOS */ marina_id, boat_id FROM tb_boat_device WHERE machine_id = '" + mObject.machineId + "' limit 1 \n";
	logger.debug(sQueryString);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
			    	
					for(var i = 0; i < res.rowCount ; i ++) {
						mObject.boatId    = res.rows[i].boat_id;
						logger.debug(" mObject.boatId   :" +res.rows[i].boat_id);   
					}

					var sQueryString  = "INSERT INTO /* SetSOS */ public.tb_sos_list(marina_id, send_time, boat_id,gradex, gradey, latitude, longitude)  \n";
					sQueryString += " values("  + mObject.marinaId + ",'" + mObject.sendTime + "','"  + mObject.boatId + "' \n" ;
					sQueryString += "       ,"  + mObject.gradex + ","  + mObject.gradey + ","  + mObject.latitude + ","  + mObject.longitude + " )  \n" ;    
				
				    logger.debug(sQueryString);

					clientdb.query(sQueryString, function (err, res) {
						if (err) {
							logger.error("ERROR!!" + err);
							callback('ERROR');
					    } else {
					    	logger.debug("tb_sos_list update OK!!" );
					    	callback('OK');
					    }
					}); 
			    }
				clientdb.release();
			}); 
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
    

};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.CCtvReceive = function (mObject, callback) {
    
	logger.debug("----------------------------------");
	logger.debug('Start CCtvReceive........');
	logger.debug('  marinaId 	: ' + mObject.marinaId );
	logger.debug('  sendTime 	: ' + mObject.sendTime );
	logger.debug('  cctv_cd  	: ' + mObject.cctv_cd  );
	logger.debug('  boatinout	: ' + mObject.boatInout);
	//logger.debug('  photo_base64	: ' + mObject.photo_base64);
	logger.debug("----------------------------------");
	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "INSERT INTO /* CCtvReceive */ public.tb_cctvdata(marina_id, send_time, cctv_cd,photo_base64, boatinout)  \n";
		sQueryString += " values("  + mObject.marinaId + ",'" + mObject.sendTime + "','"  + mObject.cctv_cd + "' \n" ;
		sQueryString += "       ,'"  + mObject.photo_base64 + "','"  + mObject.boatInout + "' )  \n" ;    
    logger.debug(sQueryString);

  try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					logger.debug("Anchor Update OK:");
					callback('OK');			    	
			    }
				clientdb.release();
			}); 
		}); 
  } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
};




//왼쪽(오른쪽) 방향에 보트 식별시 가장 가까운 보트 찾기(보트 단말기 신호 기록)
DB.prototype.GetlidarNearBoatSearch = function(mSubObject, callback) {
	var machine_id ;
	
	logger.info("----------------------------------");
	logger.info('Start GetlidarNearBoatSearch........');
	logger.info('  marinaId : ' + mSubObject.marinaId);
	logger.info('  machineId: ' + mSubObject.machineId);
	logger.info('  sendTime : ' + mSubObject.sendTime);
	logger.info('  ■■■■■■■■■■■ leftRight: ' + mSubObject.leftRight);	
	logger.info("----------------------------------");

	try {		 
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
		var sQueryString  = " SELECT /* GetlidarNearBoatSearch */ rd.boat_machine_id, rd.rssi, b.boat_id  \n";
			sQueryString += "   FROM tb_anchor_device  ad, tb_rssidata rd,tb_lidardata ld, tb_boat b, tb_boat_device bd  \n";
			sQueryString += "  WHERE 1 = 1 \n";
			sQueryString += "    AND ad.marina_id   = rd.marina_id \n";
			sQueryString += "    AND ad.marina_id   = ld.marina_id \n";
			sQueryString += "    AND ad.marina_id   = b.marina_id \n";
			sQueryString += "    AND ad.marina_id   = bd.marina_id \n";
			sQueryString += "    AND ad.machine_id  = rd.machine_id \n";
			sQueryString += "    AND rd.boat_machine_id = bd.machine_id \n";
			sQueryString += "    AND bd.boat_id     = b.boat_id \n";
			sQueryString += "    AND ld.marina_id  = "  + mSubObject.marinaId  + " \n";
			sQueryString += "    AND ld.machine_id = '" + mSubObject.machineId + "' \n";
			sQueryString += "    AND ld.send_time  = '" + mSubObject.sendTime  + "' \n";
			sQueryString += "    AND rd.rssi > 10 \n ";
			sQueryString += "    AND b.boat_status = '0' \n ";
			sQueryString += "    AND ld.send_time BETWEEN to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') - interval '200 sec'),'YYYYMMDDHH24MISS')   \n";   //LDH
			sQueryString += "    AND to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') + interval '200 sec'),'YYYYMMDDHH24MISS')    \n";  //LDH
			sQueryString += "  ORDER BY rd.rssi  \n";
			sQueryString += "  LIMIT 1  \n";
		    logger.info("보트 찾기:" + sQueryString);

			pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						callback('ERROR');
				    } else {
						for(var i = 0; i < res.rowCount ; i ++) {
							logger.info("  boat_machine_id   :" +res.rows[i].boat_machine_id);   
							logger.info("  rssi :" +res.rows[i].rssi);   
						}
						if( res.rowCount > 0) {
							//mSubObject.boatId 		 = res.rows[0].boat_machine_id;
							mSubObject.boatId        = res.rows[0].boat_id;
							mSubObject.boatMachineId = res.rows[0].boat_machine_id;
							mSubObject.rssi          = res.rows[0].rssi;
							logger.info("기준 시간 범위내에 단말기 수신 정보가 있습니다." + res.rows[0].boat_machine_id);
							callback("OK", mSubObject);
						} else {
							logger.info("기준 시간 범위내에 단말기 수신 정보가 없습니다.");
							callback("ERROR", mSubObject);
						}
				    }
					clientdb.release();
				});
			}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
			

};




//왼쪽(오른쪽) 방향에 보트 식별시 가장 가까운 보트 찾기(보트 단말기 신호 기록)
DB.prototype.GetNextlidarBoatSearch = function(mSubObject, callback) {
	var machine_id ;
	
	logger.info("----------------------------------");
	logger.info('Start GetNextlidarBoatSearch........');
	logger.info('  marinaId : ' + mSubObject.marinaId);
	logger.info('  machineId : ' + mSubObject.machineId);
	logger.info('  boatMachineId : ' + mSubObject.boatMachineId);
	logger.info('  sendTime: ' + mSubObject.sendTime);
	logger.info('  ★★★★★★★★ leftRight: ' + mSubObject.leftRight);
	logger.info("----------------------------------");

	try {		 
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
		var sQueryString  = " SELECT /* GetNextlidarBoatSearch */ rd.boat_machine_id,rd.rssi \n";
			sQueryString += "   FROM tb_rssidata rd, tb_anchor_lidar al, tb_boat b, tb_boat_device bd  \n";
			sQueryString += "  WHERE 1 = 1 \n";
			sQueryString += "    AND rd.marina_id   = al.marina_id \n";
			sQueryString += "    AND al.marina_id   = b.marina_id \n";
			sQueryString += "    AND al.marina_id   = bd.marina_id \n";
			sQueryString += "    AND rd.boat_machine_id = bd.machine_id \n";
			sQueryString += "    AND bd.boat_id     = b.boat_id \n";
			sQueryString += "    AND rd.rssi > 10 \n ";
			sQueryString += "    AND b.boat_status = '0' \n ";
			sQueryString += "    AND al.marina_id  = '" + mSubObject.marinaId + "' \n";
			sQueryString += "    AND al.machine_ref_id = rd.machine_id \n";
			sQueryString += "    AND al.machine_id  = '" + mSubObject.machineId + "' \n";
			sQueryString += "    AND al.left_right  = '" + mSubObject.leftRight + "' \n";
			sQueryString += "    AND rd.boat_machine_id  = '" + mSubObject.boatMachineId + "' \n";
			sQueryString += "    AND '" + mSubObject.sendTime + "' BETWEEN to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') - interval '200 sec'),'YYYYMMDDHH24MISS') \n"; // LDH
			sQueryString += "    AND to_char((to_timestamp(rd.send_recv_time, 'YYYYMMDDHH24MISS') + interval '200 sec'),'YYYYMMDDHH24MISS')  \n"; // LDH
			sQueryString += "  ORDER BY rd.rssi  \n";
			sQueryString += "  LIMIT 1  \n";
		    logger.info("보트 찾기:" + sQueryString);

			pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						callback('ERROR');
				    } else {
						for(var i = 0; i < res.rowCount ; i ++) {
							mSubObject.boatMachineId = res.rows[i].boat_machine_id;
							mSubObject.rssi2         = res.rows[i].rssi;
							logger.info("  boat_machine_id   :" +res.rows[i].boat_machine_id);   
							logger.info("  rssi :" +res.rows[i].rssi);   
						}
						if( res.rowCount > 0) {
							logger.info("기준 시간 범위내에 단말기 수신 정보가 있습니다." + res.rows[0].boat_machine_id);
							callback("OK", mSubObject);
						} else {
							logger.info("기준 시간 범위내에 단말기 수신 정보가 없습니다.");
							callback("ERROR", mSubObject);
						}
				    }
					clientdb.release();
				});
			}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
			

};




//찾은 보트가 정박 상태 인지
DB.prototype.GetBoatInAnchor = function(mSubObject, callback) {

	logger.info("----------------------------------");
	logger.info('Start GetBoatInAnchor........');
	logger.info('  marinaId : ' + mSubObject.marinaId);
	logger.info('  boatMachineId : ' + mSubObject.boatMachineId);
	logger.info('  rssi: ' + mSubObject.rssi);
	logger.info("----------------------------------");

	try {		 
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
		var sQueryString  = " SELECT /* GetBoatInAnchor */ b.boat_id, b.boat_status  \n";
			sQueryString += "   FROM tb_boat_device bd, tb_boat b \n";
			sQueryString += "  WHERE bd.boat_id = b.boat_id \n";
			sQueryString += "    AND bd.marina_id = '" + mSubObject.marinaId + "' \n";
			sQueryString += "    AND bd.machine_id = '" + mSubObject.boatMachineId + "' \n";
		    logger.info("보트 찾기:" + sQueryString);

			pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						callback('ERROR');
				    } else {
						for(var i = 0; i < res.rowCount ; i ++) {
							mSubObject.boat_id = res.rows[i].boat_id;
							logger.info("  boat_id :" +res.rows[i].boat_id);   
							logger.info("  boat_status :" +res.rows[i].boat_status);   
						}
						if( res.rowCount > 0) {
							if( res.rows[0].boat_status == '1') {
								logger.info("정박된 보트가 있습니다." + res.rows[0].boat_id);
								callback("OK", mSubObject);
							} else {
								logger.info("정박된 보트가 없습니다." );
								callback("NOOK", mSubObject);
							}
						} else {
							logger.info("범위내에 단말기 수신 정보가 없습니다.");
							callback("ERROR", mSubObject);
						}
				    }
					clientdb.release();
				});
			}); 
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
			

};

//객체를 바로 module.exports에 할당
module.exports = DB;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/
