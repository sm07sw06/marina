$(document).ready(function() {
	

	function refreshData1()  
	{
		var Obj = new Object();

		Obj.__gb      = 'A';
		Obj.__user_gb = $('#C_USERGRP').val();
		Obj.__user_id = "";
//		Obj.__user_cd = $('#C_USER_NM').val();
		Obj.__user_nm = $('#C_USER_NM').val();
		Obj.__rows    = "20";
		Obj.__page    = "1" ;

		console.log("__gb:"+Obj.__gb)
		console.log("__user_gb:"+Obj.__user_gb)
//		console.log("__user_cd:"+Obj.__user_cd)		
		console.log("__user_nm:"+Obj.__user_nm)

		var columns1 = [
			{name:'USER_ID'    , width: 100, hidden: true},
			{name:'USER_NM'    , width: 100}
		];

		$("#jqGrid1").jqGrid({
			url:"GetAuthList",
			datatype: 'json',
			mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
			loadComplete : function (data) {
				$.each(data, function(index, value) {
					if(index == "total") {
					}
				});
			},
			colNames:['ID', '사용'],
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

	function refreshData2(userId)  
	{

		$("#tableDivID2").replaceWith(function () {
			  return "<div id= 'tableDivID2'><table id='jqGrid2'></table><div id='jqGridPager2'></div></div>";
		});

		
		var Obj = new Object();

		Obj.__gb      = 'B';
		Obj.__user_gb = $('#C_USERGRP').val();
		Obj.__user_id = userId;
//		Obj.__user_cd = $('#C_USER_NM').val();
		Obj.__user_nm = $('#C_USER_NM').val();
		Obj.__rows    = "20";
		Obj.__page    = "1" ;

		console.log("__gb:"+Obj.__gb)
		console.log("__user_gb:"+Obj.__user_gb)
		console.log("__user_id:"+Obj.__user_id)		
		console.log("__user_nm:"+Obj.__user_nm)

		$('#CRUD1').val("U")

		var columns2 = [
			{name:'MENU_ID'    , width: 100, hidden: true},
			{name:'MENU_NM'    , width: 100},
			{name:'MENU_URL'   , width: 100}		
		];

		$("#jqGrid2").jqGrid({
			url:"GetAuthList",
			datatype: 'json',
			mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
			loadComplete : function (data) {
				$.each(data, function(index, value) {
					if(index == "total") {
					}
				});
			},
			colNames:['iD', '이름', '화면코드'],
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

	function refreshData3(userId)  
	{
		$("#tableDivID3").replaceWith(function () {
			  return "<div id= 'tableDivID3'><table id='jqGrid3'></table><div id='jqGridPager3'></div></div>";
		});

		var Obj = new Object();

		Obj.__gb      = 'C';
		Obj.__user_gb = $('#C_USERGRP').val();
		Obj.__user_id = userId;
//		Obj.__user_cd = $('#C_USER_NM').val();
		Obj.__user_nm = $('#C_USER_NM').val();
		Obj.__rows    = "20";
		Obj.__page    = "1" ;

		console.log("__gb:"+Obj.__gb)
		console.log("__user_gb:"+Obj.__user_gb)
		console.log("__user_id:"+Obj.__user_id)		
//		console.log("__user_cd:"+Obj.__user_cd)		
		console.log("__user_nm:"+Obj.__user_nm)

		$('#CRUD1').val("U")

		var columns3 = [
			{name:'MENU_ID'    , width: 100, hidden: true},
			{name:'MENU_CD'    , width: 100, hidden: true},
			{name:'MENU_NM'    , width: 100},
			{name:'MENU_URL'    , width: 100},
			{name:'MENU_ORDER'    , width: 50, hidden: true}		
		];

		$("#jqGrid3").jqGrid({
			url:"GetAuthList",
			datatype: 'json',
			mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
			loadComplete : function (data) {
				$.each(data, function(index, value) {
					if(index == "total") {
					}
				});
			},
			colNames:['ID', 'CD', '메뉴명', '화면명', '순서'],
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


	function loadInfo1(rowId, currentRow, currentPage) { 
		
		var selectdRow = $("#jqGrid1").jqGrid('getRowData', rowId);

		console.log( "rowId:" + rowId);
		console.log( "selectdRow.USER_ID:" + selectdRow.USER_ID);
		console.log( "selectdRow.USER_NM:" + selectdRow.USER_NM);

        $('#C_USER_ID').val(selectdRow.USER_ID);
        $('#CRUD1'   ).val("U");
        
        refreshData2(selectdRow.USER_ID);
        refreshData3(selectdRow.USER_ID);
        
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
		rowData.MENU_ID  = selectdRow.MENU_ID; 
		rowData.MENU_NM  = selectdRow.MENU_NM; 
		rowData.MENU_URL = selectdRow.MENU_URL; 
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
		rowData.MENU_ID  = selectdRow.MENU_ID; 
		rowData.MENU_NM  = selectdRow.MENU_NM; 
		rowData.MENU_URL = selectdRow.MENU_URL; 
		$('#jqGrid2').jqGrid('setRowData',idsLen, rowData)	
		
        $("#jqGrid3").jqGrid('delRowData', rowId);
	};	
	
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();

		console.log('grid append.........');
		var rowDatas = $('#jqGrid3').jqGrid('getRowData');
		
		var allObj = new Array();
		

		var user_gb = $('#C_USERGRP').val();
		var user_id = $("#C_USER_ID").val();

		console.log("user_gb:"+user_gb)
		console.log("user_id:"+user_id)

		
		var i = 0;
		while (i < rowDatas.length) {
   			var obj = new Object();
   			obj.menu_id     = rowDatas[i].MENU_ID ;   			
   	   		allObj.push(obj);
   	   		i++;
		}
		
   		//console.log(JSON.stringify(allObj) + ":" + JSON.stringify(allObj).length);
		
		$("#SetGroupForm").ajaxForm({
			url : 'SetAuth',
			dataType:'json',
			type: 'post',
			data:{"param":JSON.stringify(allObj),"user_gb":user_gb,"user_id":user_id},
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
