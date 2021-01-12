/**
 * 2018.04.17 khj custom.js 생성
 * 공통함수, 이벤트 등을 설정합니다.
 * 퍼블리싱과 충돌하지 않기위해 생성하였습니다.
 * */

jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

/**
 * input field 숫자만 들어가게
 * **/
$(document).ready(function(){
	$(document).on('keyup foucsout change','[data-valid*="number"]',function(){
		var value = $(this).val();
		$(this).val(value.replace(/[^0-9]/g,''));
	})
	$(document).on('keyup foucsout change','[data-valid*="phone"]',function(){
		var value = $(this).val();
		$(this).val(value.replace(/[^0-9\-]/g,''));
	})
})

/* 레이어팝업 호출 */
function callPopup(id, width, height) {
	if ($("#"+id).is(":hidden")) {
		$("#"+id).show();

		if ($("#"+id).find("iframe").length != 0) { // iframe으로 내용을 불러오는 경우
			var iframeUrl = $("#"+id).find("iframe").data("src");
			$("#"+id).find("iframe").attr("src", iframeUrl);
		}

		var left = ($(window).width() / 2) - ($("#"+id).outerWidth() / 2);
		var top = ($(window).height() / 2) - ($("#"+id).outerHeight() / 2);
		$("#"+id).css({"left": left, "top": top});

		if (!$("#"+id).hasClass("multiple")) { // 다중으로 뜨는 팝업이 아닌 경우
			$(".bg-modal").fadeIn(200); // modal 띄움
		}else{
			dialogOnTop($("#"+id));
		}
	}else {
		dialogOnTop($("#"+id));
	}
}

function dialogOnTop(elem) {
	$(".dialog.multiple.middle").removeClass("middle");
	$(".dialog.multiple.top").removeClass("top").addClass("middle");
	$(".dialog.multiple:visible").removeClass("top");
	$(elem).addClass("top");
}

/* 레이어 팝업 초기화 */
function initPopup() {
	$(".over-modal:visible").fadeOut(200);
	$(".bg-modal").fadeOut(200);
}


/**
 * 2018.04.30 MsgFucntion
 * 공통메시지 처리
 * alert,confirm 추가
 * */
var msgDialog = {
		alert : function(msg,callback){
			// 기본 알람 추가
			alert(msg);
			
			if(callback)
				callback();
		},
		confirm : function(msg,successCallback,failCallback){
			var result = confirm(msg);
			
			if(result){
				if(successCallback)
					successCallback();
			}else{
				if(failCallback)
					failCallback();
			}
		}
}
/**
 * 문자열 Byte 계산
 * */
function strToByte(str){
	var pattern = /[\u0000-\u007f]|([\u0080-\u07ff]|(.))/g;
	return str.replace(pattern, "$&$1").length;
}

/**
 * 문자열 길이 확인 
 * */
function matchMsgToByte(msg,byteLength){
	var count = 0;
	return strToByte(msg) <= byteLength;
}
/**
 * 문자열 byte 미만이 되도록 만듬 
 * */
function makeMsgToByte(msg,byteLength){
	var count = 0;
	
	if(matchMsgToByte(msg,byteLength)){
		tempMsg = msg;
	}else{
		var tempMsg="";
		while (matchMsgToByte(tempMsg,byteLength)) {
			tempMsg=msg.substring(0,count++);
		}
		tempMsg = tempMsg.substring(0,count-2);
	}
	console.log(tempMsg);
	return tempMsg;
}

/**
 * 양력음력 변환
 * */
