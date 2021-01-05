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

DB.prototype.getDB = function() {
	return {message: this.message};
}

DB.prototype.InsertDB = function() {
	   var obj=JSON.parse(this.message);
//	   console.log(obj);
	   
	   for (sKey in obj) {
		   console.log(sKey);
		   
		   if(sKey == "larva") {
			    var sData = obj[sKey].split(",");
				var sId = sData[0];
				var sIp = sData[1];
				var nAmmonia = sData[2];
				
				if(sIp == "") sIp = '0';
				if(nAmmonia == "") nAmmonia = 0;

				console.log(sData[0]);
				console.log(sData[1]);
				console.log(sData[2]);
		
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
	   }
	   
}

//객체를 바로 module.exports에 할당
module.exports = DB;

/***
var DB = require('./db');
var db = new DB(message); 

db.InsertDB();

***/

	
