/*jshint esversion: 6 */
/*
 * PostgreSQL DB 처리
 */

const logger = require('../../config/winston');

var async = require('async');
var moment = require('moment');

const { Pool, clientdb } = require("pg");

const pool = new Pool({
	user: "postgres",
	host: "192.168.123.105",
	database: "postgres",
	password: "topadmin",
	port: "5432"
});

function MessageObject()
{ 
	var id;    // MQTT에서 전달 받은 단말기 ID 
	var gpsX;  // MQTT에서 전달 받은 GPS 위도 
	var gpsY;  // MQTT에서 전달 받은 GPS 경도
	var time;  // MQTT에서 전달 받은 시각
	var machineId;  //보트단말기 ID     
	var boatId;  //보트 ID     
	var anchorId;   // 정박지단말기 ID  
	var leftRight;  // 좌우구분  
}
var mObject = new MessageObject(); //메세지 구조체

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

	logger.info('Start boatdata........');
	logger.info(sData);

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
	var sQueryString  = "INSERT INTO tb_boatdata(marina_id, machine_id, temperature, humidity, gradex, gradey, gpsquality, latitude, longitude, satellite, gpsage, sent_type, send_time) ";
	sQueryString += " values(1,'" + sId + "',"  + nTemperature + ","  + nHumidity + ","  + nGradex + ","  + nGradey + ","  + nGpsquality + ","  + nLatitude + "," + nLongitude ;
	sQueryString += ","  + nSatellite + ","  + nGpsage + ",'"  + sSenttype + "',"  + moment().format('YYYYMMDDHHmmss') + " );";
	logger.info("[INSERT INTO tb_boatdata]:"+sQueryString);
 
	  try {

			pool.connect(function (err, clientdb, done) {
				logger.info("001");
				if (err) throw new Error(err);
				logger.info("002");
				clientdb.query(sQueryString, function (err, res) {
					logger.info("003");
					if (err) {
						logger.error("ERROR!!" + err);
				        return;
				    } else {
				    	logger.info("Boatdata Insert OK:");
				    }
					clientdb.end();
				}); 
			}); 
			pool.on('error', function(error) { 
					console.log("328 ERROR!!" + error);
			});
			
	    } catch (e) {
			logger.error("ERROR:"+err);
			callback('ERROR');
		} finally {
			//clientdb.end();
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

	logger.info('Start anchordata........');
	logger.info("  nDistance:" + nDistance);

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "INSERT INTO public.tb_anchordata(marina_id, machine_id, send_time, temperature, humidity, distance) ";
	    sQueryString += "values(1,'" + sId + "','"  + ssend_time + "',"  + nTemperature + ","  + nHumidity + ","  + nDistance + "  );";
	logger.info(sQueryString);

   try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
			        return;
			    } else {
			    	logger.info("Anchordata Insert OK:");
			    }
				clientdb.end();
			}); 
		}); 
		pool.on('error', function(error) { 
				console.log("328 ERROR!!" + error);
		});
		
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	} finally {
		//clientdb.end();
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

	logger.info('Start lidardata........');

	
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString = "INSERT INTO public.tb_lidardata(marina_id, machine_id,angle_min,angle_max,load_min,ship_max,load_threshold,ship_threshold,tempo,huminity,send_time, ";
	sQueryString += " load_left_count,ship_left_count,load_right_count,ship_right_count,load_left_yn,ship_left_yn,load_right_yn,ship_right_yn,etcdata) ";
	sQueryString += " values(1,'" + sId + "',"  + nAngleMin + ","  + nAngleMax + ","  + nLoadMin + ","  + nShipMax + ","  + nLoadThreshold + ","  + nShipThreshold  ;
	sQueryString += ", " + nTempo + ","  + nHuminity + ",'"  + ssend_time ;
	sQueryString += "', " + nLoadLeftCount + ","  + nShipLeftCount + ","  + nLoadRightCount + ","  + nShipRightCount + ",'"  + sLoadLeftYn + "','"  + sShipLeftYn + "','"  + sLoadRightYn + "','"  + sShipRightYn + "','"  + sLongData + "' )" ;
	logger.info(sQueryString);
	logger.info(sLongData);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
			        return;
			    } else {
			    	logger.info("Lidardata Insert OK:");
			    }
				clientdb.end();
			}); 
		}); 
		pool.on('error', function(error) { 
				console.log("328 ERROR!!" + error);
		});
		
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	} finally {
		//clientdb.end();
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
async DB.prototype.SelectGateBound = function (mObject, callback) {
	
	
			logger.info('Start SelectGateBound........');
			logger.info( '  Device: ' + mObject.id);
			logger.info( '  GPS X : ' + mObject.gpsX);
			logger.info( '  GPS Y : ' + mObject.gpsY);
		 
			
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
			var sQueryString  = "SELECT sector_nm FROM tb_anchor_sector  ";
			 sQueryString  += " WHERE marina_id = 1 AND gpsx1 <= " + mObject.gpsX + " AND gpsx2 >= " + mObject.gpsX ;
			 sQueryString  += "   AND gpsy1 <= " + mObject.gpsY + " AND gpsy2 >= " + mObject.gpsY ;
			logger.info(sQueryString);
		
			try {	
				pool.connect(function (err, clientdb, done) {
					logger.info("1001");
					if (err) throw new Error(err);
					logger.info("1002");
					await clientdb.query(sQueryString, function (err, res) {
						logger.info("1003");
						if (err) {
							logger.error("ERROR!!" + err);
					        return;
					    } else {
							logger.info("1004");
							if( res.rowCount > 0 ) {
								logger.info("1개 이상 정박됨.........!!");
								callback('OK');
							} else {
								logger.info("정박상태 없음........!!");
								callback('ERROR');
							}
					    }
						logger.info("1005");
						clientdb.end();
					});
					logger.info("1006");
				}); 
				pool.on('error', function(error) { 
					console.log("328 ERROR!!" + error);
				});
		
			} catch (e) {
				logger.error("ERROR:"+err);
				callback('ERROR');
			} finally {
				//clientdb.end();
			}
		

 
};


//기 정박상태 인지 확인
DB.prototype.SelectAnchorYN = function(mObject, callback) {
	
	logger.info('Start SelectAnchorYN........');
	logger.info('  Device: ' + mObject.id);
 
	try {
		//	var sQueryString  = "SELECT anchor.anchor_status FROM tb_anchor_lidar LEFT JOIN anchor  ON anchor_lidar.anchor_id = anchor.anchor_id WHERE anchor_lidar.machine_id = '" + mObject.id + "'";
		var sQueryString  = "SELECT 1 FROM tb_anchor_lidar WHERE marina_id = 1 AND machine_id = '" + mObject.id + "'";
		logger.info(sQueryString);

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
			        return;
			    } else {
					if( res.rowCount > 0 ) {
						callback('OK');
					} else {
						callback('ERROR');
					}
			    }
				clientdb.end();
			});
		}); 
		pool.on('error', function(error) { 
			console.log("328 ERROR!!" + error);
		});
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	} finally {
		//clientdb.end();
	}
	 
};


