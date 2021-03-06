#!/usr/bin/env node
/*jshint esversion: 6 */
/**
 * Module dependencies.
 */
var app = require('../app');
var http = require('http');

const logger = require('../config/winston')  //LDH 
const config = require('config');
const callingModule = require('caller-module');
const schedule = require('node-schedule');
const request = require('request');
var HashMap = require('hashmap');

/* 공통 환경 변수 설정 */
global.grade = 0;  //기울기 

process.on('warning', e => console.warn(e.stack));

/**
 * Get port from environment and store in Express.
 */

// MQTT Server 접속
const mqtt_options = {
		  host: '192.168.123.105',
		  port: 1883,
		  protocol: 'mqtt'
		};

var mqtt=require("mqtt");
var client=mqtt.connect(mqtt_options);

//client.setMaxListeners(0);  //  이벤트를 무한대로 등록

client.on("connect" , function(){
	logger.info('MQTT connected........');
	client.subscribe("common");	  //client.subscribe("dht11");
});

client.on("error", function(topic, message){
	logger.error('MQTT ' + topic + ':' + error);
});
	
var DB = require('../public/myModules/db');
// message를 DB에 반영하도록 modules 호출
var db = new DB();

client.on("message", function(topic, message) {
	
	try {
	
		var obj=JSON.parse(message);  // MQTT에서 보내온 메세지
		
		for (var sKey in obj) {
		
			if (obj.hasOwnProperty(sKey)) { 
				
				var sData = obj[sKey].split(",");

				logger.debug("Queue Message:" + sData);
/***
				if( 1 == 1) {  // LDH
					if(sKey === "boatData" && 1 == 1) {
						logger.debug("************************************************");
						logger.debug('MQTT On Message ............... ');
						logger.debug(JSON.stringify(obj));
						logger.debug("************************************************");
						// 보트 단말기에서 보내온 신호 분석
						var BoatCheck = require('../public/myModules/boatCheck');
						var boatCheck = new BoatCheck(sData); 
						boatCheck.getBoatCheck();
						
						
						
					} else if(sKey === "lidarData" && 1 == 1) {
						logger.debug("************************************************");
						logger.debug('MQTT On Message ............... ');
						logger.debug(JSON.stringify(obj));
						logger.debug("************************************************");
						// 정박지 단말기에서 보내온 신호 분석
//						var LidarCheck = require('../public/myModules/lidarCheck');
						var LidarCheck = require('../public/myModules/lidarCheckSim');
						var lidarCheck = new LidarCheck(sData); 
						lidarCheck.getLidarCheck();				
					} else if(sKey === "rssiData" && 1 == 1) {
						logger.debug("************************************************");
						logger.debug('MQTT On Message ............... ');
						logger.debug(JSON.stringify(obj));
						logger.debug("************************************************");
						db.InsertDBRssiData(sData);    // LDH
					}
				}
**/				
			}    
		}
	} catch (err) {
		logger.error("ERROR111:" + err);
	}
	
});



//Recurrence Rule Scheduling
//Sun ~ Sat 0 ~ 6
//월 ~ 일 17시 45분 실행
/**
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = [11,12,13,14,1,16,17,18];
rule.minute = [10,20,30,40,59];
const k = schedule.scheduleJob(rule, () => {
	console.log('Recurrence Rule Scheduling');
})
**/

function ConfigObject()
{ 
	var weather_url; 
	var weather_point; 
}
var configMy  = new ConfigObject(); //메세지 구조체


