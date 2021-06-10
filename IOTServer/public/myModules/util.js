/*jshint esversion: 6 */


function getCurrentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = addZero(date.getMonth() + 1);
    var day = addZero(date.getDate());
    var hour = addZero(date.getHours());
    var minute = addZero(date.getMinutes());
    var second = addZero(date.getSeconds());

    var currentTime = year + "" + month + "" + day + "" + hour + "" + minute + "" + second;
    return currentTime;
}

function addZero(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}

function UTIL(message) {
    this.message = message;
}
UTIL.prototype.getCurrentTime = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = addZero(date.getMonth() + 1);
    var day = addZero(date.getDate());
    var hour = addZero(date.getHours());
    var minute = addZero(date.getMinutes());
    var second = addZero(date.getSeconds());

    var currentTime = year + "" + month + "" + day + "" + hour + "" + minute + "" + second;
    return currentTime;	
}


//currentTime = getCurrentTime();

//console.log(currentTime);



//객체를 바로 module.exports에 할당
module.exports = UTIL;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/
