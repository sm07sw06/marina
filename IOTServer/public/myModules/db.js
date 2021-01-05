var moment = require('moment');

const { Pool, clientpg } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "192.168.123.105",
  database: "postgres",
  password: "topadmin",
  port: "5432"
});

function DB(message) {
	this.message = message;
}

function boatdata(sData) {

	//console.log(sData);
	
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
	
	console.log(nGradex);
	console.log(nGradey);	
	
	if(nTemperature === "") nTemperature = 0;
	if(nHumidity    === "") nHumidity = 0;
	if(nGradex      === "") nGradex = 0;
	if(nGradey      === "") nGradey = 0;
	if(nGpsquality  === "") nGpsquality = 0;
	if(nLatitude    === "") nLatitude = 0;
	if(nLongitude   === "") nLongitude = 0;
	if(nSatellite   === "") nSatellite = 0;
	if(nGpsage      === "") nGpsage = 0;
	if(sSenttype    === "") sSenttype = 'R';

	/**
	console.log(sId);
	console.log(nTemperature);
	console.log(nHumidity   );
	console.log(nGradex     );
	console.log(nGradey     );
	console.log(nGpsquality );
	console.log(nLatitude   );
	console.log(nLongitude  );
	console.log(nSatellite  );
	console.log(nGpsage     );
	console.log(sSenttype   );
	console.log(sSendtime   );	
	**/
	
// 아래와 같이 .query 로 쿼리를 날릴 수 있다
   var sQueryString  = "INSERT INTO public.boatdata(id, temperature, humidity, gradex, gradey, gpsquality, latitude, longitude, satellite, gpsage, senttype, sendtime) ";
   sQueryString += " values('" + sId + "',"  + nTemperature + ","  + nHumidity + ","  + nGradex + ","  + nGradey + ","  + nGpsquality + ","  + nLatitude + "," + nLongitude ;
   sQueryString += ","  + nSatellite + ","  + nGpsage + ",'"  + sSenttype + "','"  + sSendtime + "' );";
   console.log(sQueryString);
   pool.query(
		   sQueryString,(err, res) => {
			   if(err != undefined)
				   console.log(err);
//				console.log(err, res);
//			   pool.end();
		   }
   );
}


function larva(sData) {

	console.log(sData);
	
	var sId = sData[0];
	var sIp = sData[1];
	var nAmmonia = sData[2];
	
	if(sIp === "") { sIp = '0'; }
	if(nAmmonia === "") nAmmonia = 0;

// 아래와 같이 .query 로 쿼리를 날릴 수 있다
   var sQueryString = "INSERT INTO public.larva(id, ip, ammonia) values('" + sId + "','"  + sIp + "',"  + nAmmonia + " );";
   console.log(sQueryString);
   pool.query(
		   sQueryString,(err, res) => {
			   if(err != undefined)
				   console.log(err);
//				console.log(err, res);
//			   pool.end();
		   }
   );
}

function anchor(sData) {

	console.log(sData);
	
	var sId       = sData[0];
	var sIp       = sData[1];
	var nDistance = sData[2];
	var sStatus   = "";
	
	if(nDistance === "")  { nDistance = 0; }
	
	console.log(nDistance);
	
	if ( nDistance < 100) { // 버트 계류시 상태변경 ==> status : 1
		sStatus = '1';
	} else {
		sStatus = '0';
	}

// 아래와 같이 .query 로 쿼리를 날릴 수 있다
   var sQueryString = "INSERT INTO public.anchor(id, status, sendtime) values('" + sId + "','"  + sStatus + "',"  + moment().format('YYYYMMDDhhmmss') + " );";
   console.log(sQueryString);
   pool.query(
		   sQueryString,(err, res) => {
			   if(err != undefined)
				   console.log(err);
//				console.log(err, res);
//			   pool.end();
		   }
   );
}


DB.prototype.getDB = function() {
	return {message: this.message};
}

DB.prototype.InsertDB = function() {
	   var obj=JSON.parse(this.message);
	   
	   for (sKey in obj) {
		   console.log(sKey);
		   var sData = obj[sKey].split(",");
		   
		   if(sKey === "larva") larva(sData);
		   else if(sKey === "anchor") anchor(sData);
		   else if(sKey === "boatData") boatdata(sData);
	   }
}

//객체를 바로 module.exports에 할당
module.exports = DB;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/

