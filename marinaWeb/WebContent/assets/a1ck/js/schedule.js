$(document).ready(function() {
	
    var recCount= 0;
    
	function GetScheduleConnectTest() {
		var formData = $("#SetTableForm").serialize();
//		console.log(formData);
		$.ajax({
			type : "POST",
			url : "GetScheduleConnectTest",
			cache : false,
			data : formData,
			dataType:"json",			
			success: function(json_data) {
				console.log(json_data);
				console.log(json_data.result);
				if(json_data.result == 'OK')  
					alert("정상적으로 연결 되었습니다.");
				else
					alert("정상적으로 연결되지 않았습니다.");
				$(document.body).css({'cursor' : 'default'});				
			},
			error : function(data, status){
		    	if (data != null){
		    		alert("정상적으로 연결되지 않았습니다.");
		    	}
		    	$(document.body).css({'cursor' : 'default'});		
			}
		});
	};	
	
	function refreshData()  
	{
		var Obj = new Object();
		
		Obj.__job_id = '*';
		Obj.__job_nm = '%';
//		Obj.__job_nm =  $('#C_TABLE_NM').val();
		Obj.__rows     = "20";
		Obj.__page     = "1" ;
		
		$('#CRUD1').val("U")
		
       var columns = [
	   		{name:'JOB_ID'		 , width:  150, align:'left', hidden: true},		
	   		{name:'JOB_CD'		 , width:  150, align:'left'  },		
	   		{name:'JOB_NM'		 , width:  150, align:'left'  },		
	   		{name:'JOB_SCHEDULE' , width:  150, align:'left'  },		
	   		{name:'JOB_SCHEDULE_ORG' , width:  150, align:'left', hidden: true  },		
	   		{name:'SAVE_PREQ_CD' , width:  150, align:'left', hidden: true}, 			
	   		{name:'SAVE_PREQ_NM' , width:  100, align:'center'},		
	   		{name:'SAVE_PREQ'	 , width:   50, align:'left', hidden: true},		
	   		{name:'JOB_TYPE_CD'	 , width:  150, align:'left', hidden: true},		
	   		{name:'JOB_TYPE_NM'	 , width:  100, align:'left'  },		
	   		{name:'JOB_METHOD_CD', width:  150, align:'left', hidden: true},		
	   		{name:'JOB_METHOD_NM', width:  100, align:'left'  },		
	   		{name:'JOB_CLASS'	 , width:  150, align:'left', hidden: true},		
	   		{name:'USE_YN'	     , width:   80, align:'center'},		 
	   		{name:'SELECT_YN'	 , width:   80, align:'center'},		 
	   		{name:'DESCRIPTION'	 , width:  300, align:'left'  },	
	   		{name:'DEST_SERVER'	 , width:  150, align:'left', hidden: true},		
	   		{name:'SRC_IP'		 , width:  150, align:'left', hidden: true},		
	   		{name:'SRC_PORT'	 , width:  150, align:'left', hidden: true},		
	   		{name:'SRC_DBMS_CD'	 , width:  150, align:'left', hidden: true},		
	   		{name:'SRC_DB'		 , width:  150, align:'left', hidden: true},		
	   		{name:'SRC_USER'	 , width:  150, align:'left', hidden: true},		
	   		{name:'SRC_PASSWD'	 , width:  150, align:'left', hidden: true},		
	   		{name:'SRC_SQL'		 , width:  150, align:'left', hidden: true},		
	   		{name:'DEST_IP'		 , width:  150, align:'left', hidden: true},		
	   		{name:'DEST_PORT'	 , width:  150, align:'left', hidden: true},		
	   		{name:'DEST_DBMS_CD' , width:  150, align:'left', hidden: true},		
	   		{name:'DEST_DB'		 , width:  150, align:'left', hidden: true},		
	   		{name:'DEST_USER'	 , width:  150, align:'left', hidden: true},		
	   		{name:'DEST_PASSWD'	 , width:  150, align:'left', hidden: true},		
	   		{name:'DEST_TABLE'	 , width:  150, align:'left', hidden: true},		
	   		{name:'JOB_PATH'	 , width:  150, align:'left', hidden: true}		
	   	];
		
		$("#jqGrid1").jqGrid({
	        url:"GetScheduleList",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
//		   		loadInfo1(1, 20 , 1);
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['ID','ID', '작업','일정','일정2','주기','주기','주기값','유형','유형','방법','방법', 'class', '사용', '작동', '설명','','','','','','','','','','','','','','','',''],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager1",
            height: 230,
            rowNum: 10,
			viewrecords: true, // show the current page, data rang and total records on the toolbar
			autowidth : true,
            pageModel: { type: 'local', rPP: 20, rPPOptions: [1, 10, 20, 30, 40, 50, 100] },
            scrollModel: { lastColumn: null },
            colModel: columns,
            numberCell: { resizable: true, width: 40, title: "#", minWidth: 25 },
            resizable: true, 
            loadonce: true,
			ondblClickRow : function(rowId, iRow, iCol, e) {
			     var curPage =  $("#jqGrid1").getGridParam("page");
			     var pageSize = $("#jqGrid1").getGridParam("rowNum");
			     var curRowNum = parseInt((curPage-1)*pageSize) + parseInt(rowId); 
			     
				console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
		        loadInfo1(rowId, pageSize, curPage);
			}
		}).trigger("reloadGrid");
		jQuery("#jqGrid1").jqGrid('navGrid','#jqGridPager1',{edit:false,add:false,del:false});

		$('#F_TABLE_ID').attr("readonly", true); //설정
	 }
    
    
    $('#btnQuery').click(function (e) {
		$("#tableDivID1").replaceWith(function () {
			  return "<div id='tableDivID1'><table id='jqGrid1'></table><div id='jqGridPager1'></div></div>";
		});
		refreshData();	
	});
	
	$('#btnCancel').click(function (e) {
		$('#searchVal').val("");
		$("#searchVal").focus();
	});
	

	$('#btnAdd').click(function (e) {
		$('#btnAdd').prop('disabled', true);

		$('#F_SRC_DBMS_CD'		 ).val("");
		$('#F_SRC_DBMS_CD option:eq(0)').prop("selected", true);
		$('#F_JOB_ID'		 ).val("");
		$('#F_JOB_CD'		 ).val("");
		$('#F_JOB_NM'		 ).val("");
		$('#F_JOB_SCHEDULE'  ).val("");
		$('#F_SAVE_PREQ_NM'  ).val("");
		$('#F_SAVE_PREQ'	 ).val("");
		$('#F_JOB_TYPE_NM'	 ).val("");
		$('#F_JOB_METHOD_NM' ).val("");
		$('#F_JOB_CLASS'	 ).val("");
		$('input[name="F_USE_YN"]')[0].checked = true;
		$('input[name="F_SELECT_YN"]')[0].checked = true;
		$('#F_DESCRIPTION'	 ).val("");
		$('#F_DEST_SERVER'	 ).val("");
		$('#F_SRC_IP'		 ).val("");
		$('#F_SRC_PORT'	     ).val("");
		$('#F_SRC_DB'		 ).val("");
		$('#F_SRC_USER'	     ).val("");
		$('#F_SRC_PASSWD'	 ).val("");
		$('#F_SRC_SQL'		 ).val("");
		$('#F_DEST_IP'		 ).val("");
		$('#F_DEST_PORT'	 ).val("");
		$('#F_DEST_DB'		 ).val("");
		$('#F_DEST_USER'	 ).val("");
		$('#F_DEST_PASSWD'	 ).val("");
		$('#F_DEST_TABLE'	 ).val("");
		$('#F_JOB_PATH'	     ).val("");

		$('#F_SAVE_PREQ_CD'	 ).val("");
		$('#F_SAVE_PREQ_CD option:eq(0)').prop("selected", true);
		$('#F_JOB_TYPE_CD'	 ).val("");
		$('#F_JOB_TYPE_CD option:eq(0)').prop("selected", true);
		$('#F_JOB_METHOD_CD'	 ).val("");
		$('#F_JOB_METHOD_CD option:eq(0)').prop("selected", true);
		$('#F_DEST_DBMS_CD'	 ).val("");
		$('#F_DEST_DBMS_CD option:eq(0)').prop("selected", true);
		$('#CRUD1'         ).val("C");
		$('#F_JOB_ID'   ).attr("readonly", false); //설정
		$('#btnAdd').prop('disabled', false);
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var inputString = confirm('삭제후 복구 할수 없습니다.\n 삭제 하시겠습니까?');

		if(inputString == false){
			return;
		}
		
		var obj = new Object();
		obj.job_id   = $("input#F_JOB_ID").val();
		obj.crud        = "D";
		
		console.log('F_JOB_ID:'+ obj.job_id);
		console.log('sCrud:'+ obj.crud);

		if(obj.job_id == ''){
			alert("[알림] 작업을 선택하세요.");
			$("input#F_JOB_ID").focus();
		    return;
		}

		
		$("#SetTableForm").ajaxForm({
			url : 'SetScheduleList',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				$('#F_JOB_ID'		 ).val("");
				$('#F_JOB_CD'		 ).val("");
				$('#F_JOB_NM'		 ).val("");
				$('#F_JOB_SCHEDULE'  ).val("");
				$('#F_SAVE_PREQ_NM'  ).val("");
				$('#F_SAVE_PREQ'	 ).val("");
				$('#F_JOB_TYPE_NM'	 ).val("");
				$('#F_JOB_METHOD_NM' ).val("");
				$('#F_JOB_CLASS'	 ).val("");
				$('#F_DESCRIPTION'	 ).val("");
				$('#F_DEST_SERVER'	 ).val("");
				$('#F_SRC_IP'		 ).val("");
				$('#F_SRC_PORT'	     ).val("");
				$('#F_SRC_DB'		 ).val("");
				$('#F_SRC_USER'	     ).val("");
				$('#F_SRC_PASSWD'	 ).val("");
				$('#F_SRC_SQL'		 ).val("");
				$('#F_DEST_IP'		 ).val("");
				$('#F_DEST_PORT'	 ).val("");
				$('#F_DEST_DB'		 ).val("");
				$('#F_DEST_USER'	 ).val("");
				$('#F_DEST_PASSWD'	 ).val("");
				$('#F_DEST_TABLE'	 ).val("");
				$('#F_JOB_PATH'	     ).val("");
				$('input[name="F_USE_YN"]')[0].checked = true;
				$('input[name="F_SELECT_YN"]')[0].checked = true;
				$('#F_SAVE_PREQ_CD'	 ).val("");
				$('#F_JOB_TYPE_CD'	 ).val("");
				$('#F_JOB_METHOD_CD'	 ).val("");
				$('#F_SRC_DBMS_CD'	 ).val("");				
				$('#F_DEST_DBMS_CD'	 ).val("");				
				
				$('#CRUD'         ).val("C");
				$('#F_TABLE_ID'   ).attr("readonly", false); //설정	
				$("#jqGrid1").jqGrid('delRowData', $('#ROWID1').val());
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
		$("#SetTableForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.job_id     	  = $("input#F_JOB_ID").val();
		obj.job_cd     	  = $("input#F_JOB_CD").val();
		obj.job_nm     	  = $("input#F_JOB_NM").val();
		obj.job_schedule  = $("input#F_JOB_SCHEDULE").val();
		obj.job_schedule_org  = $("input#F_JOB_SCHEDULE_ORG").val();
		obj.save_preq     = $("input#F_SAVE_PREQ").val();
		
		if(obj.save_preq == null || obj.save_preq == '' )
			obj.save_preq = '0';
		obj.job_class     = $("input#F_JOB_CLASS").val();
		obj.description   = $("textarea#F_DESCRIPTION").val();
		obj.src_ip        = $("input#F_SRC_IP").val();
		obj.src_port      = $("input#F_SRC_PORT").val();
		obj.src_db        = $("input#F_SRC_DB").val();
		obj.src_user      = $("input#F_SRC_USER").val();
		obj.src_passwd    = $("input#F_SRC_PASSWD").val();
		obj.src_sql       = $("textarea#F_SRC_SQL").val();
		obj.dest_ip       = $("input#F_DEST_IP").val();
		obj.dest_port     = $("input#F_DEST_PORT").val();
		obj.dest_db       = $("input#F_DEST_DB").val();
		obj.dest_user     = $("input#F_DEST_USER").val();
		obj.dest_passwd   = $("input#F_DEST_PASSWD").val();
		obj.dest_table    = $("input#F_DEST_TABLE").val();
		obj.job_path      = $("input#F_JOB_PATH").val();
		obj.save_preq_cd  = $('select#F_SAVE_PREQ_CD option:selected').val();		
		obj.job_type_cd   = $('select#F_JOB_TYPE_CD option:selected').val();		
		obj.job_method_cd = $('select#F_JOB_METHOD_CD option:selected').val();		
		obj.src_dbms_cd   = $('select#F_SRC_DBMS_CD option:selected').val();		
		obj.dest_dbms_cd  = $('select#F_DEST_DBMS_CD option:selected').val();		

		obj.save_preq_nm  = $('#F_SAVE_PREQ_CD option:selected').text();		
		obj.job_type_nm   = $('#F_JOB_TYPE_CD option:selected').text();		
		obj.job_method_nm = $('#F_JOB_METHOD_CD option:selected').text();		
		obj.src_dbms_nm   = $('#F_SRC_DBMS_CD option:selected').text();		
		obj.dest_dbms_nm  = $('#F_DEST_DBMS_CD option:selected').text();		

		obj.use_yn        = $('input[name="F_USE_YN"]:checked').val()
		obj.select_yn     = $('input[name="F_SELECT_YN"]:checked').val()
		obj.crud          = $("input#CRUD1").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('job_id        :'+ obj.job_id     	 );
		console.log('job_cd        :'+ obj.job_cd     	 );
		console.log('job_nm        :'+ obj.job_nm     	 );
		console.log('job_schedule  :'+ obj.job_schedule  );
		console.log('save_preq     :'+ obj.save_preq     );
		console.log('job_class     :'+ obj.job_class     );
		console.log('description   :'+ obj.description   );
//		console.log('dest_server   :'+ obj.dest_server   );
		console.log('src_ip        :'+ obj.src_ip        );
		console.log('src_port      :'+ obj.src_port      );
		console.log('src_db        :'+ obj.src_db        );
		console.log('src_user      :'+ obj.src_user      );
		console.log('src_passwd    :'+ obj.src_passwd    );
		console.log('src_sql       :'+ obj.src_sql       );
		console.log('dest_ip       :'+ obj.dest_ip       );
		console.log('dest_port     :'+ obj.dest_port     );
		console.log('dest_db       :'+ obj.dest_db       );
		console.log('dest_user     :'+ obj.dest_user     );
		console.log('dest_passwd   :'+ obj.dest_passwd   );
		console.log('dest_table    :'+ obj.dest_table    );
		console.log('job_path      :'+ obj.job_path      );
		console.log('save_preq_cd  :'+ obj.save_preq_cd  );
		console.log('job_type_cd   :'+ obj.job_type_cd   );
		console.log('job_method_cd :'+ obj.job_method_cd );
		console.log('src_dbms_cd   :'+ obj.src_dbms_cd   );
		console.log('dest_dbms_cd  :'+ obj.dest_dbms_cd  );

		console.log('save_preq_nm  :'+ obj.save_preq_nm  );
		console.log('job_type_nm   :'+ obj.job_type_nm   );
		console.log('job_method_nm :'+ obj.job_method_nm );
		console.log('src_dbms_nm   :'+ obj.src_dbms_nm   );
		console.log('dest_dbms_nm  :'+ obj.dest_dbms_nm  );
		
		console.log('use_yn        :'+ obj.use_yn        );
		console.log('select_yn     :'+ obj.select_yn     );
		
		if(obj.table_cd == ''){
			alert("[알림] 테이블 영문명을 입력하세요.");
			$("input#F_JOB_CD").focus();
		    return;
		}

		if(obj.table_nm == ''){
			alert("[알림] 테이블 한글명을 입력하세요.");
			$("input#F_JOB_NM").focus();
		    return;
		}

		$("#SetTableForm").ajaxForm({
			url : 'SetScheduleList',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				
				console.log(json_data);
				
 				if (obj.crud == "U" ) {		
					console.log('grid update.........');
					var rowData = $('#jqGrid1').jqGrid('getRowData', $('#ROWID1').val());
					rowData.JOB_NM        = obj.job_nm; 
					rowData.JOB_SCHEDULE  = obj.job_schedule; 
					rowData.SRC_IP        = obj.src_ip; 
					rowData.SRC_PORT      = obj.src_port; 
					rowData.SRC_DBMS_CD   = obj.src_dbms_cd; 
					rowData.SRC_DB        = obj.src_db; 
					rowData.SRC_USER      = obj.src_user; 
					rowData.SRC_PASSWD    = obj.src_passwd; 
					rowData.SRC_SQL       = obj.src_sql; 
					rowData.DEST_IP       = obj.dest_ip; 
					rowData.DEST_PORT     = obj.dest_port; 
					rowData.DEST_DBMS_CD  = obj.dest_dbms_cd; 
					rowData.DEST_DB       = obj.dest_db; 
					rowData.DEST_USER     = obj.dest_user; 
					rowData.DEST_PASSWD   = obj.dest_passwd; 
					rowData.JOB_METHOD_CD = obj.job_method_cd; 
					rowData.DEST_TABLE    = obj.dest_table; 
					rowData.JOB_CLASS     = obj.job_class; 
					rowData.JOB_TYPE_CD   = obj.job_type_cd; 
					rowData.JOB_PATH      = obj.job_path; 
					rowData.SAVE_PREQ_CD  = obj.save_preq_cd; 
					rowData.SAVE_PREQ     = obj.save_preq; 
					rowData.USE_YN        = obj.use_yn; 
					rowData.SELECT_YN     = obj.select_yn; 
					rowData.DESCRIPTION   = obj.description; 
					rowData.JOB_CD        = obj.job_cd; 

					rowData.SRC_DBMS_NM   = obj.src_dbms_nm; 
					rowData.DEST_DBMS_NM  = obj.dest_dbms_nm; 
					rowData.JOB_METHOD_NM = obj.job_method_nm; 
					rowData.JOB_TYPE_NM   = obj.job_type_nm; 
					rowData.SAVE_PREQ_NM  = obj.save_preq_nm + "(" + obj.save_preq + ")";
					
					$('#jqGrid1').jqGrid('setRowData', $('#ROWID1').val(), rowData)
					if(obj.job_schedule != obj.job_schedule_org)
						alert("tomcat 서버를 재구동 해주세요.");
					else
						alert("정상적으로 처리 되었습니다.");
				} else {
					console.log('grid append.........');
					var ids = $('#jqGrid1').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid1').jqGrid('addRowData',idsLen,{});	
					var rowData = $('#jqGrid1').jqGrid('getRowData', idsLen);
					rowData.JOB_ID        = json_data.genKey;
					rowData.JOB_NM        = obj.job_nm; 
					rowData.JOB_SCHEDULE  = obj.job_schedule; 
					rowData.SRC_IP        = obj.src_ip; 
					rowData.SRC_PORT      = obj.src_port; 
					rowData.SRC_DBMS_CD   = obj.src_dbms_cd; 
					rowData.SRC_DB        = obj.src_db; 
					rowData.SRC_USER      = obj.src_user; 
					rowData.SRC_PASSWD    = obj.src_passwd; 
					rowData.SRC_SQL       = obj.src_sql; 
					rowData.DEST_IP       = obj.dest_ip; 
					rowData.DEST_PORT     = obj.dest_port; 
					rowData.DEST_DBMS_CD  = obj.dest_dbms_cd; 
					rowData.DEST_DB       = obj.dest_db; 
					rowData.DEST_USER     = obj.dest_user; 
					rowData.DEST_PASSWD   = obj.dest_passwd; 
					rowData.JOB_METHOD_CD = obj.job_method_cd; 
					rowData.DEST_TABLE    = obj.dest_table; 
					rowData.JOB_CLASS     = obj.job_class; 
					rowData.JOB_TYPE_CD   = obj.job_type_cd; 
					rowData.JOB_PATH      = obj.job_path; 
					rowData.SAVE_PREQ_CD  = obj.save_preq_cd; 
					rowData.SAVE_PREQ     = obj.save_preq; 
					rowData.USE_YN        = obj.use_yn; 
					rowData.SELECT_YN     = obj.select_yn; 
					rowData.DESCRIPTION   = obj.description; 
					rowData.JOB_CD        = obj.job_cd; 

					rowData.SRC_DBMS_NM   = obj.src_dbms_nm; 
					rowData.DEST_DBMS_NM  = obj.dest_dbms_nm; 
					rowData.JOB_METHOD_NM = obj.job_method_nm; 
					rowData.JOB_TYPE_NM   = obj.job_type_nm; 
					rowData.SAVE_PREQ_NM  = obj.save_preq_nm;
					$('#jqGrid1').jqGrid('setRowData',idsLen, rowData)						
					alert("tomcat 서버를 재구동 해주세요.");
				} 
				//$('#btnQuery').click();
				$('#btnAdd').click();				
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
		$("#SetTableForm").submit() ;
	});
	
	function loadInfo1(rowId, currentRow, currentPage) { 
		
		var selectdRow = $("#jqGrid1").jqGrid('getRowData', rowId);
	
		$('#ROWID1').val(rowId);
		
        $('#F_JOB_ID'   	).val(selectdRow.JOB_ID);
        $('#F_JOB_CD'   	).val(selectdRow.JOB_CD);
        $('#F_JOB_NM'   	).val(selectdRow.JOB_NM);
        $('#F_JOB_SCHEDULE' ).val(selectdRow.JOB_SCHEDULE);
        $('#F_JOB_SCHEDULE_ORG').val(selectdRow.JOB_SCHEDULE_ORG);
        $('#F_SAVE_PREQ'   	).val(selectdRow.SAVE_PREQ);
        $('#F_JOB_CLASS'   	).val(selectdRow.JOB_CLASS);
        $('#F_DESCRIPTION'  ).val(selectdRow.DESCRIPTION);
        $('#F_SRC_IP'   	).val(selectdRow.SRC_IP);
        $('#F_SRC_PORT'   	).val(selectdRow.SRC_PORT);
        $('#F_SRC_DB'   	).val(selectdRow.SRC_DB);
        $('#F_SRC_USER'   	).val(selectdRow.SRC_USER);
        $('#F_SRC_PASSWD'   ).val(selectdRow.SRC_PASSWD);
        $('#F_SRC_SQL'   	).val(selectdRow.SRC_SQL);
        $('#F_DEST_IP'   	).val(selectdRow.DEST_IP);
        $('#F_DEST_PORT'   	).val(selectdRow.DEST_PORT);
        $('#F_DEST_DB'   	).val(selectdRow.DEST_DB);
        $('#F_DEST_USER'   	).val(selectdRow.DEST_USER);
        $('#F_DEST_PASSWD'  ).val(selectdRow.DEST_PASSWD);
        $('#F_DEST_TABLE'   ).val(selectdRow.DEST_TABLE);
        $('#F_JOB_PATH'   	).val(selectdRow.JOB_PATH);
        $('#F_SRC_DBMS_NM'  ).val(selectdRow.SRC_DBMS_NM);
        $('#F_DEST_DBMS_NM' ).val(selectdRow.DEST_DBMS_NM);
        $('#F_JOB_METHOD_NM').val(selectdRow.JOB_METHOD_NM);
        $('#F_JOB_TYPE_NM'  ).val(selectdRow.JOB_TYPE_NM);
        $('#F_SAVE_PREQ_NM' ).val(selectdRow.SAVE_PREQ_NM);

        $('#F_SRC_DBMS_CD'  ).val(selectdRow.SRC_DBMS_CD);
        $('#F_DEST_DBMS_CD' ).val(selectdRow.DEST_DBMS_CD);
        $('#F_JOB_METHOD_CD').val(selectdRow.JOB_METHOD_CD);
        $('#F_JOB_TYPE_CD'  ).val(selectdRow.JOB_TYPE_CD);
        $('#F_SAVE_PREQ_CD' ).val(selectdRow.SAVE_PREQ_CD);
        
        console.log(selectdRow.USE_YN);
        console.log(selectdRow.SELECT_YN);
        
		$('input[name="F_USE_YN"]').val([selectdRow.USE_YN]);
//		$('input[name="F_USE_YN"]').filter("[value=" + selectdRow.USE_YN + "]").prop("checked", true);
		$('input[name="F_SELECT_YN"]').val([selectdRow.SELECT_YN]);
        
	    $('#F_JOB_CD' ).attr("readonly", true  );  
	    $('#F_ATTR_CD').attr("readonly", false );  
        $('#CRUD2'   ).val("AC");
        
		var Obj = new Object();
		
		Obj.__job_id = selectdRow.JOB_ID;
		Obj.__rows     = "20";
		Obj.__page     = "1" ;
		
		$('#CRUD2').val("U")
		
       var columns = [
	   		{name:'JOB_ID'		, width: 150, align:'center', hidden: true},	
	   		{name:'COL_ID'		, width: 150, align:'center', hidden: true},	
	   		{name:'COL_CD'		, width: 150, align:'center'},	
	   		{name:'COL_NM'		, width: 150, align:'center'},	
	   		{name:'COL_TYPE_CD'	, width: 150, align:'center', hidden: true},	
	   		{name:'COL_TYPE_NM'	, width: 150, align:'center'},	
	   		{name:'COL_LEN'		, width: 150, align:'center'},	
	   		{name:'COL_SEQ'		, width: 150, align:'center', hidden: true},	
	   		{name:'COL_DATE_YN'	, width: 150, align:'center'},	
	   		{name:'COL_ENC_YN'	, width: 150, align:'center'} 	
	   	];

		// 초기화
		$("#tableDivID2").replaceWith(function () {
			  return "<div id='tableDivID2'><table id='jqGrid2'></table><div id='jqGridPager2'></div></div>";
		});		
		
		$("#jqGrid2").jqGrid({
	        url:"GetScheduleColumn",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		if(data.records == undefined) {
		   			recCount = 0;
		   		} else {
		   			recCount = data.records;
		   		};
		   		
				console.log( "recCount:" + recCount );
		   	},
		   	colNames:['ID','ID', '코드','컬럼명','타입','타입','길이','순서', '기준날짜', '암호화'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager2",
            height: 230,
            rowNum: 10,
            rownumbers : true,            
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
			        loadInfo2(rowId, pageSize, curPage);
			}
		}).jqGrid('sortableRows', {
            update: function (ev, ui) {
                var item = ui.item[0], ri = item.rowIndex, itemId = item.id,
                    message = "The row with the id=" + itemId + " is moved. The new row index is " + ri;
                if (ri > 1 && ri < this.rows.length - 1) {
                    //alert(message + '\n11The row is inserted between item with rowid=' +
                    //    this.rows[ri-1].id + ' and the item with the rowid=' +
                    //    this.rows[ri+1].id);
                } else if (ri > 1) {
//                    alert(message +
//                        '\n22The row is inserted as the last item after the item with rowid=' +
//                        this.rows[ri-1].id);
                } else if (ri < this.rows.length - 1) {
//                    alert(message +
//                        '\n33The row is inserted as the first item before the item with rowid=' +
//                        this.rows[ri+1].id);
                } else {
                    alert(message);
                }
            }});
		;

		jQuery("#jqGrid2").jqGrid('navGrid','#jqGridPager2',{edit:false,add:false,del:false});
		
		$('#btnAttrAdd').click();
		
	};	
	
	function loadInfo2(rowId, currentRow, currentPage) { 
		
		var selectdRow = $("#jqGrid2").jqGrid('getRowData', rowId);

		$('#ROWID2').val(rowId);
		
        $('#F_JOB_ID'   ).val(selectdRow.JOB_ID);
        $('#F_COL_ID'   ).val(selectdRow.COL_ID);
        $('#F_COL_CD'   ).val(selectdRow.COL_CD);
        $('#F_COL_NM'   ).val(selectdRow.COL_NM);
//        getAllSelectOptions("F_COL_TYPE_CD","COL_TYPE_CD",selectdRow.COL_TYPE_CD);
        $('#F_COL_TYPE_CD'   ).val(selectdRow.COL_TYPE_CD);
        $('#F_COL_TYPE_NM' ).val(selectdRow.COL_TYPE_NM);
        $('#F_COL_LEN').val(selectdRow.COL_LEN);
        $('#F_COL_SEQ').val(selectdRow.COL_SEQ);
        $('input[name="F_COL_DATE_YN"]').val([selectdRow.COL_DATE_YN]);        
        $('input[name="F_COL_ENC_YN"]').val([selectdRow.COL_ENC_YN]);        
        $('#F_JOB_ID'   ).attr("readonly", true ); //설정								
        $('#F_COL_ID'   ).attr("readonly", true ); //설정								
        $('#CRUD2'   ).val("U");
      
	};	
	
	$('#btnAttrAdd').on( 'click', function () {
		
	//	console.log(recCount);
		
        $('#F_JOB_ID'   ).val( $('#F_JOB_ID').val());
        $('#F_COL_ID'   ).val("");
        $('#F_COL_CD'   ).val("");
        $('#F_COL_NM'   ).val("");
//        getAllSelectOptions("F_COL_TYPE_CD","COL_TYPE_CD","*");
        $('#F_COL_TYPE_CD' ).val("");
        $('#F_COL_TYPE_CD option:eq(0)').prop("selected", true);
        
        $('#F_COL_TYPE_NM' ).val("");
        $('#F_COL_LEN').val("");
        $('#F_COL_SEQ').val(recCount+1);
        $('input[name="F_COL_DATE_YN"]').val(["N"]);        
        $('input[name="F_COL_ENC_YN"]').val(["N"]);        
	    $('#F_COL_CD'   ).attr("readonly", false ); //설정
        $('#CRUD2'   ).val("C");
	 });
	
	$('#btnAttrDel').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.job_id  = $("input#F_JOB_ID").val();
		obj.col_id  = $("input#F_COL_ID").val();
		obj.crud    = "D";
		
		console.log('sCrud:'+ obj.crud);
		console.log('F_JOB_ID:'+ obj.job_id); 
		console.log('F_COL_ID:'+ obj.col_id); 
		
		if(obj.table_id == ''){
			alert("[알림] 작업을 먼저 선택하세요");
			$("input#F_JOB_CD").focus();
		    return;
		}

		$("#SetATTRForm").ajaxForm({
			url : 'SetScheduleColumn',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
		        $('#F_JOB_ID'   ).val("");
		        $('#F_COL_ID'   ).val("");
		        $('#F_COL_CD'   ).val("");
		        $('#F_COL_NM'   ).val("");
		        //getAllSelectOptions("F_COL_TYPE_CD","COL_TYPE_CD","*");
		        $('#F_COL_TYPE_CD' ).val("");
		        
		        $('#F_COL_TYPE_NM' ).val("");
		        $('#F_COL_LEN').val("");
		        $('#F_COL_SEQ').val("");
		        $('input[name="F_COL_DATE_YN"]').val(["N"]);        
		        $('input[name="F_COL_ENC_YN"]').val(["N"]);        
			    $('#F_JOB_CD'   ).attr("readonly", false ); //설정
				$('#CRUD2').val("C");
				$("#jqGrid2").jqGrid('delRowData', $('#ROWID2').val());
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
		$("#SetATTRForm").submit() ;
	});

	$('#btnAttrSave').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.job_id      = $("input#F_JOB_ID").val();
		obj.col_id      = $("input#F_COL_ID").val();
		obj.col_cd      = $("input#F_COL_CD").val().toUpperCase();
		obj.col_nm      = $("input#F_COL_NM").val().toUpperCase();
		obj.col_type_cd = $("select#F_COL_TYPE_CD").val();
		obj.col_type_nm = $('select#F_COL_TYPE_CD option:selected').text();
		obj.col_len     = $("input#F_COL_LEN").val();
		obj.col_seq     = $("input#F_COL_SEQ").val();
		obj.col_date_yn = $('input[name="F_COL_DATE_YN"]:checked').val()
		obj.col_enc_yn  = $('input[name="F_COL_ENC_YN"]:checked').val()		
		obj.crud        = $("input#CRUD2").val();
		
		console.log('job_id     :'+ obj.job_id     ); 
		console.log('col_id     :'+ obj.col_id     ); 
		console.log('col_cd     :'+ obj.col_cd     ); 
		console.log('col_nm     :'+ obj.col_nm     ); 
		console.log('col_type_cd:'+ obj.col_type_cd); 
		console.log('col_type_nm:'+ obj.col_type_nm); 
		console.log('col_len    :'+ obj.col_len    ); 
		console.log('col_seq    :'+ obj.col_seq    ); 
		console.log('col_date_yn:'+ obj.col_date_yn); 
		console.log('col_enc_yn :'+ obj.col_enc_yn ); 
		console.log('crud       :'+ obj.crud       ); 
		
		if(obj.job_id == ''){
			alert("[알림] 작업을 먼저 선택하세요");
			$("input#F_JOB_ID").focus();
		    return;
		}

		if(obj.col_cd == ''){
			alert("[알림] 컬럼ID를 입력하세요.");
			$("input#F_COL_CD").focus();
		    return;
		}
		
		if(obj.col_nm == ''){
			alert("[알림] 컬럼명을 입력하세요.");
			$("input#F_COL_NM").focus();
		    return;
		}

		if(Number(obj.col_len) <= 0){
			alert("[알림] 길이가 너무 작습니다.");
			$("input#F_COL_LEN").focus();
		    return;
		}

		if(Number(obj.col_len) > 999){
			alert("[알림] 길이가 너무 큽니다.");
			$("input#F_COL_LEN").focus();
		    return;
		}


		$("#SetATTRForm").ajaxForm({
			url : 'SetScheduleColumn',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				if (obj.crud == "U" ) {		
					console.log('grid update.........');
					var rowData = $('#jqGrid2').jqGrid('getRowData', $('#ROWID2').val());
					rowData.JOB_ID		= obj.job_id; 
					rowData.COL_ID		= obj.col_id; 
					rowData.COL_CD		= obj.col_cd; 
					rowData.COL_NM		= obj.col_nm; 
					rowData.COL_TYPE_CD	= obj.col_type_cd; 
					rowData.COL_TYPE_NM	= obj.col_type_nm; 
					rowData.COL_LEN		= obj.col_len; 
					rowData.COL_SEQ		= obj.col_seq; 
					rowData.COL_DATE_YN	= obj.col_date_yn; 
					rowData.COL_ENC_YN	= obj.col_enc_yn; 
					
					$('#jqGrid2').jqGrid('setRowData', $('#ROWID2').val(), rowData)
				} else {
					console.log('grid append.........');
					var ids = $('#jqGrid2').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid2').jqGrid('addRowData',idsLen,{});	
					var rowData = $('#jqGrid2').jqGrid('getRowData', idsLen);
					rowData.JOB_ID		= obj.job_id; 
					rowData.COL_ID		= json_data.genKey;
					rowData.COL_CD		= obj.col_cd; 
					rowData.COL_NM		= obj.col_nm; 
					rowData.COL_TYPE_CD	= obj.col_type_cd; 
					rowData.COL_TYPE_NM	= obj.col_type_nm; 
					rowData.COL_LEN		= obj.col_len; 
					rowData.COL_SEQ		= obj.col_seq; 
					rowData.COL_DATE_YN	= obj.col_date_yn; 
					rowData.COL_ENC_YN	= obj.col_enc_yn; 
			        recCount = recCount + 1;

					$('#jqGrid2').jqGrid('setRowData',idsLen, rowData)						
				} 
				alert("정상적으로 처리 되었습니다.");
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
		$("#SetATTRForm").submit() ;
	});
		
	$('#btnAttrRenum').click(function (e) {
		var formData = new FormData();

		console.log('grid append.........');
		var ids = $('#jqGrid2').getDataIDs();

		var allObj = new Array();
		
   		$.each(ids, function(index, value) {
   			
   			// 선택한 ROW 의 순번   			
   			var rowNum  = $('#jqGrid2').jqGrid('getInd', index+1);
   			var rowData = $('#jqGrid2').jqGrid('getRowData', index+1);

   			console.log((index+1) + "::" + rowNum + "::" + rowData.COL_NM);;   			
   			
   			var obj = new Object();
   			obj.job_id = $("input#F_JOB_ID").val();
   			obj.job_id  = rowData.JOB_ID ;   			
   			obj.col_id  = rowData.COL_ID ;   			
   			obj.col_seq = rowNum + "";  
   			obj.crud     = "RN";  //renumbering 

   			console.log(JSON.stringify(obj));
   			
   			$("#SetATTRForm").ajaxForm({
   				url : 'SetScheduleColumn',
   				dataType:'json',
   				type: 'post',
   				data:{param:JSON.stringify(obj)},
   				success: function(json_data) {
//   					alert("정상적으로 처리 되었습니다.");
   				}
   			});	
   			$("#SetATTRForm").submit() ;
   		});
		alert("정상적으로 처리 되었습니다.");
	});
	
	$('#btnConnect').click(function (e) {	
		if($("input#F_JOB_ID").val() == ''){
			alert("[알림] 작업을 선택하세요.");
			$("input#F_JOB_ID").focus();
		    return;
		}
		$(document.body).css({'cursor' : 'wait'});
		GetScheduleConnectTest();
	});

	$('#F_JOB_SCHEDULE_LABEL').click(function (e) {
		//showTableSelector();
		jQuery('#modal-7').modal({backdrop: 'static', keyboard: false});
	});
	
	$('#F_JOB_SCHEDULE_LABEL').css( 'cursor', 'pointer' );		

    $('input[name="F_USE_YN"]')[0].checked = true;
    $('input[name="F_SELECT_YN"]')[0].checked = true;

	refreshData();
	
	$("#searchVal").focus();

});
