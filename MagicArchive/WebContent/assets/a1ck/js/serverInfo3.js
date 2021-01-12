$(document).ready(function() {
	
	getServerAll();

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
	
	function getServerAll(){
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
		
		obj.server_id = '*';
		
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
		        url:"GetServerList",
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
                {"data":"USE_YN"},		 
                {"data":"SERVER_CLASS_CD"},		 
                {"data":"SERVER_IP"},		 
                {"data":"SERVER_DESC"},		 
                {"data":"DETAIL_NM"}
     	    ]
	        ,columnDefs: [
     	        { targets: [,2,3,4,5,6], visible: false}
     	    ]		     		  
		});		
		$('#F_SERVER_ID'    ).attr("readonly", true); //설정
	 }

	function loadInfo(server_id) {
		
		var obj = new Object();
		obj.server_id  = server_id;
		
		$.ajax({
			url: 'GetServerList',    
			data: {param:JSON.stringify(obj)},
			dataType:"json",
			success: function(json_data) {
	
		        if(json_data.result == 'OK') {

		    		console.log(json_data.data[0].USE_YN);

			        $('#F_SERVER_ID').val(json_data.data[0].SERVER_ID);
			        $('#F_SERVER_NM').val(json_data.data[0].SERVER_NM);
			        $('#F_SERVER_IP').val(json_data.data[0].SERVER_IP);
			        $('#F_DESCRIPTION' ).val(json_data.data[0].SERVER_DESC);
			        getJson("F_SERVER_CLASS_CD","SERVER_CLASS_CD",json_data.data[0].SERVER_CLASS_CD);
		    		$('input[name="F_USE_YN"]').val([json_data.data[0].USE_YN]);
			        $('#F_SERVER_ID'    ).attr("readonly", true ); //설정
			        
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
        
        loadInfo(sData.SERVER_ID);

    } );
    
	$('#btnQuery').click(function (e) {
		refreshData();
		
	});
	
	$('#btnCancel').click(function (e) {
		$('#searchVal').val("");
		$("#searchVal").focus();
	});

	
	$('#btnAdd').click(function (e) {
		$('#F_SERVER_ID'  ).val("");
		$('#F_SERVER_NM'    ).val("");
		$('#F_SERVER_IP'    ).val("");
		$('#F_DESCRIPTION' ).val("");
		$('#F_SERVER_CLASS_CD').val("");
		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#F_SERVER_CLASS_CD').val("");
		$('#CRUD'         ).val("C");
		$('#F_SERVER_ID'  ).attr("readonly", true); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.crud        = "D";
		
		console.log('F_SERVER_ID:'+ obj.server_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetServerForm").ajaxForm({
			url : 'SetServer',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				refreshData();
				$('#F_SERVER_ID'  ).val("");
				$('#F_SERVER_NM'    ).val("");
				$('#F_SERVER_IP'    ).val("");
				$('#F_DESCRIPTION' ).val("");
				$('#F_SERVER_CLASS_CD').val("");
				$('input[name="F_USE_YN"]').val(["Y"]);
				$('#CRUD'         ).val("C");
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
		$("#SetServerForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.server_nm   = $("input#F_SERVER_NM").val();
		obj.server_ip   = $("input#F_SERVER_IP").val();
		obj.server_desc = $("textarea#F_DESCRIPTION").val();
		obj.server_class_cd = $("select#F_SERVER_CLASS_CD").val();
		obj.use_yn = $('input[name="F_USE_YN"]:checked').val()
		obj.crud        = $("input#CRUD").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('server_id:'+ obj.server_id); 
		console.log('server_nm:'+ obj.server_nm);
		console.log('server_ip:'+ obj.server_ip);
		console.log('description:'+ obj.description);
		console.log('server_class_cd:'+ obj.server_class_cd);
		console.log('use_yn:'+ obj.use_yn);
		
		if(obj.server_nm == ''){
			alert("[알림] 서버명을 입력하세요.");
			$("input#F_SERVER_NM").focus();
		    return;
		}

		$("#SetServerForm").ajaxForm({
			url : 'SetServer',
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
		$("#SetServerForm").submit() ;
	});

	refreshData();
	
	$("#searchVal").focus();

});
