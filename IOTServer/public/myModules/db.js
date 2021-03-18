/*jshint esversion: 6 */
/*
 * PostgreSQL DB 처리
 */
const logger = require('../../config/winston');
var path   = require('path');
var async  = require('async');
var moment = require('moment');
const config = require('config');
 
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
	var machineId;  //보트단말기 ID     
	var sendTime;   // 전송일시  	
	var boatId;  //보트 ID     
	var anchorId;   // 정박지단말기 ID  
	var leftRight;  // 좌우구분  
	var boatInout;  // 입출항구분  
	var gradex;  // MQTT에서 전달 받은 GPS 위도 
	var gradey;  // MQTT에서 전달 받은 GPS 경도
	var latitude;   // 위도
	var longitude;  // 경도
	var cctv_cd  ;  // cctv
	var photo_base64; //전송이미지 텍스트
	var last_upd_tm;  //최종수정시각	
}
var mObject = new MessageObject(); //메세지 구조체
**/

// MQTT에서 전달된 메세지를 인자로 받음
function DB() {
	var message ;
}

// 보트 데이터 분석 처리
function boatdata(sData) {

	var sId          = sData[9];
	var nTemperature = sData[16];
	var nHumidity    = sData[17];
	var nGradex      = sData[18];
	var nGradey      = sData[19];
	var nGpsquality  = sData[26];  
	var nLatitude    = sData[22];
	var nLongitude   = sData[24];
	var nSatellite   = sData[27];
	var nGpsage      = sData[33];
	var sSenttype    = sData[14];
	var ssend_time    = sData[15];

	logger.info("----------------------------------");
	logger.info('Start boatdata insert........');
	logger.info("  sId          :" + sId          );	
	logger.info("  nTemperature :" + nTemperature );	
	logger.info("  nHumidity    :" + nHumidity    );	
	logger.info("  nGradex      :" + nGradex      );	
	logger.info("  nGradey      :" + nGradey      );	
	logger.info("  nGpsquality  :" + nGpsquality  );	
	logger.info("  nLatitude    :" + nLatitude    );	
	logger.info("  nLongitude   :" + nLongitude   );	
	logger.info("  nSatellite   :" + nSatellite   );	
	logger.info("  nGpsage      :" + nGpsage      );	
	logger.info("  sSenttype    :" + sSenttype    );	
	logger.info("  ssend_time   :" + ssend_time   );
	logger.info("----------------------------------");

	if(nTemperature === "") { nTemperature = 0; }
	if(nHumidity    === "") { nHumidity = 0; }
	if(nGradex      === "") { nGradex = 0; }
	if(nGradey      === "") { nGradey = 0; }
	if(nGpsquality  === "") { nGpsquality = 0; }
	if(nLatitude    === "") { nLatitude = 0; }
	if(nLongitude   === "") { nLongitude = 0; }
	if(nSatellite   === "") { nSatellite = 0; }
	if(nGpsage      === "") { nGpsage = 0; }
	if(sSenttype    === "") { sSenttype = 'R'; }
	
// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "INSERT INTO tb_boatdata(marina_id, machine_id, temperature, humidity, gradex, gradey, gpsquality, latitude, longitude, satellite, gpsage, sent_type, send_time) \n ";
	sQueryString += " values(1,'" + sId + "',"  + nTemperature + ","  + nHumidity + ","  + nGradex + ","  + nGradey + ","  + nGpsquality + ","  + nLatitude + "," + nLongitude ;
	sQueryString += ","  + nSatellite + ","  + nGpsage + ",'"  + sSenttype + "',"  + moment().format('YYYYMMDDHHmmss') + " );  \n";
	logger.info("[INSERT INTO tb_boatdata]:"+sQueryString);
 
	  try {

		  pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
						callback('ERROR');
				    } else {
				    	logger.info("Boatdata Insert OK:");
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
function anchordata(sData) {

	var sId          = sData[0];
	var nTemperature = sData[1];
	var nHumidity    = sData[2];
	var nDistance    = sData[3];
	var ssend_time    = sData[4];
	var sStatus   = "";

	if(nTemperature === "")  { nTemperature = 0; }
	if(nHumidity    === "")  { nHumidity = 0; }
	if(nDistance    === "")  { nDistance = 0; }

	logger.info("----------------------------------");
	logger.info('Start anchordata insert........');
	logger.info("  sId          :" + sId          );	
	logger.info("  nTemperature :" + nTemperature );	
	logger.info("  nHumidity    :" + nHumidity    );	
	logger.info("  ssend_time   :" + ssend_time   );
	logger.info("  nDistance    :" + nDistance   );
	logger.info("----------------------------------");

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "INSERT INTO public.tb_anchordata(marina_id, machine_id, send_time, temperature, humidity, distance)  \n";
	    sQueryString += "values(1,'" + sId + "','"  + ssend_time + "',"  + nTemperature + ","  + nHumidity + ","  + nDistance + "  );  \n";
	logger.info(sQueryString);

   try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
			    	logger.info("Anchordata Insert OK:");
			    }
				clientdb.release();
			}); 
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}

	 
}


