$(document).ready(function() {
	
	//getServer(1);

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
			url: "GetDaemonList",
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
		
	//	console.log(selectTag);
		
		$("#" + selectTagId).append(selectTag); 
	}
	
	function refreshData()  
	{
		var obj = new Object();
		
		obj.daemon_id = '*';
		
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
		        url:"GetDaemonList",
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
                {"data":"DAEMON_ID"},			 
                {"data":"DAEMON_NM"},			 
                {"data":"DAEMON_PORT"},		 
                {"data":"DETAIL_NM"},		 
                {"data":"START"},		 
                {"data":"STOP"}
     	    ]
	 //       ,columnDefs: [
     //	        { targets: [3,6,8,9,11], visible: false}
     //	    ]		     		  
		});		
		$('#F_DAEMON_ID').attr("readonly", true); //설정
	 }

	function loadInfo(daemon_id) {
		
		var obj = new Object();
		obj.daemon_id   = daemon_id;
		
		$.ajax({
			url: 'GetDaemonList',    
			data: {param:JSON.stringify(obj)},
			dataType:"json",
			success: function(json_data) {
	
				console.log(json_data);
				
		        if(json_data.result == 'OK') {

			        $('#F_DAEMON_ID').val(json_data.data[0].DAEMON_ID);
			        $('#F_DAEMON_NM').val(json_data.data[0].DAEMON_NM);
			        $('#F_DAEMON_IP').val(json_data.data[0].DAEMON_IP);
			        $('#F_DAEMON_PORT').val(json_data.data[0].DAEMON_PORT);
			        $('#F_DAEMON_DESC').val(json_data.data[0].DAEMON_DESC);
			        getJson("F_DAEMON_STAT_CD","DAEMON_STAT_CD",json_data.data[0].DAEMON_STAT_CD);
		    		$('input[name="F_AUTO_RESTART_YN"]').val([json_data.data[0].AUTO_RESTART_YN]);
		    		$('input[name="F_USE_YN"]').val([json_data.data[0].USE_YN]);
			        $('#F_DAEMON_ID').attr("readonly", true ); //설정
			        
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
        var sData = oTable.rows('.selected').data()[0];
        
        loadInfo(sData.DAEMON_ID);

    } );
    
	$('#btnQuery').click(function (e) {
		refreshData();
		
	});
	
	$('#btnCancel').click(function (e) {
		$('#searchVal').val("");
		$("#searchVal").focus();
	});

	
	$('#btnAdd').click(function (e) {

		$('#F_DAEMON_ID').val("");
		$('#F_DAEMON_NM').val("");
		$('#F_DAEMON_IP').val("");
		$('#F_DAEMON_PORT').val("");
		$('#F_DAEMON_DESC').val("");
		$('#F_DAEMON_STAT_CD').val("");
		$('input[name="F_AUTO_RESTART_YN"]').val(["Y"]);
		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#CRUD').val("C");
		$('#F_DAEMON_ID'  ).attr("readonly", true); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.daemon_id   = $("input#F_DAEMON_ID").val();
		obj.crud        = "D";
		
		console.log('F_DAEMON_ID:'+ obj.daemon_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetDaemonForm").ajaxForm({
			url : 'SetDaemon',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				refreshData();
				$('#F_DAEMON_ID').val("");
				$('#F_DAEMON_NM').val("");
				$('#F_DAEMON_IP').val("");
				$('#F_DAEMON_PORT').val("");
				$('#F_DAEMON_DESC').val("");
				$('#F_DAEMON_STAT_CD').val("");
				$('input[name="F_AUTO_RESTART_YN"]').val(["Y"]);
				$('input[name="F_USE_YN"]').val(["Y"]);

				$('#CRUD').val("C");
				$('#F_SERVER_ID'  ).attr("readonly", true); //설정			
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
		$("#SetDaemonForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.daemon_id   = $("input#F_DAEMON_ID").val();
		obj.daemon_nm   = $("input#F_DAEMON_NM").val();
		obj.daemon_ip   = $("input#F_DAEMON_IP").val();
		obj.daemon_port = $("input#F_DAEMON_PORT").val();
		obj.daemon_desc = $("textarea#F_DAEMON_DESC").val();
		obj.daemon_stat_cd  = $("select#F_DAEMON_STAT_CD").val();
		obj.auto_restart_yn = $('input[name="F_AUTO_RESTART_YN"]:checked').val()
		obj.use_yn      = $('input[name="F_USE_YN"]:checked').val()
		obj.crud        = $("input#CRUD").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('daemon_id:'+ obj.daemon_id); 
		console.log('daemon_nm:'+ obj.daemon_nm); 
		console.log('daemon_ip:'+ obj.daemon_ip); 
		console.log('daemon_port:'+ obj.daemon_port); 
		console.log('daemon_desc:'+ obj.daemon_desc); 
		console.log('daemon_stat_cd:'+ obj.daemon_stat_cd); 
		console.log('auto_restart_yn:'+ obj.auto_restart_yn); 
		console.log('use_yn:'+ obj.use_yn); 

		
		if(obj.daemon_nm == ''){
			alert("[알림] Daemon명을 입력하세요.");
			$("input#F_DAEMON_NM").focus();
		    return;
		}

		if(obj.daemon_ip == ''){
			alert("[알림] Daemon IP를 입력하세요.");
			$("input#F_DAEMON_IP").focus();
		    return;
		}

		if(obj.daemon_port == ''){
			alert("[알림] Daemon port를 입력하세요.");
			$("input#F_DAEMON_PORT").focus();
		    return;
		}

		$("#SetDaemonForm").ajaxForm({
			url : 'SetDaemon',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				refreshData();
			},
			error : function(data, status){
		    	if (data != null){
		    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 서버에서 전달
		    			alert("이미 등록되어 있는 아이디 입니다.");
		    		} else {
		    			alert("Error");
		    		}
		    	}
			}
		});	
		$("#SetDaemonForm").submit() ;
	});

	refreshData();
	
	$("#searchVal").focus();

});
