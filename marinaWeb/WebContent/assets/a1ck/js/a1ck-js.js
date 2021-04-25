	var currentDate = new Date();
	var month  = '0' + (currentDate.getMonth() + 1);
	var day    = '0' + (currentDate.getDate());
	var year   = currentDate.getFullYear();
	var month2 = month.substr(month.length - 2,2);
	var day2   = day.substr(day.length - 2,2);
	
	var toDayPoint   = year + "." + month2 + "." +  day2;
	var toDayNoPoint = year + month2 + day2;
	
	function dateNoPoint(sDate) {
		var sDateTemp = sDate + "";
		return sDateTemp.substr(0,4) + sDateTemp.substr(5,2) + sDateTemp.substr(8,2);	
	}

	function toDatePoint(sDate) {
		var sDateTemp = sDate + "";
		return sDateTemp.substr(0,4) + '.' + sDateTemp.substr(4,2) + '.' + sDateTemp.substr(6,2) + ' ' + sDateTemp.substr(8,2) + ':' + sDateTemp.substr(10,2);	
	}
	
	function toMoneyPoint(sMoney,decimalCount) {
	  try {
		    decimal   = ".";
		    thousands = ",";
		    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		    const negativeSign = sMoney < 0 ? "-" : "";

		    let i = parseInt(amount = Math.abs(Number(sMoney) || 0).toFixed(decimalCount)).toString();
		    
		    let j = (i.length > 3) ? i.length % 3 : 0;

		    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(sMoney - i).toFixed(decimalCount).slice(2) : "");
		  } catch (e) {
		    console.log(e)
		  }
	};
	
	function position_cm(obj) {
		var windowWidth  = $(window).width();
		var windowHeight = $(window).height();
		var $obj = $(obj);
		var objWidth  = $obj.width();
		var objHeight = $obj.height();
		$obj.css({
			'left':(windowWidth/2) - (objWidth/2),
			'top':(windowHeight/2) - (objHeight/2)
		})
	} 
	
	function getServer(object, sData){
		
		var selectTag = "";
		var jsonObj = new Object();
		
		jsonObj.__server_id = '*';
		
		$.ajax({
			url: "GetServerCombo",
			dataType:"json", 
			data:{param:JSON.stringify(jsonObj)},
			type:"get",
			success: function(json){
				selectTag = "";
				for (var idx = 0; idx < json.data.length; idx++) {
					selectTag +='<option value="'+ json.data[idx].SERVER_ID + '"';
					if( ((sData == json.data[idx].SERVER_ID) &&  ( sData != 0 )) || 
					    ((idx == 0 ) &&  ( sData == 0 )) )
						selectTag +=' selected' 
					selectTag += '>' + json.data[idx].SERVER_NM +'</option>';
				}
				$(object).append(selectTag);
			}
		}); 
	}
	
	function getServerAll(){
		var selectTag = "";
		jsonObj = {};
		
		jsonObj.server_id = '*';
		jsonObj.rows      = 20  ;
		jsonObj.page      = 1   ;
		
		$.ajax({
		   	url:"GetServerList?param=" + encodeURIComponent(JSON.stringify(jsonObj)),
		   	dataType:"json", 
			type: "get",
			success: function(json){
				
				selectTag = "";
				for (var idx = 0; idx < json.data.length; idx++) {
					selectTag +='<option value="'+ json.data[idx].SERVER_ID + '"';
					selectTag += '>' + json.data[idx].SERVER_NM +'</option>';
				}
				$("#C_SERVER_ID").append(selectTag);
				//console.log(selectTag);
			}
		}); 
	}


	function makeSelect(selectTagId, codelist, data ){
		
		var selectTag= "";
		
		$("#" + selectTagId ).html("");
		
		for (var idx = 0; idx < codelist.length; idx++) {
			selectTag +='<option value="'+ codelist[idx]._CODE_ + '"';
			if(data == '*' && idx == 0)		// 초기화 첫번째 컬럼 선택
				selectTag +=' selected'
			else if(data == codelist[idx]._CODE_) 
				selectTag +=' selected' 
			selectTag += '>' + codelist[idx]._NAME_ +'</option>';
		}
		
	// 	console.log(selectTag);
		
		$("#" + selectTagId).append(selectTag); 
	}

	function getUseSelectOptions(){
		var states = { 'Y': '예', 'N': '아니오' };
		return states;
	}

	function getAllSelectOptions(object,codeclass, data){
		
		//$('#F_DAEMON_STAT_CD').val(getComboBoxByCodeList("DAEMON_STAT_CD", "", true));
		
        $(object).val(data);
        
        return 
//		console.log('...getAllSelectOptions....................');
//		var allData = { "class": codeclass, "code":"*" };
//		
//		$.ajax({
//			url: "CodeClass",
//			data: allData, 
//			dataType: "json",
//			success: function(json){
//				makeSelect(object,json.data, data);
//			}
//		}); 
	}

	function inNumber(){
	  if(event.keyCode<48 || event.keyCode>57){
	     event.returnValue=false;
	  }
	}

	function IsAlphabet(value, length){

		var len = value.length;
		var ch = "";
		var cnt = 0;
		var isAlphabet = false;
		
		if(len != length && 0 != length)
			return isAlphabet;

		for(var i=0;i<len;i++) {
			ch = value.substr(i,1);  
			if(!((ch>="a" && ch<="z")||(ch>="A" && ch<="Z")||(ch>="0" && ch<="9"))){
				cnt++;
			}
		}
		if(cnt==0){isAlphabet = true;}

		return isAlphabet;
	}

	