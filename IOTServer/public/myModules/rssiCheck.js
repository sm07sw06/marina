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

function RssiCheck(message) {
    this.message = message;
}



//객체를 바로 module.exports에 할당
module.exports = RssiCheck;

/***

select *
  from tb_boatdata b, tb_rssidata r
 where b.machine_id = r.boat_recv_id
   AND b.send_time between to_char((to_timestamp(r.send_time, 'YYYYMMDDHH24MISS') - interval '2 sec'),'YYYYMMDDHH24MISS')
                       AND to_char((to_timestamp(r.send_time, 'YYYYMMDDHH24MISS') + interval '2 sec'),'YYYYMMDDHH24MISS')


***/