//기준 시간 범위내 단말기 수신 정보 찾기(보트 단말기 신호 기록)
DB.prototype.GetBoatDataSearch = function(mObject, callback) {
	var machine_id ;
	
	logger.info('Start GetBoatDataSearch........');
	logger.info('  GetBoatDataSearch Device: ' + mObject.id);
	logger.info('  GetBoatDataSearch time  : ' + mObject.time);
	logger.info('  GetBoatDataSearch leftRight  : ' + mObject.leftRight);

	try {		 
			// 아래와 같이 .query 로 쿼리를 날릴 수 있다
			var sQueryString  = "select a.machine_id, x.boat_id, AA.anchor_id";
		    sQueryString += "  from tb_boatdata a,tb_boat_device x,(";
		    sQueryString += "select b.machine_id, b.anchor_id, c.sector_id, d.gpsx1, d.gpsx2, d.gpsy1, d.gpsy2";
		    sQueryString += "  from tb_anchor_lidar b, tb_anchor c, tb_anchor_sector d";
		    sQueryString += " where 1 = 1 ";
		    sQueryString += "   and b.machine_id = '" + mObject.id + "'";
		    sQueryString += "   and b.left_right = '" + mObject.leftRight + "'";
		    sQueryString += "   and b.anchor_id = c.anchor_id ";
		    sQueryString += "   and c.sector_id = d.sector_id ";
		    sQueryString += "   and b.marina_id = c.marina_id ";
		    sQueryString += "   and c.marina_id = d.marina_id ";
		    sQueryString += "   and b.marina_id = 1 ";
		    sQueryString += " ) AA    ";
		    sQueryString += " where a.marina_id = 1";
		    sQueryString += "   and a.marina_id = x.marina_id";
		    sQueryString += "   and a.machine_id = x.machine_id";
		    sQueryString += "   and a.latitude  between AA.gpsx1 and AA.gpsx2";
		    sQueryString += "   and a.longitude between AA.gpsy1 and AA.gpsy2";
		    sQueryString += "   and a.send_time  between to_char((to_timestamp(substring('" + mObject.time + "',0,13)||'00', 'YYYYMMDDHH24MISS') - interval '1 min'),'YYYYMMDDHH24MISS')";
		    sQueryString += "   and to_char((to_timestamp(substring('" + mObject.time + "',0,13)||'00', 'YYYYMMDDHH24MISS') + interval '1 min'),'YYYYMMDDHH24MISS')";
		//    sQueryString += "   and a.send_time  between substring('" + mObject.time + "',0,13)||'00' and to_char((to_timestamp(substring('" + mObject.time + "',0,13)||'00', 'YYYYMMDDHH24MISS') + interval '1 min'),'YYYYMMDDHH24MISS')";
		    logger.info("보트 찾기:" + sQueryString);

			pool.connect(function (err, clientdb, done) {
				if (err) throw new Error(err);
				clientdb.query(sQueryString, function (err, res) {
					if (err) {
						logger.error("ERROR!!" + err);
				        return;
				    } else {
						logger.info("GetBoatDataSearch Command:" + res.command);
						logger.info("GetBoatDataSearch Count:"   + res.rowCount);
						for(var i = 0; i < res.rowCount ; i ++) {
							mObject.machineId = res.rows[i].machine_id;
							mObject.boatId    = res.rows[i].boat_id;
							mObject.anchorId  = res.rows[i].anchor_id;
							logger.info("GetBoatDataSearch machine_id:" +res.rows[i].machine_id);   
							logger.info("GetBoatDataSearch boat_id   :" +res.rows[i].boat_id);   
							logger.info("GetBoatDataSearch anchor_id :" +res.rows[i].anchor_id);   
						}
						if( res.rowCount > 0 ) {
							callback(mObject);
						} else {
							callback('ERROR');
						}
				    }
					clientdb.end();
				});
			}); 
			pool.on('error', function(error) { 
				console.log("328 ERROR!!" + error);
			});
			
	} catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	} finally {
		//clientdb.end();
	}
			
 
};


