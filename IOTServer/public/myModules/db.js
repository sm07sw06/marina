/*jshint esversion: 6 */
/*
 * PostgreSQL DB 처리
 */

const logger = require('../../config/winston');

var moment = require('moment');

const { Pool, clientpg } = require("pg");
/**
const client = new Client({ 
	user: vals.user, 
	password: vals.pass, 
	host: vals.host, 
	port: vals.port, 
	database: vals.db 
}); 

function GetUserList() { 
	client.connect(); 
	client.query('SELECT * FROM users', (err, res) => { 
		console.log(res);
		client.end();
	}); 
};
**/
const pool = new Pool({
	user: "postgres",
	password: "topadmin",
	host: "192.168.123.105",
	port: "5432",
	database: "postgres"
});

function MessageObject()
{ 
	var iD;    // MQTT에서 전달 받은 단말기 ID 
	var gpsX;  // MQTT에서 전달 받은 GPS 위도 
	var gpsY;  // MQTT에서 전달 받은 GPS 경도
	var time;  // MQTT에서 전달 받은 시각
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
	var sSendtime    = sData[15];

	logger.info(nGradex);
	logger.info(nGradey);	

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
	var sQueryString  = "INSERT INTO public.boatdata(machine_id, temperature, humidity, gradex, gradey, gpsquality, latitude, longitude, satellite, gpsage, senttype, sendtime) ";
	sQueryString += " values('" + sId + "',"  + nTemperature + ","  + nHumidity + ","  + nGradex + ","  + nGradey + ","  + nGpsquality + ","  + nLatitude + "," + nLongitude ;
	sQueryString += ","  + nSatellite + ","  + nGpsage + ",'"  + sSenttype + "',"  + moment().format('YYYYMMDDhhmmss') + " );";
	logger.info(sQueryString);
	pool.query(
		sQueryString,(err, res) => {
			if(err !== undefined) {
				logger.error(err, res);
//				pool.end();
			} else {
				logger.info("Boatdata Insert OK:");
			}
		}
	);
}


/**
//굼뱅이 암모니아 데이터 분석 처리
function larva(sData) {

	logger.info(sData);

	var sId = sData[0];
	var sIp = sData[1];
	var nAmmonia = sData[2];

	if(sIp === "") { sIp = '0'; }
	if(nAmmonia === "") nAmmonia = 0;

	var sQueryString = "INSERT INTO public.larva(id, ip, ammonia) values('" + sId + "','"  + sIp + "',"  + nAmmonia + " );";
	logger.info(sQueryString);
	pool.query(
		sQueryString,(err, res) => {
			if(err !== undefined)
			logger.info(err);
		}
	);
}
**/

//정박지 데이터 분석 처리
function anchordata(sData) {

	logger.info(sData);	

	var sId       = sData[0];
	var sIp       = sData[1];
	var nDistance = sData[2];
	var sStatus   = "";

	if(nDistance === "")  { nDistance = 0; }

	logger.info(nDistance);

	if ( nDistance < 100) { // 버트 계류시 상태변경 ==> status : 1
		sStatus = '1';
	} else {
		sStatus = '0';
	}

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString = "INSERT INTO public.anchordata(machine_id, anchor_status, sendtime) values('" + sId + "','"  + sStatus + "',"  + moment().format('YYYYMMDDhhmmss') + " );";
	logger.info(sQueryString);
	pool.query(
		sQueryString,(err, res) => {
			if(err !== undefined) {
				logger.error(err);
				//logger.info(err, res);
				//pool.end();
			} else {
				logger.info("Anchordata Insert OK:");
			}
		}
	);
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
DB.prototype.SelectGateBound = function(mObject, callback) {
	
	logger.info('Start SelectGateBound........');
	logger.info( 'Device: ' + mObject.iD);
	logger.info( 'GPS X : ' + mObject.gpsX);
	logger.info( 'GPS Y : ' + mObject.gpsY);

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT sector_name FROM public.sector WHERE $1 BETWEEN gpsx1 AND gpsx2 AND $2 BETWEEN gpsy1 AND gpsy2 ";
	logger.info(sQueryString);
	const values = [mObject.gpsX, mObject.gpsY];
	pool.query(
		sQueryString, values, (err, res) => {
			if(err !== undefined) {
				logger.error(err, res);
//				pool.end();
				return -1;
			} else {
				logger.info("Command:" + res.command);
				logger.info("Count:"   + res.rowCount);
				//for(var i = 0; i < res.rowCount ; i ++) {
				//	  logger.info("Result2:" +res.rows[i].sector_name);   
				//}
				if( res.rowCount > 0 ) {
					callback('OK');
				} else {
					callback('ERROR');
				}
			}
		}
	);
};


//기 정박상태 인지 확인
DB.prototype.SelectAnchorYN = function(mObject, callback) {
	
	logger.info('Start SelectAnchorYN........');
	logger.info( 'Device: ' + mObject.iD);

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT anchor_status FROM anchor_device a JOIN anchor b ON a.anchor_id = b.anchor_id WHERE a.machine_id = $1 ";
	logger.info(sQueryString);
	const values = [mObject.iD];
	pool.query(
		sQueryString, values, (err, res) => {
			if(err !== undefined) {
				logger.error(err, res);
//				pool.end();
				return -1;
			} else {
				logger.info("Command:" + res.command);
				logger.info("Count:"   + res.rowCount);
				for(var i = 0; i < res.rowCount ; i ++) {
					  logger.info("Result2:" +res.rows[i].sector_name);   
				}
				if( res.rowCount > 0 ) {
					callback('OK');
				} else {
					callback('ERROR');
				}
			}
		}
	);
};


//기준 시간 범위내 단말기 수신 정보 찾기
DB.prototype.GetBoatDataSearch = function(mObject, callback) {
	
	logger.info('Start GetBoatDataSearch........');
	logger.info( 'Device: ' + mObject.iD);
	logger.info( 'time  : ' + mObject.time);

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT anchor_status FROM anchor_device a JOIN anchor b ON a.anchor_id = b.anchor_id WHERE a.machine_id = $1 ";
	logger.info(sQueryString);
	const values = [mObject.iD, mObject.time ];
	pool.query(
		sQueryString, values, (err, res) => {
			if(err !== undefined) {
				logger.error(err, res);
//				pool.end();
				return -1;
			} else {
				logger.info("Command:" + res.command);
				logger.info("Count:"   + res.rowCount);
				for(var i = 0; i < res.rowCount ; i ++) {
					  logger.info("Result2:" +res.rows[i].sector_name);   
				}
				if( res.rowCount > 0 ) {
					callback('OK');
				} else {
					callback('ERROR');
				}
			}
		}
	);
};


//객체를 바로 module.exports에 할당
module.exports = DB;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/
