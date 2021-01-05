var moment = require('moment');

function BoatCheck(message) {
	this.message = message;
}


function boatdata(sData) {

}


BoatCheck.prototype.getBoatCheck = function() {
	console.log("Start getBoatCheck........");
	
	   var obj=JSON.parse(this.message);
	   
	   for (sKey in obj) {

		   console.log(sKey);
			   
			if(sKey != "boatData") return -1;

			var sData = obj[sKey].split(",");
	
			var sId          = sData[9];
			var nTemperature = sData[16];
			var nHumidity    = sData[17];
			var nGradex      = sData[18];
			var nGradey      = sData[19];
			var nLatitude    = sData[22];
			var nLongitude   = sData[24];
			
			console.log(nGradex);
			console.log(nGradey);	
			
			if(nTemperature === "") nTemperature = 0;
			if(nHumidity    === "") nHumidity = 0;
			if(nGradex      === "") nGradex = 0;
			if(nGradey      === "") nGradey = 0;
			if(nLatitude    === "") nLatitude = 0;
			if(nLongitude   === "") nLongitude = 0;
			
			if ((nGradex > 60) || (nGradey>60)) { //기울기가 60도 이상이면 보트가 좌초하는 경우로 자동 SOS 요청신호로 간주
				console.log("Starting SOS processing.......");
				setDashBoard();
			} else {
				
			}
			
	   }
	   
	return {message: this.message};
}


BoatCheck.prototype.InsertDB = function() {
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
module.exports = BoatCheck;

/***
var BoatCheck = require('./boatCheck');
var boatCheck = new BoatCheck(message); 

boatCheck.getBoatCheck();

***/

