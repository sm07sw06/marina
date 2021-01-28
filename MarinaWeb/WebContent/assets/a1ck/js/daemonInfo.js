$(document).ready(function() {
	
	function refreshData()  
	{
		var Obj = new Object();
		
		Obj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		Obj.__daemon_id = '*';
		Obj.__rows      = "20";
		Obj.__page      = "1" ;
		
		$('#CRUD').val("U")
		
	       var columns = [
		   		{name:'DAEMON_ID', width: 20, hidden: true},
		   		{name:'DAEMON_NM'  , width: 100},		
		   		{name:'DAEMON_IP'  , width: 50},		
		   		{name:'DAEMON_PORT'  , width: 50, align:'center'},		
		   		{name:'DAEMON_DESC'  , width: 100},		
		   		{name:'DAEMON_STAT_CD'  , width: 50, align:'center', hidden: true},		
		   		{name:'DAEMON_STAT_NM'  , width: 50, align:'center'},		
		   		{name:'AUTO_RESTART_YN'     , width:  50, 
		   			edittype: 'select', 
	                formatter: 'select',
	                align:'center',
	                editable:true,                
	                editoptions:{value: getUseSelectOptions()}
		   		},
		   		{name:'USE_YN'     , width:  50, 
		   			edittype: 'select', 
	                formatter: 'select',
	                align:'center',
	                editable:true,                
	                editoptions:{value: getUseSelectOptions()}
		   		}
		   	];
			
			$("#jqGrid").jqGrid({
		        url:"GetDaemonList",
		    	datatype: 'json',
		    	mtype: 'POST',
				postData : {param:JSON.stringify(Obj)},
			   	loadComplete : function (data) {
			   		$.each(data, function(index, value) {
			   			if(index == "total") {
			   			}
			   		});
			   	},
			   	colNames:['ID', '이름','IP','PORT','설명','상태','상태', '자동시작', '사용'],
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
				     
//				    console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
			        loadInfo(rowId, pageSize, curPage);
				}
			}).trigger("reloadGrid");
			jQuery("#jqGrid").jqGrid('navGrid','#jqGridPager',{edit:false,add:false,del:false});
			
			$('#F_DAEMON_ID').attr("readonly", true); //설정
		 }

		function loadInfo(rowId, currentRow, currentPage) {

			var selectdRow = $("#jqGrid").jqGrid('getRowData', rowId);

			console.log( "rowId:" + rowId);

			$('#ROWID').val(rowId);
			
			jsonObj = {};
			
			jsonObj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
			jsonObj.__daemon_id  = selectdRow.DAEMON_ID;
			jsonObj.__rows      = currentRow+"";
			jsonObj.__page      = currentPage+"" ;
			
			$.ajax({
				url: 'GetDaemonList',    
				data: {param:JSON.stringify(jsonObj)},
				type:"post",
				dataType:"json",
				success: function(json_data) {
		
			        if(json_data.result == 'OK') {

				        $('#F_DAEMON_ID').val(json_data.rows[0].DAEMON_ID);
				        $('#F_DAEMON_NM').val(json_data.rows[0].DAEMON_NM);
				        $('#F_DAEMON_IP').val(json_data.rows[0].DAEMON_IP);
				        $('#F_DAEMON_PORT').val(json_data.rows[0].DAEMON_PORT);
				        $('#F_DAEMON_DESC').val(json_data.rows[0].DAEMON_DESC);
//				        getAllSelectOptions("F_DAEMON_STAT_CD","DAEMON_STAT_CD",json_data.rows[0].DAEMON_STAT_CD);
				        $('#F_DAEMON_STAT_CD').val(json_data.rows[0].DAEMON_STAT_CD);
			    		$('input[name="F_AUTO_RESTART_YN"]').val([json_data.rows[0].AUTO_RESTART_YN]);
			    		$('input[name="F_USE_YN"]').val([json_data.rows[0].USE_YN]);
			    		$('#CRUD').val("U");
				        $('#F_DAEMON_ID').attr("readonly", true ); //설정
				        
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
			$('#F_DAEMON_ID').val("");
			$('#F_DAEMON_NM').val("");
			$('#F_DAEMON_IP').val("");
			$('#F_DAEMON_PORT').val("");
			$('#F_DAEMON_DESC').val("");
//			getAllSelectOptions("F_DAEMON_STAT_CD","DAEMON_STAT_CD","");
//			$('#F_DAEMON_STAT_CD').val(getComboBoxByCodeList("DAEMON_STAT_CD", "", true));
			$('#F_DAEMON_STAT_CD option:eq(0)').prop("selected", true);
			
			$('input[name="F_AUTO_RESTART_YN"]').val(["Y"]);
			$('input[name="F_USE_YN"]').val(["Y"]);
			$('#CRUD').val("C");
			$('#F_DAEMON_ID'  ).attr("readonly", true); //설정
		});
		
		$('#btnDelete').click(function (e) {
			var formData = new FormData();
			
			var obj = new Object();
			obj.server_id   = $("#C_SERVER_ID").val();
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
			$("#SetDaemonForm").submit() ;
		});
		
		$('#btnSave').click(function (e) {
			var formData = new FormData();
			
			var obj = new Object();
			obj.server_id    = $("#C_SERVER_ID").val();
			obj.daemon_id    = $("input#F_DAEMON_ID").val();
			obj.daemon_nm    = $("input#F_DAEMON_NM").val();
			obj.daemon_ip    = $("input#F_DAEMON_IP").val();
			obj.daemon_port  = $("input#F_DAEMON_PORT").val();
			obj.daemon_desc  = $("textarea#F_DAEMON_DESC").val();
			obj.daemon_stat_cd  = $("select#F_DAEMON_STAT_CD").val();
			obj.daemon_stat_nm  = $('select#F_DAEMON_STAT_CD option:selected').text();
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
			console.log('daemon_stat_nm:'+ obj.daemon_stat_nm); 
			console.log('auto_restart_yn:'+ obj.auto_restart_yn); 
			console.log('use_yn:'+ obj.use_yn); 
			
			if(obj.daemon_nm == ''){
				alert("[알림] Agent명을 입력하세요.");
				$("input#F_DAEMON_NM").focus();
			    return;
			}

			$("#SetDaemonForm").ajaxForm({
				url : 'SetDaemon',
				dataType:'json',
				type: 'post',
				data:{param:JSON.stringify(obj)},
				success: function(json_data) {
 					if (obj.crud == "U" ) {		
						console.log('grid update.........');
						var rowData = $('#jqGrid').jqGrid('getRowData', $('#ROWID').val());
						rowData.DAEMON_ID= obj.daemon_id; 
						rowData.DAEMON_NM= obj.daemon_nm; 
						rowData.DAEMON_IP= obj.daemon_ip; 
						rowData.DAEMON_PORT= obj.daemon_port; 
						rowData.DAEMON_DESC= obj.daemon_desc; 
						rowData.DAEMON_STAT_CD= obj.daemon_stat_cd; 
						rowData.DAEMON_STAT_NM= obj.daemon_stat_nm; 
						rowData.AUTO_RESTART_YN= obj.auto_restart_yn; 
						rowData.USE_YN= obj.use_yn; 
						$('#jqGrid').jqGrid('setRowData', $('#ROWID').val(), rowData)
					} else {
						console.log('grid append.........');
						
						var ids = $('#jqGrid').getDataIDs();
						var idsLen = ids.length + 1;
						$('#jqGrid').jqGrid('addRowData',idsLen,{});	
						var rowData = $('#jqGrid').jqGrid('getRowData', idsLen);
						rowData.DAEMON_ID   = json_data.genKey;
						rowData.DAEMON_NM   = obj.daemon_nm; 
						rowData.DAEMON_IP   = obj.daemon_ip; 
						rowData.DAEMON_PORT = obj.daemon_port; 
						rowData.DAEMON_DESC = obj.daemon_desc; 
						rowData.DAEMON_STAT_CD  = obj.daemon_stat_cd; 
						rowData.DAEMON_STAT_NM  = obj.daemon_stat_nm; 
						rowData.AUTO_RESTART_YN = obj.auto_restart_yn; 
						$('#jqGrid').jqGrid('setRowData',idsLen, rowData)						
					}
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
			$("#SetDaemonForm").submit() ;
		});

		$('input[name="C_USE_YN"]').val(["Y"]);
		
		$('#btnQuery').click();
		
		$("#searchVal").focus();

	});
