$(document).ready(function() {
	
	//getServer($("#C_SERVER_ID"),1);

	function refreshData()  
	{
		var Obj = new Object();
		
		Obj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		Obj.__server_id = $('#C_SERVER_ID').val();;
		Obj.__agent_id  = '*';
		Obj.__rows      = "20";
		Obj.__page      = "1" ;
		
		$('#CRUD').val("U")
		
       var columns = [
	   		{name:'SERVER_ID'  , width: 100, hidden: true },
	   		{name:'SERVER_NM'  , width: 100, hidden: true },		
	   		{name:'AGENT_ID', width: 20, hidden: true},
	   		{name:'AGENT_NM'  , width: 100},		
	   		{name:'AGENT_PORT'  , width: 50},		
	   		{name:'ACCOUNT_CD'  , width: 100},		
	   		{name:'PASSWORD'  , width: 100, hidden: true },		
	   		{name:'PATH'  , width: 200, hidden: true},		
	   		{name:'DESCRIPTION'  , width: 200},		
	   		{name:'RUN_CD'  , width: 100, hidden: true},		
	   		{name:'RUN_NM'  , width: 100},		
	   		{name:'USE_YN'     , width:  50, 
	   			edittype: 'select', 
                formatter: 'select',
                align:'center',
                editable:true,                
                editoptions:{value: getUseSelectOptions()}
	   		}
	   	];
		
		$("#jqGrid").jqGrid({
	        url:"GetAgentList",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['ID','서버', 'ID', '이름','PORT','계정','암호','경로', '설명', '동작코드','동작','사용'],
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
		
		$('#F_AGENT_ID').attr("readonly", true); //설정
	 }

	function loadInfo(rowId, currentRow, currentPage) {

		var selectdRow = $("#jqGrid").jqGrid('getRowData', rowId);

		console.log(selectdRow);

		$('#ROWID').val(rowId);
		
		jsonObj = {};
		
		jsonObj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		jsonObj.__server_id = selectdRow.SERVER_ID;
		jsonObj.__agent_id  = selectdRow.AGENT_ID;
		jsonObj.__rows      = currentRow+"";
		jsonObj.__page      = currentPage+"" ;
		
		$.ajax({
			url: 'GetAgentList',    
			data: {param:JSON.stringify(jsonObj)},
			type:"post",
			dataType:"json",
			success: function(json_data) {
	
				console.log(json_data);
				
		        if(json_data.result == 'OK') {

			        $('#F_AGENT_ID').val(json_data.rows[0].AGENT_ID);
			        $('#F_AGENT_NM').val(json_data.rows[0].AGENT_NM);
			        $('#F_AGENT_PORT').val(json_data.rows[0].AGENT_PORT);
			        $('#F_ACCOUNT_CD').val(json_data.rows[0].ACCOUNT_CD);
			        $('#F_PASSWORD').val(json_data.rows[0].PASSWORD);
			        $('#F_PATH').val(json_data.rows[0].PATH);
			        $('#F_DESCRIPTION').val(json_data.rows[0].DESCRIPTION);
			        //getAllSelectOptions("F_RUN_CD","RUN_CD",json_data.rows[0].RUN_CD);
			        $('#F_RUN_CD').val(json_data.rows[0].RUN_CD);
		    		$('input[name="F_USE_YN"]').val([json_data.rows[0].USE_YN]);
		    		$('#CRUD').val("U");
			        $('#F_AGENT_ID').attr("readonly", true ); //설정
			        
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
		refreshData();		
	});
	
	$('#btnCancel').click(function (e) {
		$('#searchVal').val("");
		$("#searchVal").focus();
	});

	
	$('#btnAdd').click(function (e) {

		$('#F_AGENT_ID').val("");
		$('#F_AGENT_NM').val("");
		$('#F_AGENT_PORT').val("");
		$('#F_ACCOUNT_CD').val("");
		$('#F_PASSWORD').val("");
		$('#F_PATH').val("");
		$('#F_DESCRIPTION').val("");
		//getAllSelectOptions("F_RUN_CD","RUN_CD","");
		$('#F_RUN_CD').val("");
		$('#F_RUN_CD option:eq(0)').prop("selected", true);

		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#CRUD').val("C");
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("C_SERVER_ID").val();
		obj.agent_id   = $("input#F_AGENT_ID").val();
		obj.crud        = "D";
		
		console.log('C_SERVER_ID:'+ obj.server_id);
		console.log('F_AGENT_ID:'+ obj.agent_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetAgentForm").ajaxForm({
			url : 'SetAgent',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
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
		$("#SetAgentForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("#C_SERVER_ID").val();
		obj.agent_id    = $("input#F_AGENT_ID").val();
		obj.agent_nm    = $("input#F_AGENT_NM").val();
		obj.agent_port  = $("input#F_AGENT_PORT").val();
		obj.account_cd  = $("input#F_ACCOUNT_CD").val();
		obj.password    = $("input#F_PASSWORD").val();
		obj.path        = $("input#F_PATH").val();
		obj.description = $("textarea#F_DESCRIPTION").val();
		obj.run_cd      = $("select#F_RUN_CD").val();
		obj.run_nm      = $('select#F_RUN_CD option:selected').text();
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
		console.log('run_nm:'+ obj.run_nm); 
		console.log('use_yn:'+ obj.use_yn); 

		
		if(obj.agent_nm == '' || obj.agent_nm == null){
			alert("[알림] Agent명을 입력하세요.");
			$("input#F_AGENT_NM").focus();
		    return;
		}

		if(obj.run_cd == '' || obj.run_cd == null){
			alert("[알림] Agent 종류를 선택하세요.");
			$("input#F_RUN_CD").focus();
		    return;
		}
		
		$("#SetAgentForm").ajaxForm({
			url : 'SetAgent',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
/*				if (obj.crud == "U" ) {				
					var rowData = $('#jqGrid').jqGrid('getRowData', $('#ROWID').val());
					rowData.SERVER_NM= obj.server_nm; 
					rowData.SERVER_IP= obj.server_ip; 
					rowData.AGENT_ID= obj.agent_id; 
					rowData.AGENT_NM= obj.agent_nm; 
					rowData.AGENT_PORT= obj.agent_port; 
					rowData.ACCOUNT_CD= obj.account_cd; 
					rowData.PASSWORD= obj.password; 
					rowData.PATH= obj.path; 
					rowData.DESCRIPTION= obj.description; 
					rowData.RUN_CD= obj.run_cd; 
					rowData.RUN_NM= obj.run_nm; 
					rowData.USE_YN= obj.use_yn; 
					$('#jqGrid').jqGrid('setRowData', $('#ROWID').val(), rowData)
				} else {
					var ids = $('#jqGrid').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid').jqGrid('addRowData',idsLen,{});	
					var ids2 = $('#jqGrid').getDataIDs();
					var rowData = $('#jqGrid').jqGrid('getRowData', idsLen);
					rowData.SERVER_NM= obj.server_nm; 
					rowData.SERVER_IP= obj.server_ip; 
					rowData.AGENT_ID= obj.agent_id; 
					rowData.AGENT_NM= obj.agent_nm; 
					rowData.AGENT_PORT= obj.agent_port; 
					rowData.ACCOUNT_CD= obj.account_cd; 
					rowData.PASSWORD= obj.password; 
					rowData.PATH= obj.path; 
					rowData.DESCRIPTION= obj.description; 
					rowData.RUN_CD= obj.run_cd; 
					rowData.RUN_NM= obj.run_nm; 
					rowData.USE_YN= obj.use_yn; 
					$('#jqGrid').jqGrid('setRowData',idsLen, rowData)						
				}*/
				$('#btnQuery').click();
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
		$("#SetAgentForm").submit() ;
	});

	$('input[name="C_USE_YN"]').val(["Y"]);
	
	$('#btnQuery').click();	
	
	$("#searchVal").focus();

});