function gfnSolar2Lunar(sDate)
{
 var sMd = "31,0,31,30,31,30,31,31,30,31,30,31";
 var aMd = new Array();

 var aBaseInfo = new Array();
 var aDt = new Array();  // 매년의 음력일수를 저장할 배열 변수
 var td;     // 음력일을 계산하기 위해 양력일과의 차이를 저장할 변수
 var td1;     // 1840년까지의 날수
 var td2;     // 현재까지의 날수
 var mm;     // 임시변수
 var nLy, nLm, nLd;   // 계산된 음력 년, 월, 일을 저장할 변수
 var sLyoon;     // 현재월이 윤달임을 표시

 if(!sDate)  return "";
 
 sY = parseInt(sDate.substr(0,4), 10);
 sM = parseInt(sDate.substr(4,2), 10);
 sD = parseInt(sDate.substr(6,2), 10);
 if( sY < 1841 || sY > 2043 ) return "";

 aBaseInfo = _SolarBase();
 aMd = sMd.split(",");
 if( gfnIsLeapYear(sDate) == true )     
	 aMd[1] = 29;
 else
	 aMd[1] = 28; 
 
 td1 = 672069;      // 672069 = 1840 * 365 + 1840/4 - 1840/100 + 1840/400 + 23  //1840년까지 날수
  
 // 1841년부터 작년까지의 날수
 td2 = (sY - 1) * 365 + parseInt((sY - 1)/4) - parseInt((sY - 1)/100) + parseInt((sY - 1)/400);
  
 // 전월까지의 날수를 더함
 for( i = 0 ; i <= sM - 2 ; i++ )
	 td2 = td2 + parseInt(aMd[i]);

 // 현재일까지의 날수를 더함
 td2 = td2 + sD;

 // 양력현재일과 음력 1840년까지의 날수의 차이
 td = td2 - td1 + 1;
 
 // 1841년부터 음력날수를 계산
 for( i = 0 ; i <= sY - 1841 ; i++ )
 {
	 aDt[i] = 0;
	 for( j = 0 ; j <= 11 ; j++ )
	 {
		 switch( parseInt(aBaseInfo[i*12 + j]) )
		 {
			 case 1 : mm = 29;
			 break;
			 case 2 : mm = 30;
			 break;    
			 case 3 : mm = 58; // 29 + 29
			 break;    
			 case 4 : mm = 59; // 29 + 30
			 break;    
			 case 5 : mm = 59; // 30 + 29
			 break;    
			 case 6 : mm = 60; // 30 + 30
			 break;    
		 }
		 aDt[i] = aDt[i] + mm;
	 }
 }
  
 // 1840년 이후의 년도를 계산 - 현재까지의 일수에서 위에서 계산된 1841년부터의 매년 음력일수를 빼가면수 년도를 계산
 nLy = 0;
 do{
	 td = td - aDt[nLy];
	 nLy = nLy + 1;
 }while(td > aDt[nLy]);
 
 nLm = 0;
 sLyoon = "0";   // 현재월이 윤달임을 표시할 변수 - 기본값 평달
 do{
	 if( parseInt(aBaseInfo[nLy*12 + nLm]) <= 2 ){
		 mm = parseInt(aBaseInfo[nLy*12 + nLm]) + 28;
		 if( td > mm ){
			 td = td - mm;
			 nLm = nLm + 1;
		 }else
			 break;
	 }else{
		 switch( parseInt(aBaseInfo[nLy*12 + nLm]) )
		 {
		 case 3 :
			 m1 = 29;
			 m2 = 29;
			 break;
		 case 4 : 
			 m1 = 29;
			 m2 = 30;
			 break;     
		 case 5 : 
			 m1 = 30;
			 m2 = 29;
			 break;     
		 case 6 : 
			 m1 = 30;
			 m2 = 30;
			 break;     
		 }

		 if( td > m1 ){
			 td = td - m1;
			 if( td > m2 ){
				 td = td - m2;
				 nLm = nLm + 1;
			 }else{
				 sLyoon = "1";
			 }
		 }else{
			 break;
		 }
	 }
 }while(1);
 
 nLy = nLy + 1841;
 nLm = nLm + 1;
 nLd = td;

 //return sLyoon+nLy+LPAD(nLm,"0", 2)+LPAD(nLd,"0", 2); 윤달 + yyyymmdd
 return nLy+LPAD(nLm,"0", 2)+LPAD(nLd,"0", 2);
}
function _SolarBase()
{
 var kk;
 
 //1841
 kk = "1,2,4,1,1,2,1,2,1,2,2,1,";
 kk += "2,2,1,2,1,1,2,1,2,1,2,1,";
 kk += "2,2,2,1,2,1,4,1,2,1,2,1,";
 kk += "2,2,1,2,1,2,1,2,1,2,1,2,";
 kk += "1,2,1,2,2,1,2,1,2,1,2,1,";
 kk += "2,1,2,1,5,2,1,2,2,1,2,1,";
 kk += "2,1,1,2,1,2,1,2,2,2,1,2,";
 kk += "1,2,1,1,2,1,2,1,2,2,2,1,";
 kk += "2,1,2,3,2,1,2,1,2,1,2,2,";
 kk += "2,1,2,1,1,2,1,1,2,2,1,2,";
 //1851
 kk += "2,2,1,2,1,1,2,1,2,1,5,2,";
 kk += "2,1,2,2,1,1,2,1,2,1,1,2,";
 kk += "2,1,2,2,1,2,1,2,1,2,1,2,";
 kk += "1,2,1,2,1,2,5,2,1,2,1,2,";
 kk += "1,1,2,1,2,2,1,2,2,1,2,1,";
 kk += "2,1,1,2,1,2,1,2,2,2,1,2,";
 kk += "1,2,1,1,5,2,1,2,1,2,2,2,";
 kk += "1,2,1,1,2,1,1,2,2,1,2,2,";
 kk += "2,1,2,1,1,2,1,1,2,1,2,2,";
 kk += "2,1,6,1,1,2,1,1,2,1,2,2,";
 //1861
 kk += "1,2,2,1,2,1,2,1,2,1,1,2,";
 kk += "2,1,2,1,2,2,1,2,2,3,1,2,";
 kk += "1,2,2,1,2,1,2,2,1,2,1,2,";
 kk += "1,1,2,1,2,1,2,2,1,2,2,1,";
 kk += "2,1,1,2,4,1,2,2,1,2,2,1,";
 kk += "2,1,1,2,1,1,2,2,1,2,2,2,";
 kk += "1,2,1,1,2,1,1,2,1,2,2,2,";
 kk += "1,2,2,3,2,1,1,2,1,2,2,1,";
 kk += "2,2,2,1,1,2,1,1,2,1,2,1,";
 kk += "2,2,2,1,2,1,2,1,1,5,2,1,";
 //1871
 kk += "2,2,1,2,2,1,2,1,2,1,1,2,";
 kk += "1,2,1,2,2,1,2,1,2,2,1,2,";
 kk += "1,1,2,1,2,4,2,1,2,2,1,2,";
 kk += "1,1,2,1,2,1,2,1,2,2,2,1,";
 kk += "2,1,1,2,1,1,2,1,2,2,2,1,";
 kk += "2,2,1,1,5,1,2,1,2,2,1,2,";
 kk += "2,2,1,1,2,1,1,2,1,2,1,2,";
 kk += "2,2,1,2,1,2,1,1,2,1,2,1,";
 kk += "2,2,4,2,1,2,1,1,2,1,2,1,";
 kk += "2,1,2,2,1,2,2,1,2,1,1,2,";
 //1881
 kk += "1,2,1,2,1,2,5,2,2,1,2,1,";
 kk += "1,2,1,2,1,2,1,2,2,1,2,2,";
 kk += "1,1,2,1,1,2,1,2,2,2,1,2,";
 kk += "2,1,1,2,3,2,1,2,2,1,2,2,";
 kk += "2,1,1,2,1,1,2,1,2,1,2,2,";
 kk += "2,1,2,1,2,1,1,2,1,2,1,2,";
 kk += "2,2,1,5,2,1,1,2,1,2,1,2,";
 kk += "2,1,2,2,1,2,1,1,2,1,2,1,";
 kk += "2,1,2,2,1,2,1,2,1,2,1,2,";
 kk += "1,5,2,1,2,2,1,2,1,2,1,2,";
 //1891
 kk += "1,2,1,2,1,2,1,2,2,1,2,2,";
 kk += "1,1,2,1,1,5,2,2,1,2,2,2,";
 kk += "1,1,2,1,1,2,1,2,1,2,2,2,";
 kk += "1,2,1,2,1,1,2,1,2,1,2,2,";
 kk += "2,1,2,1,5,1,2,1,2,1,2,1,";
 kk += "2,2,2,1,2,1,1,2,1,2,1,2,";
 kk += "1,2,2,1,2,1,2,1,2,1,2,1,";
 kk += "2,1,5,2,2,1,2,1,2,1,2,1,";
 kk += "2,1,2,1,2,1,2,2,1,2,1,2,";
 kk += "1,2,1,1,2,1,2,5,2,2,1,2,";
 //1901
 kk += "1,2,1,1,2,1,2,1,2,2,2,1,";
 kk += "2,1,2,1,1,2,1,2,1,2,2,2,";
 kk += "1,2,1,2,3,2,1,1,2,2,1,2,";
 kk += "2,2,1,2,1,1,2,1,1,2,2,1,";
 kk += "2,2,1,2,2,1,1,2,1,2,1,2,";
 kk += "1,2,2,4,1,2,1,2,1,2,1,2,";
 kk += "1,2,1,2,1,2,2,1,2,1,2,1,";
 kk += "2,1,1,2,2,1,2,1,2,2,1,2,";
 kk += "1,5,1,2,1,2,1,2,2,2,1,2,";
 kk += "1,2,1,1,2,1,2,1,2,2,2,1,";
 //1911
 kk += "2,1,2,1,1,5,1,2,2,1,2,2,";
 kk += "2,1,2,1,1,2,1,1,2,2,1,2,";
 kk += "2,2,1,2,1,1,2,1,1,2,1,2,";
 kk += "2,2,1,2,5,1,2,1,2,1,1,2,";
 kk += "2,1,2,2,1,2,1,2,1,2,1,2,";
 kk += "1,2,1,2,1,2,2,1,2,1,2,1,";
 kk += "2,3,2,1,2,2,1,2,2,1,2,1,";
 kk += "2,1,1,2,1,2,1,2,2,2,1,2,";
 kk += "1,2,1,1,2,1,5,2,2,1,2,2,";
 kk += "1,2,1,1,2,1,1,2,2,1,2,2,";
 //1921
 kk += "2,1,2,1,1,2,1,1,2,1,2,2,";
 kk += "2,1,2,2,3,2,1,1,2,1,2,2,";
 kk += "1,2,2,1,2,1,2,1,2,1,1,2,";
 kk += "2,1,2,1,2,2,1,2,1,2,1,1,";
 kk += "2,1,2,5,2,1,2,2,1,2,1,2,";
 kk += "1,1,2,1,2,1,2,2,1,2,2,1,";
 kk += "2,1,1,2,1,2,1,2,2,1,2,2,";
 kk += "1,5,1,2,1,1,2,2,1,2,2,2,";
 kk += "1,2,1,1,2,1,1,2,1,2,2,2,";
 kk += "1,2,2,1,1,5,1,2,1,2,2,1,";
 //1931
 kk += "2,2,2,1,1,2,1,1,2,1,2,1,";
 kk += "2,2,2,1,2,1,2,1,1,2,1,2,";
 kk += "1,2,2,1,6,1,2,1,2,1,1,2,";
 kk += "1,2,1,2,2,1,2,2,1,2,1,2,";
 kk += "1,1,2,1,2,1,2,2,1,2,2,1,";
 kk += "2,1,4,1,2,1,2,1,2,2,2,1,";
 kk += "2,1,1,2,1,1,2,1,2,2,2,1,";
 kk += "2,2,1,1,2,1,4,1,2,2,1,2,";
 kk += "2,2,1,1,2,1,1,2,1,2,1,2,";
 kk += "2,2,1,2,1,2,1,1,2,1,2,1,";
 //1941
 kk += "2,2,1,2,2,4,1,1,2,1,2,1,";
 kk += "2,1,2,2,1,2,2,1,2,1,1,2,";
 kk += "1,2,1,2,1,2,2,1,2,2,1,2,";
 kk += "1,1,2,4,1,2,1,2,2,1,2,2,";
 kk += "1,1,2,1,1,2,1,2,2,2,1,2,";
 kk += "2,1,1,2,1,1,2,1,2,2,1,2,";
 kk += "2,5,1,2,1,1,2,1,2,1,2,2,";
 kk += "2,1,2,1,2,1,1,2,1,2,1,2,";
 kk += "2,2,1,2,1,2,3,2,1,2,1,2,";
 kk += "2,1,2,2,1,2,1,1,2,1,2,1,";
 //1951
 kk += "2,1,2,2,1,2,1,2,1,2,1,2,";
 kk += "1,2,1,2,4,2,1,2,1,2,1,2,";
 kk += "1,2,1,1,2,2,1,2,2,1,2,2,";
 kk += "1,1,2,1,1,2,1,2,2,1,2,2,";
 kk += "2,1,4,1,1,2,1,2,1,2,2,2,";
 kk += "1,2,1,2,1,1,2,1,2,1,2,2,";
 kk += "2,1,2,1,2,1,1,5,2,1,2,2,";
 kk += "1,2,2,1,2,1,1,2,1,2,1,2,";
 kk += "1,2,2,1,2,1,2,1,2,1,2,1,";
 kk += "2,1,2,1,2,5,2,1,2,1,2,1,";
 //1961
 kk += "2,1,2,1,2,1,2,2,1,2,1,2,";
 kk += "1,2,1,1,2,1,2,2,1,2,2,1,";
 kk += "2,1,2,3,2,1,2,1,2,2,2,1,";
 kk += "2,1,2,1,1,2,1,2,1,2,2,2,";
 kk += "1,2,1,2,1,1,2,1,1,2,2,1,";
 kk += "2,2,5,2,1,1,2,1,1,2,2,1,";
 kk += "2,2,1,2,2,1,1,2,1,2,1,2,";
 kk += "1,2,2,1,2,1,5,2,1,2,1,2,";
 kk += "1,2,1,2,1,2,2,1,2,1,2,1,";
 kk += "2,1,1,2,2,1,2,1,2,2,1,2,";
 //1971
 kk += "1,2,1,1,5,2,1,2,2,2,1,2,";
 kk += "1,2,1,1,2,1,2,1,2,2,2,1,";
 kk += "2,1,2,1,1,2,1,1,2,2,2,1,";
 kk += "2,2,1,5,1,2,1,1,2,2,1,2,";
 kk += "2,2,1,2,1,1,2,1,1,2,1,2,";
 kk += "2,2,1,2,1,2,1,5,2,1,1,2,";
 kk += "2,1,2,2,1,2,1,2,1,2,1,1,";
 kk += "2,2,1,2,1,2,2,1,2,1,2,1,";
 kk += "2,1,1,2,1,6,1,2,2,1,2,1,";
 kk += "2,1,1,2,1,2,1,2,2,1,2,2,";
 //1981
 kk += "1,2,1,1,2,1,1,2,2,1,2,2,";
 kk += "2,1,2,3,2,1,1,2,2,1,2,2,";
 kk += "2,1,2,1,1,2,1,1,2,1,2,2,";
 kk += "2,1,2,2,1,1,2,1,1,5,2,2,";
 kk += "1,2,2,1,2,1,2,1,1,2,1,2,";
 kk += "1,2,2,1,2,2,1,2,1,2,1,1,";
 kk += "2,1,2,2,1,5,2,2,1,2,1,2,";
 kk += "1,1,2,1,2,1,2,2,1,2,2,1,";
 kk += "2,1,1,2,1,2,1,2,2,1,2,2,";
 kk += "1,2,1,1,5,1,2,1,2,2,2,2,";
 //1991
 kk += "1,2,1,1,2,1,1,2,1,2,2,2,";
 kk += "1,2,2,1,1,2,1,1,2,1,2,2,";
 kk += "1,2,5,2,1,2,1,1,2,1,2,1,";
 kk += "2,2,2,1,2,1,2,1,1,2,1,2,";
 kk += "1,2,2,1,2,2,1,5,2,1,1,2,";
 kk += "1,2,1,2,2,1,2,1,2,2,1,2,";
 kk += "1,1,2,1,2,1,2,2,1,2,2,1,";
 kk += "2,1,1,2,3,2,2,1,2,2,2,1,";
 kk += "2,1,1,2,1,1,2,1,2,2,2,1,";
 kk += "2,2,1,1,2,1,1,2,1,2,2,1,";
 //2001
 kk += "2,2,2,3,2,1,1,2,1,2,1,2,";
 kk += "2,2,1,2,1,2,1,1,2,1,2,1,";
 kk += "2,2,1,2,2,1,2,1,1,2,1,2,";
 kk += "1,5,2,2,1,2,1,2,2,1,1,2,";
 kk += "1,2,1,2,1,2,2,1,2,2,1,2,";
 kk += "1,1,2,1,2,1,5,2,2,1,2,2,";
 kk += "1,1,2,1,1,2,1,2,2,2,1,2,";
 kk += "2,1,1,2,1,1,2,1,2,2,1,2,";
 kk += "2,2,1,1,5,1,2,1,2,1,2,2,";
 kk += "2,1,2,1,2,1,1,2,1,2,1,2,";
 //2011
 kk += "2,1,2,2,1,2,1,1,2,1,2,1,";
 kk += "2,1,6,2,1,2,1,1,2,1,2,1,";
 kk += "2,1,2,2,1,2,1,2,1,2,1,2,";
 kk += "1,2,1,2,1,2,1,2,5,2,1,2,";
 kk += "1,2,1,1,2,1,2,2,2,1,2,2,";
 kk += "1,1,2,1,1,2,1,2,2,1,2,2,";
 kk += "2,1,1,2,3,2,1,2,1,2,2,2,";
 kk += "1,2,1,2,1,1,2,1,2,1,2,2,";
 kk += "2,1,2,1,2,1,1,2,1,2,1,2,";
 kk += "2,1,2,5,2,1,1,2,1,2,1,2,";
 //2021
 kk += "1,2,2,1,2,1,2,1,2,1,2,1,";
 kk += "2,1,2,1,2,2,1,2,1,2,1,2,";
 kk += "1,5,2,1,2,1,2,2,1,2,1,2,";
 kk += "1,2,1,1,2,1,2,2,1,2,2,1,";
 kk += "2,1,2,1,1,5,2,1,2,2,2,1,";
 kk += "2,1,2,1,1,2,1,2,1,2,2,2,";
 kk += "1,2,1,2,1,1,2,1,1,2,2,2,";
 kk += "1,2,2,1,5,1,2,1,1,2,2,1,";
 kk += "2,2,1,2,2,1,1,2,1,1,2,2,";
 kk += "1,2,1,2,2,1,2,1,2,1,2,1,";
 //2031
 kk += "2,1,5,2,1,2,2,1,2,1,2,1,";
 kk += "2,1,1,2,1,2,2,1,2,2,1,2,";
 kk += "1,2,1,1,2,1,5,2,2,2,1,2,";
 kk += "1,2,1,1,2,1,2,1,2,2,2,1,";
 kk += "2,1,2,1,1,2,1,1,2,2,1,2,";
 kk += "2,2,1,2,1,4,1,1,2,1,2,2,";
 kk += "2,2,1,2,1,1,2,1,1,2,1,2,";
 kk += "2,2,1,2,1,2,1,2,1,1,2,1,";
 kk += "2,2,1,2,5,2,1,2,1,2,1,1,";
 kk += "2,1,2,2,1,2,2,1,2,1,2,1,";
 //2041
 kk += "2,1,1,2,1,2,2,1,2,2,1,2,";
 kk += "1,5,1,2,1,2,1,2,2,2,1,2,";
 kk += "1,2,1,1,2,1,1,2,2,1,2,2";
 
 var arr = new Array();
 arr = kk.split(",");
 
 return arr;
}

