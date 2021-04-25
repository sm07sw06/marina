$(document).ready(function() {
	
	
	function emailCheck(email_address){	
		email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i; 
		if(!email_regex.test(email_address)) { 
			return false; 
		} else {
			return true; 
		}
	}
		
	
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
	
	function IsAlphabet(value){
		
		 var len = value.length;
		 var ch = "";
		 var cnt = 0;
		 var isAlphabet = false;
		 if(len != 12 )
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
	

	$('#btnCertiKey').click(function (e) {

		var sUser     = $("input#SEQNO_USER").val();
		var sCustomer = $("input#CUSTOMER").val();
		var sContract = $("input#CONTRACT_NO").val();
		var sMac      = $("input#MAC").val();
		var sReason   = $("textarea#ISSUE_REASON").val();
		var sSystem   = "";
		var sDuty     = "";

		if( $("input[name=SYSTEM_CODE]:checked").val() == 'S' ) {
			sSystem = "S";
		} else {
			sSystem = "C";
		}
		if( $("input[name=DUTY_CODE]:checked").val() == 'A' ) {
			sDuty = "A";
		} else {
			sDuty = "M";
		}

		if(sCustomer == ''){
			alert("[알림] 고객명을 입력하세요.");
			$("input#CUSTOMER").focus();
		    return;
		}
		if(sContract == ''){
			alert("[알림] 계약번호를 입력하세요.");
			$("input#CONTRACT_NO").focus();
		    return;
		}
		/* if(sMac == ''){
			alert("[알림] Mac주소를 입력하세요.");
			$("input#MAC").focus();
		    return;
		}*/

		if (!IsAlphabet(sMac)) {
			alert("[알림] Mac주소를 정확하게 입력하세요.");
			$("input#MAC").focus();
		    return;			
		}
		
		var formData = new FormData();
		$.ajax({
			url: "SetCertiKey",
			dataType: 'json',	
			data: {
				SEQNO_USER: sUser,
				CUSTOMER: sCustomer, 
				CONTRACT_NO: sContract,
				MAC: sMac,
				SYSTEM_CODE: sSystem,
				DUTY_CODE: sDuty,
				ISSUE_REASON: sReason,
			},
			success: function(json_data) {

		        if(json_data.result == 'success') {
		        	$("input#CERTIFICATION_KEY").val(json_data.data);
		        	alert("[알림]발급되었습니다.");
		        	
		        } else {
					alert("[오류]"+json_data.message);
		        }
			}

		});	
	});
	
	$("#btnCertiList").click(function (e) {
		var redirect_url = "/FaceCertiKey/certList.jsp";
		window.location.href = redirect_url;		
	});
	

	//position_cm($(".login-container"));
	
});


