$(document).ready(function() {
	
	//getServer($("#C_SERVER_ID"),1);
	
	function refreshData()  
	{
		var Obj = new Object();
		
		Obj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		Obj.__server_id = $('#C_SERVER_ID').val();;
		Obj.__job_id  = '*';
		Obj.__job_nm  =  $('#C_JOB_NM').val();
		Obj.__rows      = "20";
		Obj.__page      = "1" ;
		
		$('#CRUD').val("C")
		
       var columns = [
	   		{name:'SERVER_ID'  	 , width: 100, hidden: true },
	   		{name:'JOB_ID'  	 , width: 100, hidden: true },		
	   		{name:'JOB_CD'  	 , width: 100},		
	   		{name:'JOB_NM'		 , width: 100},
	   		{name:'TABLE_ID'  	 , width: 100, hidden: true },		
	   		{name:'SOURCE_PATH'  , width: 100, hidden: true },		
	   		{name:'SOURCE_FILE'  , width: 100, hidden: true },		
	   		{name:'INFO_PATH'  , width: 100, hidden: true },	
	   		{name:'INFO_FILE'  , width: 100, hidden: true },		
	   		{name:'JOB_LOG_PATH'  , width: 100, hidden: true },		
	   		{name:'JOB_TM'  	 , width: 100, hidden: true },		
	   		{name:'SEPARATOR'  	 , width: 200, hidden: true },		
	   		{name:'SCHEDULE_YN'  , width: 200, hidden: true },		
	   		{name:'SOURCE_DEL_YN', width: 100, hidden: true },		
	   		{name:'LAST_COL_YN'  , width: 100, hidden: true },		
	   		{name:'USE_YN'     	 , width:  50, 
	   			edittype: 'select', 
                formatter: 'select',
                align:'center',
                editable:true,                
                editoptions:{value: getUseSelectOptions()}
	   		}
	   	];
		
		$("#jqGrid").jqGrid({
	        url:"GetJobList",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['서버','ID','작업ID', '작업명', '테이블','소스경로','소스파일','인포경로','인포파일','작업로그패스','예약시각','구분자', '예약여부', '소스삭제','최종컬럼','사용'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager",
            height: 500,
            rowNum: 20,
			viewrecords: true, // show the current page, data rang and total records on the toolbar
			autowidth : true,
            pageModel: { type: 'local', rPP: 20, rPPOptions: [1, 10, 20, 30, 40, 50, 100] },
            scrollModel: { lastColumn: null },
            colModel: columns,
            numberCell: { resizable: true, width: 40, title: "#", minWidth: 25 },
            resizable: true, 
            loadonce: true,
			ondblClickRow : function(rowId, iRow, iCol, e) {
			     var curPage =  $("#jqGrid").getGridParam("page");
			     var pageSize = $("#jqGrid").getGridParam("rowNum");
			     var curRowNum = parseInt((curPage-1)*pageSize) + parseInt(rowId); 
			     
			    console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
		        loadInfo(rowId, pageSize, curPage);
			}
		}).trigger("reloadGrid");
		jQuery("#jqGrid").jqGrid('navGrid','#jqGridPager',{edit:false,add:false,del:false});
		
		$('#F_JOB_CD').attr("readonly", false); //설정
	 }

	function loadInfo(rowId, currentRow, currentPage) {

		var selectdRow = $("#jqGrid").jqGrid('getRowData', rowId);

		console.log(selectdRow);

		$('#ROWID').val(rowId);
		
		jsonObj = {};

		jsonObj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		jsonObj.__server_id = $('#C_SERVER_ID').val();;
		jsonObj.__job_id    = selectdRow.JOB_ID;
		jsonObj.__job_nm    = selectdRow.JOB_NM;
		jsonObj.__rows      = currentRow+"";
		jsonObj.__page      = currentPage+"" ;
		
		$.ajax({
			url: 'GetJobList',    
			data: {param:JSON.stringify(jsonObj)},
			type:"post",
			dataType:"json",
			success: function(json_data) {
	
				console.log(json_data);
				
		        if(json_data.result == 'OK') {

			        $('#F_JOB_ID').val(json_data.rows[0].JOB_ID);
			        $('#F_JOB_CD').val(json_data.rows[0].JOB_CD);
			        $('#F_JOB_NM').val(json_data.rows[0].JOB_NM);
			        $('#F_TABLE_ID').val(json_data.rows[0].TABLE_ID);
			        $('#F_TABLE_CD').val(json_data.rows[0].TABLE_CD);
			        $('#F_TABLE_NM').val(json_data.rows[0].TABLE_NM);
			        $('#F_SOURCE_PATH').val(json_data.rows[0].SOURCE_PATH);
			        $('#F_SOURCE_FILE').val(json_data.rows[0].SOURCE_FILE);
			        $('#F_INFO_PATH').val(json_data.rows[0].INFO_PATH);       
			        $('#F_INFO_FILE').val(json_data.rows[0].INFO_FILE);
			        $('#F_JOB_LOG_PATH').val(json_data.rows[0].JOB_LOG_PATH);
			        
			        //getAllSelectOptions("F_RUN_CD","RUN_CD",json_data.rows[0].RUN_CD);
			        $('#F_SEPARATOR').val(json_data.rows[0].SEPARATOR);

			        console.log(json_data.rows[0].JOB_TM.substr(0, 2));
			        console.log(json_data.rows[0].JOB_TM.substr(2, 2));
			        
			        var min = parseInt(json_data.rows[0].JOB_TM.substr(0, 2));
			        var sec = parseInt(json_data.rows[0].JOB_TM.substr(2, 2));
			        
			        console.log(min);
			        
			        if (min < 12) {
				        $('#F_JOB_TM_HAF').val("0");
			        } else {
			        	$('#F_JOB_TM_HAF').val("1");
			        	min = min - 12;
			        }
			        
			        $('#F_JOB_TM_MIN').val(("0"+min).substr(("0"+min).length-2,2));
			        $('#F_JOB_TM_SEC').val(("0"+sec).substr(("0"+sec).length-2,2));
			        
		    		$('input[name="F_LAST_COL_YN"]').val([json_data.rows[0].LAST_COL_YN]);
		    		$('input[name="F_SCHEDULE_YN"]').val([json_data.rows[0].SCHEDULE_YN]);
		    		$('input[name="F_SOURCE_DEL_YN"]').val([json_data.rows[0].SOURCE_DEL_YN]);
		    		$('input[name="F_USE_YN"]').val([json_data.rows[0].USE_YN]);
			        $('#F_JOB_CD').attr("readonly", true ); //설정
			        
				} else {
					console.log(json_data.result); 
				}
			}
		});	
		$('#CRUD').val("U")
	};	
   
	$('#btnQuery').click(function (e) {
		$("#tableDivID").replaceWith(function () {
			  return "<div id='tableDivID'><table id='jqGrid'></table><div id='jqGridPager'></div></div>";
		});
		refreshData();		
	});
	
	$('#btnAdd').click(function (e) {
		
		$('#F_JOB_ID').val("");
		$('#F_JOB_CD').val("");
		$('#F_JOB_NM').val("");
		$('#F_TABLE_ID').val("");
		$('#F_TABLE_CD').val("");
		$('#F_TABLE_NM').val("");
		$('#F_SOURCE_PATH').val("");
		$('#F_SOURCE_FILE').val("");
		$('#F_INFO_PATH').val("");
		$('#F_INFO_FILE').val("");
		$('#F_JOB_LOG_PATH').val("");
		$('#F_JOB_TM_HAF').val("0");
		$('#F_JOB_TM_MIN').val("00");
		$('#F_JOB_TM_SEC').val("00");
		$('#F_SEPARATOR').val("");
		$('#F_SEPARATOR option:eq(0)').prop("selected", true);
		$('input[name="F_LAST_COL_YN"]').val(["N"]);
		$('input[name="F_SCHEDULE_YN"]').val(["N"]);
		$('input[name="F_SOURCE_DEL_YN"]').val(["N"]);
		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#CRUD').val("C");
		$('#F_JOB_CD'  ).attr("readonly", false); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.job_id  = $("input#F_JOB_ID").val();
		obj.crud    = "D";
		
		console.log('F_JOB_ID:'+ obj.job_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetJobForm").ajaxForm({
			url : 'SetJob',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				$('#F_JOB_ID').val("");
				$('#F_JOB_CD').val("");
				$('#F_JOB_NM').val("");
				$('#F_TABLE_ID').val("");
				$('#F_TABLE_CD').val("");
				$('#F_TABLE_NM').val("");
				$('#F_SOURCE_PATH').val("");
				$('#F_SOURCE_FILE').val("");
				$('#F_INFO_PATH').val("");
				$('#F_INFO_FILE').val("");
				$('#F_JOB_LOG_PATH').val("");
				$('#F_JOB_TM_HAF').val("0");
				$('#F_JOB_TM_MIN').val("00");
				$('#F_JOB_TM_SEC').val("00");
				$('#F_SEPARATOR').val("");
				$('input[name="F_LAST_COL_YN"]').val(["Y"]);
				$('input[name="F_SCHEDULE_YN"]').val(["Y"]);
				$('input[name="F_SOURCE_DEL_YN"]').val(["Y"]);
				$('input[name="F_USE_YN"]').val(["Y"]);
				$('#CRUD').val("C");
				$('#F_JOB_CD'  ).attr("readonly", true); //설정	
				$("#jqGrid").jqGrid('delRowData', $('#ROWID').val());
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
		$("#SetJobForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("#C_SERVER_ID").val();
		obj.job_id      = $("input#F_JOB_ID").val();
		obj.job_cd      = $("input#F_JOB_CD").val();
		obj.job_nm      = $("input#F_JOB_NM").val();
		obj.table_id    = $("input#F_TABLE_ID").val();
		obj.source_path = $("input#F_SOURCE_PATH").val();
		obj.source_file = $("input#F_SOURCE_FILE").val();
		obj.info_path = $("input#F_INFO_PATH").val();
		obj.info_file = $("input#F_INFO_FILE").val();
		obj.job_log_path = $("input#F_JOB_LOG_PATH").val();

		job_haf = $("select#F_JOB_TM_HAF").val();
		job_min = parseInt($("select#F_JOB_TM_MIN").val());
		job_sec = $("select#F_JOB_TM_SEC").val();
		
		if(job_haf == '1') {
			job_min = job_min + 12;
		}

		obj.job_tm      = job_min + "" + job_sec;
		obj.separator   = $("input#F_SEPARATOR").val();
		obj.last_col_yn = $('input[name="F_LAST_COL_YN"]:checked').val()
		obj.schedule_yn = $('input[name="F_SCHEDULE_YN"]:checked').val()
		obj.source_del_yn = $('input[name="F_SOURCE_DEL_YN"]:checked').val()
		obj.use_yn      = $('input[name="F_USE_YN"]:checked').val()
		obj.crud        = $("input#CRUD").val();
		
		console.log('저장 시작');
		console.log('sCrud:'+ obj.crud);
		console.log('server_id:'+ obj.server_id); 
		console.log('job_id:'+ obj.job_id); 
		console.log('job_cd:'+ obj.job_cd); 
		console.log('job_nm:'+ obj.job_nm); 
		console.log('table_id:'+ obj.table_id); 
		console.log('source_path:'+ obj.source_path); 
		console.log('source_file:'+ obj.source_file); 
		console.log('info_path:'+ obj.info_path); 
		console.log('info_file:'+ obj.info_file); 
		console.log('job_log_path:'+ obj.job_log_path);		
		console.log('job_tm:'+ obj.job_tm); 
		console.log('separator:'+ obj.separator); 
		console.log('last_col_yn:'+ obj.last_col_yn); 
		console.log('schedule_yn:'+ obj.schedule_yn); 
		console.log('source_del_yn:'+ obj.source_del_yn); 
		console.log('use_yn:'+ obj.use_yn); 

		
		if(obj.job_cd == ''){
			alert("[알림] 작업ID를 입력하세요.");
			$("input#F_JOB_CD").focus();
		    return;
		}

		if(obj.job_nm == ''){
			alert("[알림] 작업명을 입력하세요.");
			$("input#F_JOB_NM").focus();
		    return;
		}


		if(obj.table_id == ''){
			alert("[알림] 테이블을 선택하세요.");
			$("input#F_TABLE_ID").focus();
		    return;
		}
		
		if(obj.job_log_path == ''){
			alert("[알림] 작업로그경로를  선택하세요.");
			$("input#F_JOB_LOG_PATH").focus();
		    return;
		}
		
		$("#SetJobForm").ajaxForm({
			url : 'SetJob',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
 				if (obj.crud == "U" ) {				
					var rowData = $('#jqGrid').jqGrid('getRowData', $('#ROWID').val());
					rowData.SERVER_NM= obj.server_nm; 
					rowData.SERVER_IP= obj.server_ip; 
					rowData.JOB_ID= obj.job_id; 
					rowData.JOB_CD= obj.job_cd; 
					rowData.JOB_NM= obj.job_nm; 
					rowData.USE_YN = obj.use_yn; 
					$('#jqGrid').jqGrid('setRowData', $('#ROWID').val(), rowData)
				} else {
					var ids = $('#jqGrid').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid').jqGrid('addRowData',idsLen,{});	
					var rowData = $('#jqGrid').jqGrid('getRowData', idsLen);
					rowData.JOB_ID = json_data.genKey;
					rowData.JOB_CD = obj.job_cd; 
					rowData.JOB_NM = obj.job_nm; 
					rowData.USE_YN = obj.use_yn; 
					$('#jqGrid').jqGrid('setRowData',idsLen, rowData)						
				} 
				//$('#btnQuery').click();
				$('#btnAdd').click();
				alert("정상적으로 처리 되었습니다.");

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
		$("#SetJobForm").submit() ;
	});

	
	$('#showAjaxModal').click(function (e) {
		showTableSelector();
	});
	
	function showTableSelector() {
		
		jQuery('#modal-7').modal({backdrop: 'static', keyboard: false});
		
		console.log('..showAjaxModal...........................');

		
		var Obj = new Object();
		
		Obj.__gb       = 'A';
		Obj.__table_id = '*';
		Obj.__table_nm = '';
		Obj.__rows     = "20";
		Obj.__page     = "1" ;
		
	
		oTable = $('#uTable').DataTable({
 			sDom: 'ti',
 			select: true,
			processing: true,
			ordering: false,
			serverSide: false,
			searching: false,
			destroy: true,
			pagingType: "full_numbers",
			pageLength: 10,
			ajax: {
		        url:"GetTableListPop",
				dataType:"json", 
				type: "post",
				data : {param:JSON.stringify(Obj)}
			},
			language: {
				"decimal":        "",
			    "emptyTable":     "데이타가 없습니다.",
			    "info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
			    "infoEmpty":      "전체 0 건",
			    "infoFiltered":   "(filtered from _MAX_ total entries)",
			    "infoPostFix":    "",
			    "thousands":      ",",
			    "lengthMenu":     "Show _MENU_ entries",
			    "loadingRecords": "Loading...",
			    "processing":     "Processing...",
			    "search":         "Search:",
			    "zeroRecords":    "해당 데이터가 없습니다.",
			    "paginate": {
			        "first":      "처음",
			        "last":       "마지막",
			        "next":       "다음",
			        "previous":   "이전"
			    },
			    "aria": {
			        "sortAscending":  ": activate to sort column ascending",
			        "sortDescending": ": activate to sort column descending"
			    }
	        },		
            columns : [
                {"data":"TABLE_ID"},		 	 
                {"data":"TABLE_CD"},		 	 
                {"data":"TABLE_NM"}
     	    ],
     	    columnDefs: [
     	        { targets: [0], visible: false}
     	    ]	      	    
		});
		
		$('#uTable tbody').on('dblclick', 'tr', function () {
		    var data = oTable.row( this ).data();
		    console.log(data.TABLE_ID + "::" + data.TABLE_CD + "::" + data.TABLE_NM);
			$('#F_TABLE_ID').val(data.TABLE_ID);
			$('#F_TABLE_CD').val(data.TABLE_CD);
			$('#F_TABLE_NM').val(data.TABLE_NM);
		    jQuery('#modal-7').modal("hide");
		});
		
	};
	
	$('#F_JOB_CD').attr("readonly", false); //설정
	$('input[name="C_USE_YN"]').val(["Y"]);

	$('input[name="F_LAST_COL_YN"]').val(["N"]);
	$('input[name="F_SCHEDULE_YN"]').val(["N"]);
	$('input[name="F_SOURCE_DEL_YN"]').val(["N"]);
	$('input[name="F_USE_YN"]').val(["Y"]);
//refreshData();
	$('#btnQuery').click();	
	
	$("#searchVal").focus();

});