//정박지 데이터 분석 처리
function lidardata(sData) {
		
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

    if(nAngleMin       === "")  { nAngleMin       = 0; }
    if(nAngleMax       === "")  { nAngleMax       = 0; }
    if(nLoadMin        === "")  { nLoadMin        = 0; }
    if(nShipMax        === "")  { nShipMax        = 0; }
    if(nLoadThreshold  === "")  { nLoadThreshold  = 0; }
    if(nShipThreshold  === "")  { nShipThreshold  = 0; }
    if(nTempo          === "")  { nTempo          = 0; }
    if(nHuminity       === "")  { nHuminity        = 0; }
    if(nLoadLeftCount  === "")  { nLoadLeftCount  = 0; }
    if(nShipLeftCount  === "")  { nShipLeftCount  = 0; }
    if(nLoadRightCount === "")  { nLoadRightCount = 0; }
    if(nShipRightCount === "")  { nShipRightCount = 0; }

	logger.info("----------------------------------");
	logger.info('Start lidardata insert........');
    logger.info("  sId                :" + sId               );
    logger.info("  nAngleMin          :" + nAngleMin         );
    logger.info("  nAngleMax          :" + nAngleMax         );
    logger.info("  nLoadMin           :" + nLoadMin          );
    logger.info("  nShipMax           :" + nShipMax          );
    logger.info("  nLoadThreshold     :" + nLoadThreshold    );
    logger.info("  nShipThreshold     :" + nShipThreshold    );
    logger.info("  nTempo             :" + nTempo            );
    logger.info("  nHuminity          :" + nHuminity         );
    logger.info("  ssend_time         :" + ssend_time        );
    logger.info("  nLoadLeftCount     :" + nLoadLeftCount    );
    logger.info("  nShipLeftCount     :" + nShipLeftCount    );
    logger.info("  nLoadRightCount    :" + nLoadRightCount   );
    logger.info("  nShipRightCount    :" + nShipRightCount   );
    logger.info("  sLoadLeftYn        :" + sLoadLeftYn       );
    logger.info("  sShipLeftYn        :" + sShipLeftYn       );
    logger.info("  sLoadRightYn       :" + sLoadRightYn      );
    logger.info("  sShipRightYn       :" + sShipRightYn      );
    logger.info("  sLongData          :" + sLongData         );
	logger.info("----------------------------------");
	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString = "INSERT INTO public.tb_lidardata(marina_id, machine_id,angle_min,angle_max,load_min,ship_max,load_threshold,ship_threshold,temperature,huminity,send_time,  \n";
	sQueryString += " load_left_count,ship_left_count,load_right_count,ship_right_count,load_left_yn,ship_left_yn,load_right_yn,ship_right_yn,etcdata)  \n";
	sQueryString += " values(1,'" + sId + "',"  + nAngleMin + ","  + nAngleMax + ","  + nLoadMin + ","  + nShipMax + ","  + nLoadThreshold + ","  + nShipThreshold  ;
	sQueryString += ", " + nTempo + ","  + nHuminity + ",'"  + ssend_time ;
	sQueryString += "', " + nLoadLeftCount + ","  + nShipLeftCount + ","  + nLoadRightCount + ","  + nShipRightCount + ",'"  + sLoadLeftYn + "','"  + sShipLeftYn + "','"  + sLoadRightYn + "','"  + sShipRightYn + "','"  + sLongData + "' )  \n" ;
	logger.info(sQueryString);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
			    	logger.info("Lidardata Insert OK:");
			    }
				clientdb.release();
			});
		}); 
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	}
		
}


