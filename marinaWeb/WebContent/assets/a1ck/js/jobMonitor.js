$(document).ready(function() {
	
	getServer($("#C_SERVER_ID"),1);
	
	$('#C_FROM').val(toDayPoint);
	$('#C_TO'  ).val(toDayPoint);
	$('input[name="F_STAT"]').val(["A"]);

	function refreshData1()  
	{
	
		console.log(".....refreshData1");
		
		var Obj = new Object();
		
		var _sFDate   = dateNoPoint($('#C_FROM').val());
		var _sTDate   = dateNoPoint($('#C_TO').val());
		var _serverId = $('#C_SERVER_ID').val();
		var _jobNm    = $('#C_JOB_NM').val();

		console.log(_sFDate);
		console.log(_sTDate);
		
		Obj.__server_id    = _serverId;
		Obj.__job_id       = '*';
		Obj.__job_nm  	   = _jobNm;
		Obj.__job_tm_from  = _sFDate;
		Obj.__job_tm_to    = _sTDate;
		Obj.__stat         = 'A';
		Obj.__rows         = "20";
		Obj.__page         = "1" ;
		
		$('#CRUD').val("U")
		
        var columns = [
	   		{name:'STEP_NM'	 , width: 100},
	   		{name:'TARGET'	 , width: 100, align:'right', formatter : function(cellValue,rowObject,options) { return toMoneyPoint(cellValue,0); }},
	   		{name:'FINISH'	 , width: 100, align:'right', formatter : function(cellValue,rowObject,options) { return toMoneyPoint(cellValue,0); }},
	   		{name:'ERROR'	 , width: 100, align:'right', formatter : function(cellValue,rowObject,options) { return toMoneyPoint(cellValue,0); }},
	   		{name:'RESTART'	 , width: 100, align:'right', formatter : function(cellValue,rowObject,options) { return toMoneyPoint(cellValue,0); }}
	   	];
		
		$("#jqGrid").jqGrid({
	        url:"GetJobMonitor",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['단계','대상건수', '처리건수', '오류건수', '재작업'],
			hoverrows : false,
			Regional:'ko',
		//	pager: "#jqGridPager",
            height: 80,
            rowNum: 4,
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
		//jQuery("#jqGrid").jqGrid('navGrid','#jqGridPager',{edit:false,add:false,del:false});
		
		$('#F_JOB_ID').attr("readonly", true); //설정
		$('#F_SERVER_ID').attr("readonly", true); //설정
	 }

	function refreshData2()  
	{
		
		console.log(".....refreshData2");
		
		var Obj = new Object();
		
		var _sFDate   = dateNoPoint($('#C_FROM').val());
		var _sTDate   = dateNoPoint($('#C_TO').val());
		var _serverId = $('#C_SERVER_ID').val();
		var _jobNm    = $('#C_JOB_NM').val();

		console.log(_sFDate);
		console.log(_sTDate);
		
		Obj.__server_id    = '*';
		Obj.__job_id       = '*';
		Obj.__job_nm  	   = "%";
		Obj.__job_tm_from  = _sFDate;
		Obj.__job_tm_to    = _sTDate;
		Obj.__stat         = 'C';
		Obj.__rows         = "20";
		Obj.__page         = "1" ;
		
		$('#CRUD').val("U")
		
        var columns = [
	   		{name:'SERVER_NM'	 , width: 100},
	   		{name:'JOB_TM'	 , width: 100, align:'right'},
	   		{name:'SOURCE_FILE'	 , width: 100, align:'right'},
	   		{name:'SCAN_END_TM'	 , width: 100, align:'right'},
	   		{name:'FILTER_END_TM'	 , width: 100, align:'right'},
	   		{name:'LOAD_END_TM'	 , width: 100, align:'right'},
	   		{name:'MSG'	 , width: 100, align:'right'}
	   	];

	
		$("#jqGrid2").jqGrid({
	        url:"GetJobMonitor",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['서버','시작시각', '파일명', '스캔완료', '핑터완료', '로딩완료', '메세지'],
			hoverrows : false,
			Regional:'ko',
		 	pager: "#jqGridPager2",
            height: 80,
            rowNum: 4,
			viewrecords: true, // show the current page, data rang and total records on the toolbar
			autowidth : true,
            pageModel: { type: 'local', rPP: 20, rPPOptions: [1, 10, 20, 30, 40, 50, 100] },
            scrollModel: { lastColumn: null },
            colModel: columns,
            numberCell: { resizable: true, width: 40, title: "#", minWidth: 25 },
            resizable: true, 
            loadonce: true,
			ondblClickRow : function(rowId, iRow, iCol, e) {
			     var curPage =  $("#jqGrid2").getGridParam("page");
			     var pageSize = $("#jqGrid2").getGridParam("rowNum");
			     var curRowNum = parseInt((curPage-1)*pageSize) + parseInt(rowId); 
			     
			    console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
		        loadInfo(rowId, pageSize, curPage);
			}
		}).trigger("reloadGrid");
		jQuery("#jqGrid2").jqGrid('navGrid','#jqGridPager2',{edit:false,add:false,del:false});

	 }
	

	function refreshData3()  
	{
		
		console.log(".....refreshData3");
		
		var Obj = new Object();
		
		Obj.__server_id    = "";
		Obj.__job_id       = '*';
		Obj.__job_nm  	   = "";
		Obj.__job_tm_from  = "";
		Obj.__job_tm_to    = "";
		Obj.__stat         = 'B';
		Obj.__rows         = "20";
		Obj.__page         = "1" ;
		
		$.ajax({
			url: 'GetJobMonitor',    
			data: {param:JSON.stringify(Obj)},
			type:"post",
			dataType:"json",
			success: function(json_data) {
	
				console.log(json_data);
		        if(json_data.result == 'OK') {
			        $('#F_TOTAL_AMT').text(toMoneyPoint(json_data.rows[0].LICENSE));
			        $('#F_USED_AMT' ).text(toMoneyPoint(json_data.rows[0].SOURCE_SIZE));
			        $('#F_FREE_AMT' ).text(toMoneyPoint(json_data.rows[0].FREE_SIZE));
			        
					console.log(json_data.rows[0].RATE);
					
			        if(parseInt(json_data.rows[0].RATE) < 70) {
			        	$('#F_STATUS' ).text("양호");
			        } else if(parseInt(json_data.rows[0].RATE) < 80) {
			        	$('#F_STATUS' ).text("주의");
			        } else {	
			        	$('#F_STATUS' ).text("위험");
			        }
				} else {
					console.log(json_data.result); 
				}
			}
		});			
		
	 }

	
	function loadInfo(rowId, currentRow, currentPage) {

		var selectdRow = $("#jqGrid").jqGrid('getRowData', rowId);

		console.log('selectdRow:'+selectdRow);
		console.log('selectdRow.SERVER_ID:'+selectdRow.SERVER_ID);
		console.log('selectdRow.JOB_ID:'+selectdRow.JOB_ID);

		$('#ROWID').val(rowId);
		
		jsonObj = {};
		
		jsonObj.__server_id    = selectdRow.SERVER_ID;
		jsonObj.__job_id       = selectdRow.JOB_ID;
		jsonObj.__job_nm  	   = "";
		jsonObj.__job_tm_from  = "";
		jsonObj.__job_tm_to    = "";
		jsonObj.__stat         = "";
		jsonObj.__rows         = "20";
		jsonObj.__page         = "1" ;
		jsonObj.__rows      = currentRow+"";
		jsonObj.__page      = currentPage+"" ;		

		$.ajax({
			url: 'GetJobHistory',    
			data: {param:JSON.stringify(jsonObj)},
			type:"post",
			dataType:"json",
			success: function(json_data) {
	
				console.log(json_data);
				
		        if(json_data.result == 'OK') {

		        	console.log('json_data.rows[0].FILTER_STAT_CD:'+json_data.rows[0].FILTER_STAT_CD);
		        	console.log('json_data.rows[0].LOAD_STAT_CD:'+json_data.rows[0].LOAD_STAT_CD);
		        	
			        $('#F_JOB_ID').val(json_data.rows[0].JOB_ID);
			        $('#F_JOB_TM').val(json_data.rows[0].JOB_TM);
			        $('#F_SOURCE_FILE').val(json_data.rows[0].SOURCE_FILE);
			        $('#F_SOURCE_SIZE').val(toMoneyPoint(json_data.rows[0].SOURCE_SIZE,0));
			        $('#F_SCAN_REG_TM').val(toDatePoint(json_data.rows[0].SCAN_REG_TM));
			        $('#F_SCAN_END_TM').val(toDatePoint(json_data.rows[0].SCAN_END_TM));
			      //  $('#F_SCAN_STAT_CD').val(json_data.rows[0].SCAN_STAT_CD);
			      //  getAllSelectOptions("F_SCAN_STAT_CD","SCAN_STAT_CD",json_data.rows[0].SCAN_STAT_CD);
			        $('#F_SCAN_MSG_CD').val(json_data.rows[0].SCAN_MSG_CD);
			        $('#F_SCAN_MSG').val(json_data.rows[0].SCAN_MSG);
			        $('#F_FILTER_REG_TM').val(toDatePoint(json_data.rows[0].FILTER_REG_TM));
			        $('#F_FILTER_END_TM').val(toDatePoint(json_data.rows[0].FILTER_END_TM));
			      //  getAllSelectOptions("F_FILTER_STAT_CD","FILTER_STAT_CD",json_data.rows[0].FILTER_STAT_CD);
			        $('#F_FILTER_MSG_CD').val(json_data.rows[0].FILTER_MSG_CD);
			        $('#F_FILTER_MSG').val(json_data.rows[0].FILTER_MSG);
			        $('#F_LOAD_REG_TM').val(toDatePoint(json_data.rows[0].LOAD_REG_TM));
			        $('#F_LOAD_END_TM').val(toDatePoint(json_data.rows[0].LOAD_END_TM));
			        $('#F_LOAD_STAT_CD').val(json_data.rows[0].LOAD_STAT_CD);
			      //  getAllSelectOptions("F_LOAD_STAT_CD","LOAD_STAT_CD",json_data.rows[0].LOAD_STAT_CD);
			        $('#F_LOAD_MSG_CD').val(json_data.rows[0].LOAD_MSG_CD);
			        $('#F_LOAD_MSG').val(json_data.rows[0].LOAD_MSG);
			        $('#F_SCAN_STAT_NM').val(json_data.rows[0].SCAN_STAT_NM);
			        $('#F_FILTER_STAT_NM').val(json_data.rows[0].FILTER_STAT_NM);
			        $('#F_LOAD_STAT_NM').val(json_data.rows[0].LOAD_STAT_NM);
			        
			        
/*			        var min = parseInt(json_data.rows[0].JOB_TM.substr(0, 2));
			        var sec = parseInt(json_data.rows[0].JOB_TM.substr(2, 2));
			        
			        if (min < 12) {
				        $('#F_JOB_TM_HAF').val("0");
				        $('#F_JOB_TM_MIN').val(min+"");
				        $('#F_JOB_TM_SEC').val(sec+"");
			        } else {
			        	$('#F_JOB_TM_HAF').val("1");
			        	min = min - 12;
				        $('#F_JOB_TM_MIN').val(("0"+min).substr(0,2));
				        $('#F_JOB_TM_SEC').val(sec+"");
			        }
			        */
		    		$('input[name="F_LAST_COL_YN"]').val([json_data.rows[0].LAST_COL_YN]);
		    		$('input[name="F_SCHEDULE_YN"]').val([json_data.rows[0].SCHEDULE_YN]);
		    		$('input[name="F_SOURCE_DEL_YN"]').val([json_data.rows[0].SOURCE_DEL_YN]);
		    		$('input[name="F_USE_YN"]').val([json_data.rows[0].USE_YN]);
			        $('#F_JOB_ID').attr("readonly", true ); //설정
			        
				} else {
					console.log(json_data.result); 
				}
			}
		});	
	};	
   
	$('#btnQuery').click(function (e) {
		$("#tableDivID").replaceWith(function () {
			  return "<div id='tableDivID'><table id='jqGrid'></table><div id='jqGridPager'></div></div>";
		});
		refreshData1();		
	});
	
	$('#btnAdd').click(function (e) {

		$('#F_SERVER_ID' ).val($('#C_SERVER_ID'  ).val());
		$('#F_SERVER_NM' ).val($('#C_SERVER_ID  option:selected').text());
		$('#F_JOB_ID').val("");
		$('#F_JOB_NM').val("");
		$('#F_TABLE_ID').val("1");
		$('#F_TABLE_CD').val("1");
		$('#F_TABLE_NM').val("1");
		$('#F_SOURCE_PATH').val("");
		$('#F_SOURCE_FILE').val("");
		$('#F_JOB_TM_HAF').val("0");
		$('#F_JOB_TM_MIN').val("00");
		$('#F_JOB_TM_SEC').val("00");
		$('#F_SEPARATOR').val("");
		$('input[name="F_LAST_COL_YN"]').val(["Y"]);
		$('input[name="F_SCHEDULE_YN"]').val(["Y"]);
		$('input[name="F_SOURCE_DEL_YN"]').val(["Y"]);
		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#CRUD').val("C");
		$('#F_SERVER_ID'  ).attr("readonly", true); //설정
		$('#F_JOB_ID'  ).attr("readonly", true); //설정
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
				$('#F_SERVER_ID').val($('#C_SERVER_ID'  ).val());
				$('#F_SERVER_NM').val("");
				$('#F_JOB_ID').val("");
				$('#F_JOB_NM').val("");
				$('#F_TABLE_ID').val("");
				$('#F_TABLE_CD').val("");
				$('#F_TABLE_NM').val("");
				$('#F_SOURCE_PATH').val("");
				$('#F_SOURCE_FILE').val("");
				$('#F_JOB_TM_HAF').val("0");
				$('#F_JOB_TM_MIN').val("00");
				$('#F_JOB_TM_SEC').val("00");
				$('#F_SEPARATOR').val("");
				$('input[name="F_LAST_COL_YN"]').val(["Y"]);
				$('input[name="F_SCHEDULE_YN"]').val(["Y"]);
				$('input[name="F_SOURCE_DEL_YN"]').val(["Y"]);
				$('input[name="F_USE_YN"]').val(["Y"]);
				$('#CRUD').val("C");
				$('#F_SERVER_ID'  ).attr("readonly", true); //설정	
				$('#F_JOB_ID'  ).attr("readonly", true); //설정	
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
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.job_id      = $("input#F_JOB_ID").val();
		obj.job_nm      = $("input#F_JOB_NM").val();
		obj.table_id    = $("input#F_TABLE_ID").val();
		obj.source_path = $("input#F_SOURCE_PATH").val();
		obj.source_file = $("input#F_SOURCE_FILE").val();

		job_haf = $("select#F_JOB_TM_HAF").val();
		job_min = parseInt($("select#F_JOB_TM_MIN").val());
		job_sec = $("select#F_JOB_TM_SEC").val();
		
		if(job_haf == '1') {
			job_min = job_min + 12;
		}

		obj.job_tm      = job_min + "" + job_sec;
		obj.separator   = $("select#F_SEPARATOR").val();
		obj.last_col_yn = $('input[name="F_LAST_COL_YN"]:checked').val()
		obj.schedule_yn = $('input[name="F_SCHEDULE_YN"]:checked').val()
		obj.source_del_yn = $('input[name="F_SOURCE_DEL_YN"]:checked').val()
		obj.use_yn      = $('input[name="F_USE_YN"]:checked').val()
		obj.crud        = $("input#CRUD").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('server_id:'+ obj.server_id); 
		console.log('job_id:'+ obj.job_id); 
		console.log('job_nm:'+ obj.job_nm); 
		console.log('table_id:'+ obj.table_id); 
		console.log('source_path:'+ obj.source_path); 
		console.log('source_file:'+ obj.source_file); 
		console.log('job_tm:'+ obj.job_tm); 
		console.log('separator:'+ obj.separator); 
		console.log('last_col_yn:'+ obj.last_col_yn); 
		console.log('schedule_yn:'+ obj.schedule_yn); 
		console.log('source_del_yn:'+ obj.source_del_yn); 
		console.log('use_yn:'+ obj.use_yn); 

		
		if(obj.job_nm == ''){
			alert("[알림] Job명을 입력하세요.");
			$("input#F_JOB_NM").focus();
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
					rowData.JOB_NM= obj.job_nm; 
					$('#jqGrid').jqGrid('setRowData', $('#ROWID').val(), rowData)
				} else {
					var ids = $('#jqGrid').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid').jqGrid('addRowData',idsLen,{});	
					var ids2 = $('#jqGrid').getDataIDs();
					var rowData = $('#jqGrid').jqGrid('getRowData', idsLen);
					rowData.SERVER_NM= obj.server_nm; 
					rowData.SERVER_IP= obj.server_ip; 
					rowData.JOB_ID= obj.job_id; 
					rowData.JOB_NM= obj.job_nm; 
					$('#jqGrid').jqGrid('setRowData',idsLen, rowData)						
				}
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
	
	refreshData1();
	refreshData2();
	refreshData3();
	
	$("#searchVal").focus();

});