const job = schedule.scheduleJob('5 5,11,17,23 * * *', function(){
//const job = schedule.scheduleJob('37 * * * *', function(){
	
	Array.prototype.findByValueOfObject = function(key, value) {
		console.log('key:' + key);
		console.log('value:' + value);
	  return this.filter(function(item) {
	    return (item[key] === value);
	  });
	}

	/**
	 * 한글포함 문자열 길이를 구한다
	 */
	function getTextLength(str) {
	    var len = 0;
	    for (var i = 0; i < str.length; i++) {
	        if (escape(str.charAt(i)).length == 6) {
	            len++;
	        }
	        len++;
	    }
	    return len;
	}
	
	db.GetConfig(configMy, function(rtn, configMy){  // 1:제부마리나
		
		if(rtn =="OK") {

			var winddirectArray = [{ id: 'EW', name: '동서'},{ id: 'ES', name: '동남'},{ id: 'EN', name: '동북'},{ id: 'WE', name: '서동'},{ id: 'WS', name: '서남'},{ id: 'WN', name: '서북'},
				 { id: 'SE', name: '남동'},{ id: 'SW', name: '남서'},{ id: 'SN', name: '남북'},{ id: 'NE', name: '북동'},{ id: 'NW', name: '북서'},{ id: 'NS', name: '북남'},
				 { id: 'E', name: '동'},{ id: 'W', name: '서'},{ id: 'S', name: '남'},{ id: 'N', name: '북'}
				 ];
			var windplus = [{ id: 'EW', name: '동서'},{ id: 'ES', name: '동남'}];
			var wfCdArray = [{ id: 'DB01', name: '맑음'},{ id: 'DB03', name: '구름많음'},{ id: 'DB04', name: '흐림'}];
			var rnYnArray = [{ id: '0', name: '강수없음'},{ id: '1', name: '비'},{ id: '2', name: '비/눈'},{ id: '3', name: '눈'},{ id: '4', name: '소나기'}];
			
	    	// 지상  var url = "http://apis.data.go.kr/1360000/VilageFcstMsgService/getLandFcst?serviceKey=acreHrPLywz9jI5R2j00%2FwjvB21qdqFqgo%2Flq1TDn4urwyPBOEnepvoS8rcDtuI0UGGJ4ukQsC4hJn%2BHbQfXeQ%3D%3D&numOfRows=10&pageNo=1&dataType=JSON&regId=11B20604";
	    	// 해양
			var url = configMy.weather_url + configMy.weather_point;
			request(url,{ json: true },function(error, response, body){
				if(!error&&response.statusCode==200) {
					
					console.log("response:==>"+ JSON.stringify(body.response));
					
					if(JSON.stringify(body.response.body.totalCount) > 0 ) {
//						logger.debug("  item :" + JSON.stringify(body.response.body.items.item[0]));   

//						 * 17시부터 ~ 익일 5시 이전
//							0 : 오늘오후
//							1 : 내일오전
//							2 : 내일오후
//							3 : 모레오전
//							
//							5시부터 ~11시 이전
//							0 : 오늘오전
//							1 : 오늘오후
//							2 : 내일오전
//							3 : 내일오후
//							4 : 모래오전
//							5 : 모레오후
//							
//							11시부터 ~ 17시 이전
//							0 : 오늘오후
//							1 : 내일오전
//							2 : 내일오후
//							3 : 모레오전
//							4 : 모레오후

					 
						var getDate = JSON.stringify(body.response.body.items.item[0].tmFc);
						logger.debug("  시각 :" + getDate);   
						
						var wd1     = JSON.stringify(body.response.body.items.item[0].wd1);
						//logger.debug("  풍향1 :[" + wd1 + "]");   
						//var res = JSON.stringify(winddirectArray.findByValueOfObject("id", wd1.substr(1,2)), 0, 4);
						//logger.debug("res:" + res);
						//logger.debug("  풍향1-1 :" + JSON.stringify(res)); 
						//logger.debug("  풍향1-1 :" + JSON.stringify(res.name)); 
						//logger.debug("  풍향1-1 :" + JSON.stringify(res.name.substr(1,res[0].name.length-2))); 

						res = winddirectArray.filter(it => new RegExp(wd1.substr(1,(wd1.length)-2),"i").test(it.id));
						var wd1nm = JSON.stringify(res[0].name);
						logger.debug("  풍향1 :" + JSON.stringify(res[0].name)); 
						//logger.debug("  풍향1-2 :" + JSON.stringify(res)); 
						//logger.debug("  풍향1-2 :" + getTextLength(res[0].name)); 
						//logger.debug("  풍향1-2 :" + JSON.stringify(res[0].name.substr(1,getTextLength(res[0].name)-2))); 
/*						
						var wdTnd   = JSON.stringify(body.response.body.items.item[0].wdTnd); // 1 : (-)  2 : 후
						logger.debug("  풍향연결코드 :" + wdTnd);
						if(wdTnd == 2 ) {
							logger.debug("  이후  :");
						}
						var wd2     = JSON.stringify(body.response.body.items.item[0].wd2);
						logger.debug("  풍향2 :" + wd2);
						logger.debug("  풍향2 :" + wd2.substr(1,(wd2.length)-2));
						res = windplus.filter(it => new RegExp(wd2.substr(1,(wd2.length)-2),"i").test(it.id));
						logger.debug("  풍향2 :" + JSON.stringify(res[0].name)); 
*/						
						var wf      = JSON.stringify(body.response.body.items.item[0].wf);
						logger.debug("  날씨 :" + wf);   
						
						//var wfCd    = JSON.stringify(body.response.body.items.item[0].wfCd); // DB01 : 맑음   DB03 : 구름많음   DB04 : 흐림
						//logger.debug("  날씨코드 :" + wfCd);  
						//res = wfCdArray.filter(it => new RegExp(wfCd.substr(1,(wfCd.length)-2),"i").test(it.id));
						//logger.debug("  날씨코드 :" + JSON.stringify(res[0].name)); 
						
						var wh1     = JSON.stringify(body.response.body.items.item[0].wh1);
						logger.debug("  파고1(m) :" + wh1); 
						
						//var wh2     = JSON.stringify(body.response.body.items.item[0].wh2);
						//logger.debug("  파고2(m) :" + wh2);   
						
						var ws1     = JSON.stringify(body.response.body.items.item[0].ws1);
						logger.debug("  풍속1(m/s) :" + ws1);
						
						//var ws2     = JSON.stringify(body.response.body.items.item[0].ws2);
						//logger.debug("  풍속2(m/s) :" + ws2); 
						
						var rnYn    = JSON.stringify(body.response.body.items.item[0].rnYn); // 0 : 강수없음  1 : 비  2 : 비/눈  3: 눈  4: 소나기
						logger.debug("  강수형태 :" + rnYn); 
						res = rnYnArray.filter(it => new RegExp(rnYn,"i").test(it.id));
						logger.debug("  강수형태 :" + JSON.stringify(res[0].name)); 
						
						db.InsertDBWeather(getDate, wd1nm, wf, wh1, ws1, JSON.stringify(res[0].name)); 
						
					}
				}
			});
		}
    }); 	
	
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