function gfnIsLeapYear(sDate)
{
    var ret;
    var nY;
    
    if( !sDate )  return false;
    
    nY = parseInt(sDate.substring(0,4), 10);

    if ((nY % 4) == 0) 
    {
        if ((nY % 100) != 0 || (nY % 400) == 0) 
            ret = true;
        else 
            ret = false;
    } 
    else 
        ret = false;
  
    return ret;
}

function LPAD(s, c, n) {
	//문자열, 채울문자, 길이
    if (! s || ! c || s.length >= n) {
        return s;
    }
 
    s = s.toString();
    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
        s = c+ "" + s;
    }
 
    return s;
}
 
// 오른쪽에서부터 채운다는 의미
function RPAD(s, c, n) {
	//문자열, 채울문자, 길이
    if (! s || ! c || s.length >= n) {
        return s;
    }
 
    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }
 
    return s;
}
 
//금액포멧 3자리마다  ',' 추가
function cfn_addComma(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}

function validator(queryParam){
	var field = $(queryParam);
	var validlist = field.data('valid');
	if(validlist){
		var validarr = validlist.split("|");
		for (var i = 0; i < validarr.length; i++) {
			switch (validarr[i]) {
			case "req":
				if(!field.val()){
					msgDialog.alert(field.attr('title')+'항목은 필수 입니다.');
					field.focus();
					return false;
				}
				break;

			case "nubmer":
				if(!regCheck(field.val(),/^[0-9]+$/)){
					msgDialog.alert(field.attr('title')+'항목은 숫자만 입력해주세요.');
					field.focus();
					return false;
				}
				break;
				
			case "email":
				if(!regCheck(field.val(),/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i)){
					msgDialog.alert(field.attr('title')+'항목은 이메일형식을 입력해주세요.');
					field.focus();
					return false;
				}
				break;
				
			case "phone":
				if(!regCheck(field.val(),/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/)){
					msgDialog.alert("잘못된 휴대폰 번호입니다. 숫자, - 를 포함한 숫자만 입력하세요.");
					field.focus();
					return false;
				}
				break;
			case "tel":
				if(!regCheck(field.val(),/^([0-9]{2,3})-?([0-9]{3,4})-?([0-9]{4})$/)){
					msgDialog.alert("잘못된 번호입니다. 숫자, - 를 포함한 숫자만 입력하세요.");
					field.focus();
					return false;
				}
				break;		

			default:
				break;
			}
		}
	}
	return true;
}

