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
	var gpsX;  // MQTT에서 전달 받은 GPS 위도 
	var gpsY;  // MQTT에서 전달 받은 GPS 경도
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
	var sQueryString  = "INSERT INTO public.boatdata(id, temperature, humidity, gradex, gradey, gpsquality, latitude, longitude, satellite, gpsage, senttype, sendtime) ";
	sQueryString += " values('" + sId + "',"  + nTemperature + ","  + nHumidity + ","  + nGradex + ","  + nGradey + ","  + nGpsquality + ","  + nLatitude + "," + nLongitude ;
	sQueryString += ","  + nSatellite + ","  + nGpsage + ",'"  + sSenttype + "','"  + sSendtime + "' );";
	logger.info(sQueryString);
	pool.query(
		sQueryString,(err, res) => {
			if(err !== undefined) {
				logger.error(err, res);
				pool.end();
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
function anchor(sData) {

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
	var sQueryString = "INSERT INTO public.anchor(id, status, sendtime) values('" + sId + "','"  + sStatus + "',"  + moment().format('YYYYMMDDhhmmss') + " );";
	logger.info(sQueryString);
	pool.query(
		sQueryString,(err, res) => {
			if(err !== undefined) {
				logger.error(err);
				//logger.info(err, res);
				//pool.end();
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
DB.prototype.InsertDB = function(message) {
	var obj=JSON.parse(message);

	for (var sKey in obj) {
		if (obj.hasOwnProperty(sKey)) {
			logger.info(sKey);
			var sData = obj[sKey].split(",");

			if(sKey === "anchor") { 
				anchor(sData);
			} else if( sKey === "boatData") { 
				boatdata(sData);
			}
		}
	}
};


//MQTT에서 잔달된 메세지를 기능별로 구분하여 PostgreSQL에 저장 
DB.prototype.SelectGateBound = function(mObject, callback) {
	
	logger.info('Start SelectGateBound........');
	logger.info( 'GPS X: ' + mObject.gpsX);
	logger.info( 'GPS Y: ' + mObject.gpsY);

	// 아래와 같이 .query 로 쿼리를 날릴 수 있다
	var sQueryString  = "SELECT sector_name FROM public.sector WHERE $1 BETWEEN gpsx1 AND gpsx2 AND $2 BETWEEN gpsy1 AND gpsy2 ";
	logger.info(sQueryString);
	const values = [mObject.gpsX, mObject.gpsY];
	pool.query(
		sQueryString, values, (err, res) => {
			if(err !== undefined) {
				logger.error(err, res);
				pool.end();
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

//객체를 바로 module.exports에 할당
module.exports = DB;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/