//기준 시간 범위내 단말기 수신 정보 찾기
DB.prototype.SetBoatAnchor = function(mObject, callback) {
	
	var machine_id ;
	
	logger.info('Start SetBoatAnchor........');
	logger.info('   machineId: ' + mObject.machineId);
	logger.info('   anchorId: ' + mObject.anchorId);
	logger.info('   boatId: ' + mObject.boatId);
	logger.info('   time  : ' + mObject.time);

 
	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "UPDATE tb_ANCHOR SET boat_id = " + mObject.boatId + ",anchor_status = '1'  where marina_id = 1 AND anchor_id = " + mObject.anchorId;

    logger.info(sQueryString);
    
    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
			        return;
			    } else {
					logger.info("Anchor Update OK:");
					callback('OK');			    	
			    }
				clientdb.end();
			}); 
		}); 
		pool.on('error', function(error) { 
				console.log("328 ERROR!!" + error);
		});
		
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	} finally {
		//clientdb.end();
	}

};


//기준 시간 범위내 단말기 수신 정보 찾기
DB.prototype.SetBoatNotAnchor = function(mObject, callback) {
	
	var machine_id ;
	
	logger.info('Start SetBoatNotAnchor........');
	logger.info('   machineId: ' + mObject.machineId);


	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "UPDATE tb_ANCHOR a SET boat_id = 0, anchor_status = '0'  WHERE a.marina_id = 1 AND a.anchor_id = (select b.anchor_id from tb_ANCHOR_lidar b where  b.marina_id = 1 AND b.machine_id = '" + mObject.machineId + "') " ;

    logger.info(sQueryString);

    try {

		pool.connect(function (err, clientdb, done) {
			if (err) throw new Error(err);
			clientdb.query(sQueryString, function (err, res) {
				if (err) {
					logger.error("ERROR!!" + err);
			        return;
			    } else {
					logger.info("Anchor Update OK:");
					callback('OK');			    	
			    }
				clientdb.end();
			}); 
		}); 
		pool.on('error', function(error) { 
				console.log("328 ERROR!!" + error);
		});
		
    } catch (e) {
		logger.error("ERROR:"+err);
		callback('ERROR');
	} finally {
		//clientdb.end();
	}
	
};


//객체를 바로 module.exports에 할당
module.exports = DB;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/