//DB.prototype.getDB = function() {
//	return {message: this.message};
//}


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.SetDB = function(message) {
	this.message = message;
};


// MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.InsertDBBoatData = function(message) {
	boatdata(message);
};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.InsertDBAnchorData = function(message) {
	anchordata(message);
};

//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.InsertDBLidarData = function(message) {
	lidardata(message);
};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
//출입구역영역안에 있는지 판단
DB.prototype.SelectGateBound = function (mObject, callback) {

	logger.info("----------------------------------");
	logger.info('Start SelectGateBound........');
	logger.info('  marinaId : ' + mObject.marinaId);
	logger.info('  GPS X    : ' + mObject.gradex);
	logger.info('  GPS Y    : ' + mObject.gradey);
	logger.info("----------------------------------");

	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT /* SelectGateBound */ sector_nm  \n";
	    sQueryString += "  FROM tb_anchor_sector   \n";
	    sQueryString += " WHERE marina_id = " + mObject.marinaId + " AND sectorarea_cd = 'Z' AND gpsx1 <= " + mObject.gradex + " AND gpsx2 >= " + mObject.gradex + "  \n" ;
	    sQueryString += "   AND gpsy1 <= " + mObject.gradey + " AND gpsy2 >= " + mObject.gradey ;
	
	logger.info(sQueryString);

	try {	
		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
					callback('ERROR');
			    } else {
					if( res.rowCount > 0 ) {
						logger.info("GPS 출입영역 안에 있음.........!!");
						callback('OK');
					} else {
						logger.info("GPS 출입영역 밖에 있음........!!");
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
	
	logger.info("----------------------------------");
	logger.info('Start SelectAnchorYN........');
	logger.info('  marina_id: '  + mObject.marinaId);
	logger.info('  machine_id: ' + mObject.machineId);
	logger.info("----------------------------------");

	try {
		//	var sQueryString  = "SELECT anchor.anchor_status FROM tb_anchor_lidar LEFT JOIN anchor  ON anchor_lidar.anchor_id = anchor.anchor_id WHERE anchor_lidar.machine_id = '" + mObject.machineId + "'";
		var sQueryString  = "SELECT /* SelectAnchorYN */ 1 FROM tb_anchor_lidar  \n WHERE marina_id = " + mObject.marinaId + " AND machine_id = '" + mObject.machineId + "'"; // LDH 시점 확인 
		logger.info(sQueryString);

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
	
	logger.info("----------------------------------");
	logger.info('Start SelectLastAnchor........'    );
	logger.info('  marinaId :' + mObject.marinaId   );
	logger.info('  machineId:' + mObject.machineId  );
	logger.info('  Sendtime :' + mObject.sendTime   );
	logger.info("----------------------------------");

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

		logger.info(sQueryString);

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

//기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
DB.prototype.GetBoatDataSearch = function(mObject, callback) {
	var machine_id ;
	
	logger.info("----------------------------------");
	logger.info('Start GetBoatDataSearch........');
	logger.info('  marinaId : ' + mObject.marinaId);
	logger.info('  machineId: ' + mObject.machineId);
	logger.info('  sendTime : ' + mObject.sendTime);
	logger.info('  leftRight: ' + mObject.leftRight);
	logger.info("----------------------------------");

	try {		 
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
		var sQueryString  = "SELECT /* GetBoatDataSearch */ AA.machine_id, AA.anchor_id, BB.boat_id \n";
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
		//    sQueryString += "   and a.send_time  between substring('" + mObject.sendTime + "',0,13)||'00' and to_char((to_timestamp(substring('" + mObject.sendTime + "',0,13)||'00', 'YYYYMMDDHH24MISS') + interval '1 min'),'YYYYMMDDHH24MISS')";
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
							logger.error("기준 시간 범위내에 단말기 수신 정보가 있습니다." + res.rows[0].boat_id);
							callback("OK", mObject);
						} else {
							logger.error("기준 시간 범위내에 단말기 수신 정보가 없습니다.");
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
	
	logger.info("----------------------------------");
	logger.info('Start UpdateBoatHist........');
    logger.info('   marinaId  : ' + mObject.marinaId);
	logger.info('   machineId : ' + mObject.machineId);
	logger.info('   sendTime  : ' + mObject.sendTime);
	logger.info('   boatInout : ' + mObject.boatInout);
	logger.info("----------------------------------");

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString = "SELECT /* UpdateBoatHist */ marina_id, boat_id FROM tb_boat_device WHERE machine_id = '" + mObject.machineId + "' limit 1 \n";
	logger.info(sQueryString);

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
						logger.info(" boat_id   :" +res.rows[i].boat_id);   
					}

			    	sQueryString  = "INSERT INTO /* UpdateBoatHist */ public.tb_boat_hist(marina_id, boat_id,send_time,boatinout)  \n";
				    sQueryString += "values ( " + mObject.marinaId + ", "  + mObject.boatId + ", '"  + mObject.sendTime + "', '"  + mObject.boatInout + "')  \n";
				
				    logger.info(sQueryString);

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

//계류지에 정박보트 설정
/*
 * status = 1 : 정박
 * status = 0 : 미정박 
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
		var sQueryString  = "UPDATE /* SetBoatAnchor */ tb_ANCHOR SET boat_id = " + mObject.boatId + ",anchor_status = '1'  where marina_id = " + mObject.marinaId + " AND anchor_id = " + mObject.anchorId;
	} else {
		var sQueryString  = "UPDATE /* SetBoatAnchor */ tb_ANCHOR SET boat_id = null ,anchor_status = '1'  where marina_id = " + mObject.marinaId + " AND anchor_id = " + mObject.anchorId;
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
DB.prototype.SetBoatNotAnchor = function(mObject, callback) {
	
	var machine_id ;
	
	logger.info("----------------------------------");
	logger.info('Start SetBoatNotAnchor........');
	logger.info('   marinaId : ' + mObject.marinaId);
	logger.info('   machineId: ' + mObject.machineId);
	logger.info('   leftRight: ' + mObject.leftRight);
	logger.info("----------------------------------");


	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "UPDATE /* SetBoatNotAnchor */ tb_ANCHOR a SET boat_id = 0, anchor_status = '0'   " ;
        sQueryString += " WHERE a.marina_id = " + mObject.marinaId + " AND a.anchor_id = (select b.anchor_id from tb_ANCHOR_lidar b where  b.marina_id = " + mObject.marinaId + " AND b.machine_id = '" + mObject.machineId + "' AND b.left_right = '" + mObject.leftRight + "') " ;

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


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.SetDashBoard = function (mObject, callback) {
	
	logger.info("----------------------------------");
	logger.info('Start SetDashBoard........');
	logger.info('  marinaId : ' + mObject.marinaId);
	logger.info('  machineId: ' + mObject.machineId);
	logger.info('  boatId   : ' + mObject.boatId);
	logger.info('  gradex   : ' + mObject.gradex);
	logger.info('  gradey   : ' + mObject.gradey);
	logger.info('  latitude : ' + mObject.latitude);
	logger.info('  longitude: ' + mObject.longitude);
	logger.info('  cctv_cd  :[' + mObject.cctv_cd + "]");
	logger.info('  photo_base64: ' + mObject.photo_base64);
	logger.info('  sendTime  :' + mObject.sendTime);
	logger.info('  boatInout :' + mObject.boatInout);
	logger.info("----------------------------------");

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


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.SetSOS = function (mObject, callback) {
	
	logger.info("----------------------------------");
	logger.info('Start SetSOS........');
	logger.info('  marinaId : ' + mObject.marinaId);
	logger.info('  sendTime : ' + mObject.sendTime);
	logger.info('  boatId   : ' + mObject.boatId);
	logger.info('  gradex   : ' + mObject.gradex);
	logger.info('  gradey   : ' + mObject.gradey);
	logger.info('  latitude : ' + mObject.latitude);
	logger.info('  longitude: ' + mObject.longitude);
	logger.info("----------------------------------");

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "INSERT INTO /* SetSOS */ public.tb_sos_list(marina_id, send_time, boat_id,gradex, gradey, latitude, longitude)  \n";
		sQueryString += " values("  + mObject.marinaId + ",'" + mObject.sendTime + "','"  + mObject.boatId + "' \n" ;
		sQueryString += "       ,"  + mObject.gradex + ","  + mObject.gradey + ","  + mObject.latitude + ","  + mObject.longitude + " )  \n" ;    
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

//객체를 바로 module.exports에 할당
module.exports = DB;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/
