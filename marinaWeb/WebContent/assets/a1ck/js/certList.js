$(document).ready(function() {
	
	/* 전일자 만들기 */
	function yesterday() {
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate()-1); 
		var year= yesterday.getFullYear();
		var mon = (yesterday.getMonth()+1)>9 ? ''+(yesterday.getMonth()+1) : '0'+(yesterday.getMonth()+1);
		var day = yesterday.getDate()>9 ? ''+yesterday.getDate() : '0'+yesterday.getDate();
		var chan_val = year + '-' + mon + '-' + day;
		//console.log(chan_val);
		return chan_val;
	}
	
	/* 월시작일 만들기 */
	function monthStart() {
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate()-1); 
		var year= yesterday.getFullYear();
		var mon = (yesterday.getMonth()+1)>9 ? ''+(yesterday.getMonth()+1) : '0'+(yesterday.getMonth()+1);
		var chan_val = year + '-' + mon + '-01' ;
		//console.log(chan_val);
		return chan_val;
	}
	
	var oTable =  $('#uTable').DataTable({
 			dom: 'Bfrtip',
			language: {
				"decimal":        "",
			    "emptyTable":     "데이타가 없습니다.",
			    "info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
			    "infoEmpty":      "전체 0 건",
			    "infoFiltered":   "(총 _MAX_ 개)",
			    "infoPostFix":    "",
			    "thousands":      ",",
			    "lengthMenu":     "페이지당 줄수 _MENU_",
			    "loadingRecords": "조회중...",
			    "processing":     "처리중...",
			    "search":         "검색:",
			    "zeroRecords":    "검색 결과가 없습니다.",
			    "paginate": {
			        "first":      "처음",
			        "last":       "마지막",
			        "next":       "다음",
			        "previous":   "이전"
			    },
			    "aria": {
			        "sortAscending":  ": 오름차순 정렬",
			        "sortDescending": ": 내림차순 정렬"
			    }
	        },	
			buttons: [
	            {
	                extend: 'excelHtml5',
	                title: '인증목록'
	            }
	        ],	        
			 searching: false
	});
	
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
	
	//position_cm($('#jspcontents'));
	
	
	function refreshRisk()  {
		var obj = new Object();
		
		obj.customer_name = $('#f_customer_name').val();
		obj.contract_no   = $('#f_contract_no').val(); 
		obj.charge_user   = $('#f_charge_user').val();
		obj.mac           = $('#f_mac').val(); 
		obj.system_code   = $('#f_system_code').val();
		obj.duty_code     = $('#f_duty_code').val(); 
		obj.f_from        = $('#f_from').val();
		obj.f_to          = $('#f_to').val(); 		
		
	
		oTable = $('#uTable').DataTable({
 			dom: 'Bfrtip',
 			select: true,
			processing: true,
			serverSide: false,
			searching: false,
			destroy: true,
			pagingType: "full_numbers",
			pageLength: 10,
			ajax: {
		        url:"GetCertiKey",
				dataType:"json", 
				type: "get",
				data : {param:JSON.stringify(obj)},
				dataSrc:function(json) {
					if(json.result=="OK") {
						//alert("Done!");
					} else if(json.result=="COUNTOVER") { 
						alert("검색 조건의 데이터가 너무 많습니다. 검색조건을 다시 설정해 주세요.");
					} else if(json.result=="NOTFOUND") { 
						alert("검색 조건에 해당하는 데이터가 없습니다.!");
					} else {
						alert("검색중 오류가 발생 했습니다.");
					}
					return json.data;
				}
			},
			//"initComplete":function( settings, json){
	        //    console.log(json);
	        //    // call your function here
	        //},
			language: {
				"decimal":        "",
			    "emptyTable":     "데이타가 없습니다.",
			    "info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
			    "infoEmpty":      "전체 0 건",
			    "infoFiltered":   "(총 _MAX_ 개)",
			    "infoPostFix":    "",
			    "thousands":      ",",
			    "lengthMenu":     "페이지당 줄수 _MENU_",
			    "loadingRecords": "조회중...",
			    "processing":     "처리중...",
			    "search":         "검색:",
			    "zeroRecords":    "검색 결과가 없습니다.",
			    "paginate": {
			        "first":      "처음",
			        "last":       "마지막",
			        "next":       "다음",
			        "previous":   "이전"
			    },
			    "aria": {
			        "sortAscending":  ": 오름차순 정렬",
			        "sortDescending": ": 내림차순 정렬"
			    }
			},			
			buttons: [
	            {
	                extend: 'excelHtml5',
	                title: '인증목록'
	            }
	        ]
            ,columns : [
                {"data":"customer_name"},		 	 
                {"data":"contract_no"},			 
                {"data":"system_code"},		  
                {"data":"duty_code"},			 
                {"data":"mac"},
                {"data":"charge_user"},			 
                {"data":"issue_reason"},
                {"data":"inserttime"}		
     	    ]
//     	    ,columnDefs: [
 //    	        { targets: [1], visible: false}
 //    	    ]
//     	   ,"aoColumnDefs": [ { "sDefaultContent": "",
//     		  "aTargets": [ "_all" ]
//     		  } ]
		});
	 }
  
	$('#btnQuery').click(function (e) {
		refreshRisk();
	});
	
	$("#btnCertInsert").click(function (e) {
		var redirect_url = "/FaceCertiKey/certInsert.jsp";
		window.location.href = redirect_url;		
	});
	
	$('#f_from').val(monthStart());
	$('#f_to').val($.datepicker.formatDate('yy-mm-dd',new Date()));
	
	$("#f_customer_name").focus();

	
	$("#btnCertExcel").click(function () {
	    tableToExcel('uTable', 'W3C Example Table');
	});

	var tableToExcel = (function () {
	    var uri = 'data:application/vnd.ms-excel;base64,'
	      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
	      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
	      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
	    return function (table, name) {
	        if (!table.nodeType) table = document.getElementById(table)
	        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
	        window.location.href = uri + base64(format(template, ctx))
	    }
	})()
	
	refreshRisk();
	
});
