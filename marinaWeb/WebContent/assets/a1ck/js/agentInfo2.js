$(document).ready(function() {
	
	getServer(1);

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
		
	//	console.log(selectTag);
		
		$("#" + selectTagId).append(selectTag); 
	}
	
	function refreshData()  
	{
		var obj = new Object();
		
		obj.server_id = $('#C_SERVER_ID').val();;
		obj.agent_id = '*';
		
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
		        url:"GetAgentList",
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
                {"data":"AGENT_ID"},			 
                {"data":"AGENT_NM"},			 
                {"data":"AGENT_PORT"},		 
                {"data":"SERVER_ID"},		 
                {"data":"SERVER_NM"},			 
                {"data":"ACCOUNT_CD"},			 
                {"data":"PASSWORD", type: "password"},		 
                {"data":"PATH"},		 
                {"data":"DESCRIPTION"},		 
                {"data":"RUN_CD"},		 
                {"data":"DETAIL_NM"},		 
                {"data":"USE_YN"}
     	    ]
	        ,columnDefs: [
     	        { targets: [3,6,8,9,11], visible: false}
     	    ]		     		  
		});		
		$('#F_AGENT_ID').attr("readonly", true); //설정
	 }

	function loadInfo(server_id, agent_id) {
		
		var obj = new Object();
		obj.server_id  = server_id;
		obj.agent_id   = agent_id;
		
		$.ajax({
			url: 'GetAgentList',    
			data: {param:JSON.stringify(obj)},
			dataType:"json",
			success: function(json_data) {
	
				console.log(json_data);
				
		        if(json_data.result == 'OK') {

			        $('#F_AGENT_ID').val(json_data.data[0].AGENT_ID);
			        $('#F_AGENT_NM').val(json_data.data[0].AGENT_NM);
			        $('#F_AGENT_PORT').val(json_data.data[0].AGENT_PORT);
			        $('#F_SERVER_ID').val(json_data.data[0].SERVER_ID);
			        $('#F_SERVER_NM').val(json_data.data[0].SERVER_NM);
			        $('#F_ACCOUNT_CD').val(json_data.data[0].ACCOUNT_CD);
			        $('#F_PASSWORD').val(json_data.data[0].PASSWORD);
			        $('#F_PATH').val(json_data.data[0].PATH);
			        $('#F_DESCRIPTION').val(json_data.data[0].DESCRIPTION);
			        getJson("F_RUN_CD","RUN_CD",json_data.data[0].RUN_CD);
		    		$('input[name="F_USE_YN"]').val([json_data.data[0].USE_YN]);
			        $('#F_AGENT_ID').attr("readonly", true ); //설정
			        
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
        
        loadInfo(sData.SERVER_ID,sData.AGENT_ID);

    } );
    
	$('#btnQuery').click(function (e) {
		refreshData();
		
	});
	
	$('#btnCancel').click(function (e) {
		$('#searchVal').val("");
		$("#searchVal").focus();
	});

	
	$('#btnAdd').click(function (e) {

		$('#F_SERVER_ID').val($('#C_SERVER_ID'  ).val());
		$('#F_SERVER_NM').val("");
		$('#F_AGENT_ID').val("");
		$('#F_AGENT_NM').val("");
		$('#F_AGENT_PORT').val("");
		$('#F_ACCOUNT_CD').val("");
		$('#F_PASSWORD').val("");
		$('#F_PATH').val("");
		$('#F_DESCRIPTION').val("");
		$('#F_RUN_CD').val("");
		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#CRUD').val("C");
		$('#F_SERVER_ID'  ).attr("readonly", true); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.agent_id   = $("input#F_AGENT_ID").val();
		obj.crud        = "D";
		
		console.log('F_SERVER_ID:'+ obj.server_id);
		console.log('F_AGENT_ID:'+ obj.agent_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetAgentForm").ajaxForm({
			url : 'SetAgent',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				refreshData();
				$('#F_SERVER_ID').val($('#C_SERVER_ID'  ).val());
				$('#F_SERVER_NM').val("");
				$('#F_AGENT_ID').val("");
				$('#F_AGENT_NM').val("");
				$('#F_AGENT_PORT').val("");
				$('#F_ACCOUNT_CD').val("");
				$('#F_PASSWORD').val("");
				$('#F_PATH').val("");
				$('#F_DESCRIPTION').val("");
				$('#F_RUN_CD').val("");
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
		$("#SetAgentForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.agent_id    = $("input#F_AGENT_ID").val();
		obj.agent_nm    = $("input#F_AGENT_NM").val();
		obj.agent_port  = $("input#F_AGENT_PORT").val();
		obj.account_cd  = $("input#F_ACCOUNT_CD").val();
		obj.password    = $("input#F_PASSWORD").val();
		obj.path        = $("input#F_PATH").val();
		obj.description = $("textarea#F_DESCRIPTION").val();
		obj.run_cd      = $("select#F_RUN_CD").val();
		obj.use_yn      = $('input[name="F_USE_YN"]:checked').val()
		obj.crud        = $("input#CRUD").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('server_id:'+ obj.server_id); 
		console.log('agent_id:'+ obj.agent_id); 
		console.log('agent_nm:'+ obj.agent_nm); 
		console.log('agent_port:'+ obj.agent_port); 
		console.log('account_cd:'+ obj.account_cd); 
		console.log('password:'+ obj.password); 
		console.log('path:'+ obj.path); 
		console.log('description:'+ obj.description); 
		console.log('run_cd:'+ obj.run_cd); 
		console.log('use_yn:'+ obj.use_yn); 

		
		if(obj.agent_nm == ''){
			alert("[알림] Agent명을 입력하세요.");
			$("input#F_AGENT_NM").focus();
		    return;
		}

		$("#SetAgentForm").ajaxForm({
			url : 'SetAgent',
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
		$("#SetAgentForm").submit() ;
	});

	refreshData();
	
	$("#searchVal").focus();

});
