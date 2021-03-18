$(document).ready(function() {
	
	getServer('1');

	var oTable =  $('#uTable').DataTable({
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
	
	function getServer(sData){
		var selectTag = "";
		var obj = new Object();
		
		obj.server_id = '*';
		
		$.ajax({
			url: "GetServerList",
			dataType:"json", 
			type: "get",
			data: {param:JSON.stringify(obj)},
			success: function(json){
				console.log(json);
				console.log(json.data.length); 
				console.log(json.data);
				
				selectTag = "";
				for (var idx = 0; idx < json.data.length; idx++) {
					selectTag +='<option value="'+ json.data[idx].SERVER_ID + '"';
					if(sData == json.data[idx].SERVER_ID) 
						selectTag +=' selected' 
					selectTag += '>' + json.data[idx].SERVER_NM +'</option>';
				}
				$("#C_SERVER_ID").append(selectTag);
				console.log(selectTag);
			}
		}); 
	}

	function getJson(object,codeclass, data){
		var allData = { "class": codeclass, "code":"*" };
		$.ajax({
			url: "GetCodeList",
			data: allData, 
			dataType: "json",
			success: function(json){
				makeSelect(object,json.data, data);
			}
		}); 
	}

	function makeSelect(selectTagId, codelist, data ){
		
		var selectTag= "";
		
		$("#" + selectTagId ).html("");
		
		for (var idx = 0; idx < codelist.length; idx++) {
			selectTag +='<option value="'+ codelist[idx]._CODE_ + '"';
			if(data == codelist[idx]._CODE_) 
				selectTag +=' selected' 
			selectTag += '>' + codelist[idx]._NAME_ +'</option>';
		}
		
		console.log(selectTag);
		
		$("#" + selectTagId).append(selectTag); 
	}
	
	function refreshRisk()  
	{
		var obj = new Object();
		
		obj.server_id = $('#C_SERVER_ID').val();
		obj.work_cd = '*';
		
		$('#CRUD').val("U")
		
		oTable = $('#uTable').DataTable({
 			dom: 'Brtip',
 			select: true,
			processing: true,
			serverSide: false,
			searching: false,
			destroy: true,
			pagingType: "full_numbers",
			pageLength: 16,
			ajax: {
		        url:"GetWorkList",
				dataType:"json", 
				type: "get",
				data : {param:JSON.stringify(obj)}
			},
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
            columns : [
                {"data":"SERVER_ID"},			 
                {"data":"SERVER_NM"},			 
                {"data":"WORK_CD"},		 
                {"data":"WORK_NM"},		 
                {"data":"ACCOUNT_CD"},		 
                {"data":"DESCRIPTION"}
     	    ]
	        ,columnDefs: [
     	        { targets: [0], visible: false}
     	    ]		     		  
		});		
		$('#F_WORK_CD'    ).attr("readonly", true); //설정
	 }

	function loadInfo(server_id, work_cd) {
		
		var obj = new Object();
		obj.server_id  = server_id;
		obj.work_cd    = work_cd;
		
		console.log(obj.server_id);
		console.log(obj.work_cd);
		
		$.ajax({
			url: 'GetWorkList',    
			data: {param:JSON.stringify(obj)},
			dataType:"json",
			success: function(json_data) {
	
		        if(json_data.result == 'OK') {
		        	
			        $('#F_SERVER_ID').val(json_data.data[0].SERVER_ID);
			        $('#F_SERVER_NM').val(json_data.data[0].SERVER_NM);
			        $('#F_WORK_CD' ).val(json_data.data[0].WORK_CD);
			        $('#F_WORK_NM' ).val(json_data.data[0].WORK_NM);
			        $('#F_ACCOUNT_CD' ).val(json_data.data[0].ACCOUNT_CD);
			        $('#F_DESCRIPTION' ).val(json_data.data[0].DESCRIPTION);
			        $('#F_WORK_CD'    ).attr("readonly", true ); //설정
			        //getJson("F_SERVER_ID","WORK_CD",json_data.data[0].WORK_CD);
			        
				} else {
					console.log(json_data.result); 
				}
			}
		});	
	};	
   
    $('#uTable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
        	oTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        //console.log( oTable.rows('.selected').data()[0].name);
        
        var sData = oTable.rows('.selected').data()[0];
        
        loadInfo(sData.SERVER_ID, sData.WORK_CD);

    } );
    
	$('#btnQuery').click(function (e) {
		refreshRisk();
		
	});
	
	$('#btnCancel').click(function (e) {
		$('#searchVal').val("");
		$("#searchVal").focus();
	});

	$('#btnAdd').click(function (e) {
		$('#F_SERVER_ID'  ).val($('#C_SERVER_ID'  ).val());
		$('#F_WORK_CD'    ).val("");
		$('#F_WORK_NM'    ).val("");
		$('#F_ACCOUNT_CD' ).val("");
		$('#F_DESCRIPTION').val("");
		$('#CRUD'         ).val("C");
		$('#F_WORK_CD'    ).attr("readonly", false); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.work_cd     = $("input#F_WORK_CD").val();
		obj.work_nm     = "";
		obj.account_cd  = "";
		obj.description = "";
		obj.crud        = "D";
		
		console.log('F_SERVER_ID:'+ obj.server_id);
		console.log('F_WORK_CD:'+ obj.work_cd);
		console.log('sCrud:'+ obj.crud);

		$("#SetEmpForm").ajaxForm({
			url : 'SetWork',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				//$('#btl02', parent.document).click();
				//$('#iframItemRange').reload();
				refreshRisk();
				$('#F_SERVER_ID'  ).val($('#C_SERVER_ID'  ).val());
				$('#F_WORK_CD'    ).val("");
				$('#F_WORK_NM'    ).val("");
				$('#F_ACCOUNT_CD' ).val("");
				$('#F_DESCRIPTION').val("");
				$('#CRUD'         ).val("C");
				$('#F_WORK_CD'    ).attr("readonly", false); //설정				
			},
			error : function(data, status){
		    	if (data != null){
		    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 서버에서 전달
		    			// data 오브젝트에 error의 값이 2일 때의 이벤트 처리
		    			alert("이미 등록되어 있는 아이디 입니다.");
		    		} else {
		    			alert("Error");
		    		}
		    	}
			}
		});	
		$("#SetEmpForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.work_cd     = $("input#F_WORK_CD").val();
		obj.work_nm     = $("input#F_WORK_NM").val();
		obj.account_cd  = $("input#F_ACCOUNT_CD").val();
		obj.description = $("textarea#F_DESCRIPTION").val();
		obj.crud        = $("input#CRUD").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('F_SERVER_ID:'+ obj.server_id); 
		console.log('F_WORK_CD:'+ obj.work_cd);
		console.log('F_WORK_NM:'+ obj.work_nm);
		console.log('F_ACCOUNT_CD:'+ obj.account_cd);
		console.log('F_DESCRIPTION:'+ obj.description);
		
		if(obj.work_nm == ''){
			alert("[알림] 업무명을 입력하세요.");
			$("input#F_WORK_NM").focus();
		    return;
		}

		$("#SetEmpForm").ajaxForm({
			url : 'SetWork',
			dataType:'json',
			type: 'post',
	/*		data: {
				SERVER_ID: sServer,
				WORK_CD: sWorkCd, 
				WORK_NM: sWorkNm,
				ACCOUNT_CD: sAccountCd,
				DESCRIPTION: sDescription,
				CRUD: sCrud,
			},*/
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				//$('#btl02', parent.document).click();
				//$('#iframItemRange').reload();
				refreshRisk();
			},
			error : function(data, status){
		    	if (data != null){
		    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 서버에서 전달
		    			// data 오브젝트에 error의 값이 2일 때의 이벤트 처리
		    			alert("이미 등록되어 있는 아이디 입니다.");
		    		} else {
		    			alert("Error");
		    		}
		    	}
			}
		});	
		$("#SetEmpForm").submit() ;
	});

	
	$("#searchVal").focus();

});