function regCheck(message,regExp){
	return regExp.test(message);
}
function numberStep(inputField,step,min,max){
	var changeVal=0;
	
	var orgVal = Number($(inputField).val());
	try{
		changeVal = orgVal + step;
		if(min != null && min != undefined)
			changeVal = (changeVal < min) ? min:changeVal;
			
		if(max != null && max != undefined)
			changeVal = (changeVal > max) ? max:changeVal;

	}catch(e){
		console.log(e)
	}
		
	$(inputField).val(changeVal);
	$(inputField).trigger("change");
	$(inputField).trigger("focusout");
	
}

/**
 * AJAX loading event
 * */
$.ajaxSetup({
	beforeSend:function(jqXHR){
		//(이미지 보여주기 처리)
		$('.wrap-loading').show(300);
		jqXHR.setRequestHeader("AJAX", true);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		
	},
	complete:function(jqXHR, textStatus, errorThrown){
		// (이미지 감추기 처리)
		$('.wrap-loading').hide(300);
		
		var errorStatus = jqXHR.status;
		if(errorStatus == 500){
			msgDialog.alert("서버 에러가 발생하였습니다. \n 자세한 내용은 에러 로그를 확인하세요");
		}else if(errorStatus == 404){
			msgDialog.alert("페이지를 찾을 수 없습니다.");
		}else if(errorStatus == 404){
			msgDialog.alert("권한이 없습니다. 로그인 페이지로 이동합니다.", function(e){
				location.reload();
			});
		}else if(errorStatus == 401){
			msgDialog.alert("권한이 없습니다. 로그인 페이지로 이동합니다.", function(e){
				location.reload();
			});
		}else if(errorStatus == 302){
     		location.href = "/";
     	}
	}
});