$(document).ready(function() {
	

	function refreshData1()  
	{
		var Obj = new Object();

		Obj.__gb       = 'A';
		Obj.__userGroup_id = '*';
		Obj.__userGroup_nm =  $('#C_USER_GRP_NM').val();
		Obj.__rows     = "20";
		Obj.__page     = "1" ;

		$('#F_USER_GRP_ID' ).val("");
		$('#F_USER_GRP_NM' ).val("");
		$('#F_DESCRIPTION' ).val("");
		$('#F_USER_GRP_NM' ).focus();
		$('#CRUD1'         ).val("U");		
		
		$('#CRUD1').val("U")

		console.log("__userGroup_id:"+Obj.__userGroup_id)
		console.log("__userGroup_nm:"+Obj.__userGroup_nm)

		var columns1 = [
			{name:'USER_GRP_ID'    , width: 100, hidden: true},
			{name:'USER_GRP_NM'    , width: 100},		
			{name:'DESCRIPTION'    , width: 100, hidden: true},
			{name:'USE_YN'         , width:  50, 
	   			edittype: 'select', 
                formatter: 'select',
                align:'center',
                editable:true,                
                editoptions:{value: getUseSelectOptions()}
	   		}			
		];

		$("#jqGrid1").jqGrid({
			url:"GetUserGroup",
			datatype: 'json',
			mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
			loadComplete : function (data) {
				$.each(data, function(index, value) {
					if(index == "total") {
					}
				});
			},
			colNames:['ID', '그룹명', '설명', '사용'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager1",
			height: 300,
			rowNum: 12,
			viewrecords: true, // show the current page, data rang and total records on the toolbar
			autowidth : true,
			pageModel: { type: 'local', rPP: 20, rPPOptions: [1, 10, 20, 30, 40, 50, 100] },
			scrollModel: { lastColumn: null },
			colModel: columns1,
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
	}

	function refreshData2()  
	{

		$("#tableDivID2").replaceWith(function () {
			  return "<div id= 'tableDivID2'><table id='jqGrid2'></table><div id='jqGridPager2'></div></div>";
		});

		
		var Obj = new Object();

		Obj.__gb       = 'B';
		Obj.__userGroup_id = $('#F_USER_GRP_ID').val();
		Obj.__userGroup_nm = '*';
		Obj.__rows     = "20";
		Obj.__page     = "1" ;

		$('#CRUD1').val("U")

		console.log("__userGroup_id:"+Obj.__userGroup_id)
		console.log("__userGroup_nm:"+Obj.__userGroup_nm)
		
		var columns2 = [
			{name:'USER_ID'    , width: 100, hidden: true},
			{name:'USER_NM'    , width: 100}		
		];

		$("#jqGrid2").jqGrid({
			url:"GetUserGroup",
			datatype: 'json',
			mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
			loadComplete : function (data) {
				$.each(data, function(index, value) {
					if(index == "total") {
					}
				});
			},
			colNames:['ID',  '사용자'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager2",
			height: 400,
			rowNum: 20,
			viewrecords: true, // show the current page, data rang and total records on the toolbar
			autowidth : true,
			pageModel: { type: 'local', rPP: 20, rPPOptions: [1, 10, 20, 30, 40, 50, 100] },
			scrollModel: { lastColumn: null },
			colModel: columns2,
			sortorder: 'asc',
			numberCell: { resizable: true, width: 40, title: "#", minWidth: 25 },
			resizable: true, 
			loadonce: true,
			ondblClickRow : function(rowId, iRow, iCol, e) {
				var curPage =  $("#jqGrid2").getGridParam("page");
				var pageSize = $("#jqGrid2").getGridParam("rowNum");
				var curRowNum = parseInt((curPage-1)*pageSize) + parseInt(rowId); 
		//		console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
				loadInfo2(rowId, pageSize, curPage);
			}
		}).trigger("reloadGrid");
		jQuery("#jqGrid2").jqGrid('navGrid','#jqGridPager2',{edit:false,add:false,del:false});
	}

	function refreshData3()  
	{
		$("#tableDivID3").replaceWith(function () {
			  return "<div id= 'tableDivID3'><table id='jqGrid3'></table><div id='jqGridPager3'></div></div>";
		});

		var Obj = new Object();

		Obj.__gb       = 'C';
		Obj.__userGroup_id = $('#F_USER_GRP_ID').val();
		Obj.__userGroup_nm = '*';
		Obj.__rows     = "20";
		Obj.__page     = "1" ;

		$('#CRUD1').val("U")

		console.log("__userGroup_id:"+Obj.__userGroup_id)
		console.log("__userGroup_nm:"+Obj.__userGroup_nm)
		
		var columns3 = [
			{name:'USER_ID'    , width: 100, hidden: true},
			{name:'USER_NM'    , width: 100}		
		];

		$("#jqGrid3").jqGrid({
			url:"GetUserGroup",
			datatype: 'json',
			mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
			loadComplete : function (data) {
				$.each(data, function(index, value) {
					if(index == "total") {
					}
				});
			},
			colNames:['ID',  '사용자'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager3",
			height: 400,
			rowNum: 20,
			viewrecords: true, // show the current page, data rang and total records on the toolbar
			autowidth : true,
			pageModel: { type: 'local', rPP: 20, rPPOptions: [1, 10, 20, 30, 40, 50, 100] },
			scrollModel: { lastColumn: null },
			colModel: columns3,
			sortorder: 'asc',
			numberCell: { resizable: true, width: 40, title: "#", minWidth: 25 },
			resizable: true, 
			loadonce: true,
			ondblClickRow : function(rowId, iRow, iCol, e) {
				var curPage =  $("#jqGrid3").getGridParam("page");
				var pageSize = $("#jqGrid3").getGridParam("rowNum");
				var curRowNum = parseInt((curPage-1)*pageSize) + parseInt(rowId); 
				//console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
				loadInfo3(rowId, pageSize, curPage);
			}
		}).trigger("reloadGrid");
		jQuery("#jqGrid3").jqGrid('navGrid','#jqGridPager3',{edit:false,add:false,del:false});
	}
    
    
    $('#btnQuery').click(function (e) {
		$("#tableDivID1").replaceWith(function () {
			  return "<div id= 'tableDivID1'><table id='jqGrid1'></table><div id='jqGridPager1'></div></div>";
		});
		refreshData1();	
	});

	$('#btnAdd').click(function (e) {
		$('#F_USER_GRP_ID' ).val("");
		$('#F_USER_GRP_NM' ).val("");
		$('#F_DESCRIPTION' ).val("");
		$('#F_USER_GRP_NM' ).focus();
		$('#CRUD1'         ).val("C");
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.user_grp_id    = $("input#F_USER_GRP_ID").val();
		obj.user_grp_nm    = $("input#F_USER_GRP_NM").val();
		obj.description     = $("textarea#F_DESCRIPTION").val();
		obj.use_yn       = $('input[name="F_USE_YN"]:checked').val()
		obj.crud         = $("input#CRUD1").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('F_USER_GRP_ID :'+ obj.user_grp_id); 
		console.log('F_USER_GRP_NM :'+ obj.user_grp_nm); 
		console.log('F_DESCRIPTION :'+ obj.description); 
		console.log('F_USE_YN:'+ obj.use_yn); 		
		console.log('CRUD:'+ obj.crud); 
		
		if(obj.user_grp_nm == ''){
			alert("[알림] 그룹명명을 입력하세요.");
			$("input#F_USER_GRP_NM").focus();
		    return;
		}

		$("#SetGroupForm").ajaxForm({
			url : 'SetUserGroup',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
/*				if (obj.crud == "U" ) {		
					console.log('grid update.........');
					var rowData = $('#jqGrid1').jqGrid('getRowData', $('#ROWID1').val());
					rowData.F_USER_GRP_ID = obj.user_grp_id; 
					rowData.F_USER_GRP_NM = obj.user_grp_nm; 
					rowData.F_DESCRIPTION = obj.description; 
					rowData.USE_YN= obj.use_yn; 
					$('#jqGrid1').jqGrid('setRowData', $('#ROWID1').val(), rowData)
				} else {
					console.log('grid append.........');
					var ids = $('#jqGrid1').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid1').jqGrid('addRowData',idsLen,{});	
					var ids2 = $('#jqGrid1').getDataIDs();
					var rowData = $('#jqGrid1').jqGrid('getRowData', idsLen);
					rowData.F_USER_GRP_ID = obj.user_grp_id; 
					rowData.F_USER_GRP_NM = obj.user_grp_nm; 
					rowData.F_DESCRIPTION = obj.description; 
					rowData.USE_YN= obj.use_yn; 					
					$('#jqGrid1').jqGrid('setRowData',idsLen, rowData)						
				}*/
				$('#btnQuery').click();
				$('#btnAdd').click();
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
		$("#SetGroupForm").submit() ;
	});
	
	function loadInfo1(rowId, currentRow, currentPage) { 
		
		var selectdRow = $("#jqGrid1").jqGrid('getRowData', rowId);

		console.log( "rowId:" + rowId);

		$('#ROWID1').val(rowId);
		
        $('#F_USER_GRP_ID'   ).val(selectdRow.USER_GRP_ID);
        $('#F_USER_GRP_NM'   ).val(selectdRow.USER_GRP_NM);
        $('#F_DESCRIPTION'   ).val(selectdRow.DESCRIPTION);
        $('input[name="F_USE_YN"]').val([selectdRow.USE_YN]);        
        $('#CRUD1'   ).val("U");
        
        refreshData2();
        refreshData3();
        
	};	
	
	function loadInfo2(rowId, currentRow, currentPage) { 
		
		var selectdRow = $("#jqGrid2").jqGrid('getRowData', rowId);

		console.log( "rowId:" + rowId + "::" + selectdRow.USER_ID + "::" + selectdRow.USER_NM);
	
		console.log('grid append.........');
		var ids = $('#jqGrid3').getDataIDs();
		var idsLen = ids.length + 1;
		$('#jqGrid3').jqGrid('addRowData',idsLen,{});	
		var ids2 = $('#jqGrid3').getDataIDs();
		var rowData = $('#jqGrid3').jqGrid('getRowData', idsLen);
		rowData.USER_ID= selectdRow.USER_ID; 
		rowData.USER_NM= selectdRow.USER_NM; 
		$('#jqGrid3').jqGrid('setRowData',idsLen, rowData)	
		
		
        $("#jqGrid2").jqGrid('delRowData', rowId);
	};	
	
	function loadInfo3(rowId, currentRow, currentPage) { 
		
		var selectdRow = $("#jqGrid3").jqGrid('getRowData', rowId);

		console.log( "rowId:" + rowId + "::" + selectdRow.USER_ID + "::" + selectdRow.USER_NM);

		console.log('grid append.........');
		var ids = $('#jqGrid2').getDataIDs();
		var idsLen = ids.length + 1;
		$('#jqGrid2').jqGrid('addRowData',idsLen,{});	
		var ids2 = $('#jqGrid2').getDataIDs();
		var rowData = $('#jqGrid2').jqGrid('getRowData', idsLen);
		rowData.USER_ID= selectdRow.USER_ID; 
		rowData.USER_NM= selectdRow.USER_NM; 
		$('#jqGrid2').jqGrid('setRowData',idsLen, rowData)	
		
        $("#jqGrid3").jqGrid('delRowData', rowId);
	};	
	
	$('#btnAdd').on( 'click', function () {
		$('#F_USER_GRP_NM'   ).val("");
		$('input[name="F_USE_YN"]').val(["Y"]);     		
        $('#CRUD1'   ).val("C");
	 });

	
	$('#btnAttrRenum').click(function (e) {
		var formData = new FormData();

		console.log('grid append.........');
		var rowDatas = $('#jqGrid3').jqGrid('getRowData');
		
		var allObj = new Array();
		
		var user_grp_id = $("input#F_USER_GRP_ID").val();
		
		var i = 0;
		while (i < rowDatas.length) {
   			var obj = new Object();
   			obj.user_id     = rowDatas[i].USER_ID ;   			
   	   		allObj.push(obj);
   	   		i++;
		}
		
   		//console.log(JSON.stringify(allObj) + ":" + JSON.stringify(allObj).length);
		
		$("#SetGroupForm").ajaxForm({
			url : 'SetUserGroupMember',
			dataType:'json',
			type: 'post',
			data:{"param":JSON.stringify(allObj),"user_grp_id":user_grp_id},
			success: function(json_data) {
   					alert("정상적으로 처리 되었습니다.");
			}
		});	
		$("#SetGroupForm").submit() ;
//		alert("정상적으로 처리 되었습니다.");
	});

	refreshData1();
	
	$("#searchVal").focus();

});
