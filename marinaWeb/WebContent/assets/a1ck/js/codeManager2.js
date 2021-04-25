$(document).ready(function() {
	
    var recCount= 0;
    

	function refreshData()  
	{
		var Obj = new Object();
		
		Obj.__crud     = "R";
		Obj.__rows     = "20";
		Obj.__page     = "1" ;
		
		$('#CRUD1').val("C")
		
		$('input[name="F_USE_YN"]').val(["Y"]);	
		$('input[name="F_USE_SUB_YN"]').val(["Y"]);	
		
       var columns = [
	   		{name:'GROUP_CD'	, width:  150, align:'left'  },		
	   		{name:'GROUP_NM'	, width:  150, align:'left'  },	
	   		{name:'USE_YN'	    , width:   80, align:'center'}		 
	   	];
		
		$("#jqGrid1").jqGrid({
	        url:"GetCodeManager",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		loadInfo1(1, 20 , 1);
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['코드','이름', '사용'],
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
			     
//				console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
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
	
	$('#btnAdd').click(function (e) {
//		$('#btnAdd').prop('disabled', true);
		// 작업을 타이머에게 부탁하고 끝냄
	    //setTimeout(process, 0);
//		getAllSelectOptions("F_SRC_DBMS_CD","DBMS_CD","");
		$('#F_GROUP_CD'		 ).val("");
		$('#F_GROUP_NM'		 ).val("");
		$('input[name="F_USE_YN"]').val(["Y"]);	
		$("input#CRUD1").val("C");
		$('#F_GROUP_CD').attr("readonly", false); //설정	
		//$('#btnAdd').prop('disabled', false);
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();

		var inputString = confirm('삭제후 복구 할수 없습니다.\n 삭제 하시겠습니까?');

		if(inputString == false){
			return;
		}
		
		var obj = new Object();
		obj.__group_cd      = $("input#F_GROUP_CD").val();
		obj.__group_nm      = $("input#F_GROUP_NM").val();
		obj.__use_yn        = "N";
		obj.__crud          = "D";
		
//		console.log('F_GROUP_CD:'+ obj.__group_cd);
//		console.log('sCrud:'+ obj.__crud);

		if($.trim(obj.__group_cd) == ''){
			alert("[알림] 그룹코드를 선택하세요.");
			$("input#F_GROUP_ID").focus();
		    return;
		}
		
		$("#SetTableForm").ajaxForm({
			url : 'SetCodeManager',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				$('#F_GROUP_CD'		 ).val("");
				$('#F_GROUP_NM'		 ).val("");
				$('input[name="F_USE_YN"]').val(["Y"]);
				$('#CRUD1'        ).val("C");
				$('#F_GROUP_CD'   ).attr("readonly", false); //설정	
			//	$("#jqGrid1").jqGrid('delRowData', $('#ROWID1').val());
				var rowData = $('#jqGrid1').jqGrid('getRowData', $('#ROWID1').val());
				rowData.USE_YN     = obj.__use_yn; 
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
		obj.__group_cd      = $("input#F_GROUP_CD").val();
		obj.__group_nm      = $("input#F_GROUP_NM").val();
		obj.__use_yn        = $('input[name="F_USE_YN"]:checked').val()
		obj.__crud          = $("input#CRUD1").val();
		
//		console.log('sCrud:'+ obj.__crud);
//		console.log('group_cd      :'+ obj.__group_cd );
//		console.log('group_nm      :'+ obj.__group_nm );
//		console.log('use_yn        :'+ obj.__use_yn   );
		
		if($.trim(obj.__group_cd) == ''){
			alert("[알림] 그룹코드를 입력하세요.");
			$("input#F_GROUP_CD").focus();
		    return;
		}

		if($.trim(obj.__group_nm) == ''){
			alert("[알림] 그룹코드명을 입력하세요.");
			$("input#F_GROUP_NM").focus();
		    return;
		}

		$("#SetTableForm").ajaxForm({
			url : 'SetCodeManager',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				
//				console.log(json_data);
				
 				if (obj.__crud == "U" ) {		
//					console.log('grid update.........');
					var rowData = $('#jqGrid1').jqGrid('getRowData', $('#ROWID1').val());
					rowData.GROUP_CD   = obj.__group_cd; 
					rowData.GROUP_NM   = obj.__group_nm; 
					rowData.USE_YN     = obj.__use_yn; 
					$('#jqGrid1').jqGrid('setRowData', $('#ROWID1').val(), rowData)
				} else {
//					console.log('grid append.........');
					var ids = $('#jqGrid1').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid1').jqGrid('addRowData',idsLen,{});	
					var ids2 = $('#jqGrid1').getDataIDs();
					var rowData = $('#jqGrid1').jqGrid('getRowData', idsLen);
					rowData.GROUP_CD        = obj.__group_cd.toUpperCase(); 
					rowData.GROUP_NM        = obj.__group_nm; 
					rowData.USE_YN        = obj.__use_yn; 
					$('#jqGrid1').jqGrid('setRowData',idsLen, rowData)						
				} 
				//$('#btnQuery').click();
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
		$("#SetTableForm").submit() ;
	});
	
	function loadInfo1(rowId, currentRow, currentPage) { // table_id, table_cd, table_nm, save_preq_cd, save_preq, description, use_yn) {
		
		var selectdRow = $("#jqGrid1").jqGrid('getRowData', rowId);
	
		$('#ROWID1').val(rowId);
		
        $('#F_GROUP_CD'   ).val(selectdRow.GROUP_CD);
        $('#F_GROUP_NM'   ).val(selectdRow.GROUP_NM);
		$('input[name="F_USE_YN"]').val([selectdRow.USE_YN]);
		$('#CRUD1').val("U")

        $('#F_DETAIL_CD'   ).val("");
        $('#F_DETAIL_NM'   ).val("");
		$('input[name="F_USE_SUB_YN"]').val(["Y"]);

		$('#F_DETAIL_CD').attr("readonly", false ); //설정
	    $('#F_GROUP_CD' ).attr("readonly", true ); //설정	    
		$('#CRUD2').val("CD")
	    
	    var Obj = new Object();
		
		Obj.__group_cd = selectdRow.GROUP_CD;
		Obj.__rows     = "20";
		Obj.__page     = "1" ;
		Obj.__crud     = "RD";
		
		
       var columns = [
	   		{name:'GROUP_ID'	, width: 150, align:'center', hidden: true},	
	   		{name:'DETAIL_CD'	, width: 150, align:'center'},	
	   		{name:'DETAIL_NM'	, width: 150, align:'center'},	
	   		{name:'USE_YN'		, width: 150, align:'center'} 	
	   	];

		// 초기화
		$("#tableDivID2").replaceWith(function () {
			  return "<div id='tableDivID2'><table id='jqGrid2'></table><div id='jqGridPager2'></div></div>";
		});		
		
		$("#jqGrid2").jqGrid({
	        url:"GetCodeManager",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		if(data.records == undefined) {
		   			recCount = 0;
		   		} else {
		   			recCount = data.records;
		   		};
//				console.log( "recCount:" + recCount );
		   	},
		   	colNames:['ID','코드','코드명','사용'],
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
			     
//				    console.log("curPage:"+curPage + " " + "pageSize:"+pageSize + " " + "curRowNum:"+curRowNum + " " );
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
		
	};	
	
	function loadInfo2(rowId, currentRow, currentPage) { 
		
		var selectdRow = $("#jqGrid2").jqGrid('getRowData', rowId);

		$('#ROWID2').val(rowId);
		
        $('#F_DETAIL_CD'   ).val(selectdRow.DETAIL_CD);
        $('#F_DETAIL_NM'   ).val(selectdRow.DETAIL_NM);
        $('input[name="F_USE_SUB_YN"]').val([selectdRow.USE_YN]);        
        $('#F_DETAIL_CD'   ).attr("readonly", true ); //설정								
        $('#CRUD2'   ).val("UD");
      
	};	
	
	$('#btnAttrAdd').on( 'click', function () {
		
        $('#F_DETAIL_CD'   ).val("");
        $('#F_DETAIL_NM'   ).val("");
        $('input[name="F_USE_SUB_YN"]').val(["Y"]);        
	    $('#F_GROUP_CD' ).attr("readonly", true ); //설정
	    $('#F_DETAIL_CD').attr("readonly", false); //설정	
        $('#CRUD2'   ).val("CD");
        
	 });
	
	$('#btnAttrDel').click(function (e) {
		var formData = new FormData();

		var inputString = confirm('삭제후 복구 할수 없습니다.\n 삭제 하시겠습니까?');

		if(inputString == false){
			return;
		}
		
		var obj = new Object();
		obj.__group_cd    = $("input#F_GROUP_CD").val();
		obj.__detail_cd   = $("input#F_DETAIL_CD").val();
		obj.__detail_nm   = $("input#F_DETAIL_NM").val().toUpperCase();
		obj.__use_yn      = "N";
		obj.__crud        = "DD";
		
//		console.log('__group_cd  :'+ obj.__group_cd +']'); 
//		console.log('__detail_cd :'+ obj.__detail_cd); 
//		console.log('__detail_nm :'+ obj.__detail_nm); 
//		console.log('__use_yn    :'+ obj.__use_yn   ); 
//		console.log('crud        :'+ obj.__crud       ); 
		
		if($.trim(obj.__group_cd) == '' ){
			alert("[알림] 그릅코드1를 먼저 선택하세요");
			$("input#F_GROUP_CD").focus();
		    return;
		}

		 if($.trim(obj.__detail_cd) == ''){
			alert("[알림] 코드를 입력하세요.");
			$("input#F_DETAIL_ID").focus();
		    return;
		}
		
		$("#SetATTRForm").ajaxForm({
			url : 'SetCodeManager',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
//					console.log('grid update.........');
				var rowData = $('#jqGrid2').jqGrid('getRowData', $('#ROWID2').val());
				$("#jqGrid2").jqGrid('delRowData', $('#ROWID2').val());
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

	$('#btnAttrSave').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.__group_cd    = $("input#F_GROUP_CD").val();
		obj.__detail_cd   = $("input#F_DETAIL_CD").val();
		obj.__detail_nm   = $("input#F_DETAIL_NM").val().toUpperCase();
		obj.__use_yn      = $('input[name="F_USE_SUB_YN"]:checked').val()
		obj.__crud        = $("input#CRUD2").val();
		
//		console.log('__group_cd  :'+ obj.__group_cd +']'); 
//		console.log('__detail_cd :'+ obj.__detail_cd); 
//		console.log('__detail_nm :'+ obj.__detail_nm); 
//		console.log('__use_yn    :'+ obj.__use_yn   ); 
//		console.log('crud        :'+ obj.__crud       ); 
		
		if($.trim(obj.__group_cd) == '' ){
			alert("[알림] 그릅코드1를 먼저 선택하세요");
			$("input#F_GROUP_CD").focus();
		    return;
		}

		 if($.trim(obj.__detail_cd) == ''){
			alert("[알림] 코드를 입력하세요.");
			$("input#F_DETAIL_ID").focus();
		    return;
		}
		
		if($.trim(obj.__detail_nm) == ''){
			alert("[알림] 코드명을 입력하세요.");
			$("input#F_DETAIL_NM").focus();
		    return;
		}

		$("#SetATTRForm").ajaxForm({
			url : 'SetCodeManager',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
//				console.log(json_data);
				if (json_data.result == "OK" ) {		
					if (obj.__crud == "UD" ) {		
//						console.log('grid update.........');
						var rowData = $('#jqGrid2').jqGrid('getRowData', $('#ROWID2').val());
						rowData.GROUP_CD	= obj.__group_id; 
						rowData.DETAIL_CD	= obj.__detail_cd; 
						rowData.DETAIL_NM	= obj.__detail_nm; 
						rowData.USE_YN	= obj.__use_yn; 
						$('#jqGrid2').jqGrid('setRowData', $('#ROWID2').val(), rowData)
					} else {
//						console.log('grid append.........');
						var ids = $('#jqGrid2').getDataIDs();
						var idsLen = ids.length + 1;
						$('#jqGrid2').jqGrid('addRowData',idsLen,{});	
						var ids2 = $('#jqGrid2').getDataIDs();
						var rowData = $('#jqGrid2').jqGrid('getRowData', idsLen);
						rowData.GROUP_CD	= obj.__group_id; 
						rowData.DETAIL_CD	= obj.__detail_cd.toUpperCase(); 
						rowData.DETAIL_NM	= obj.__detail_nm; 
						rowData.USE_YN	= obj.__use_yn; 
				        recCount = recCount + 1;
	
						$('#jqGrid2').jqGrid('setRowData',idsLen, rowData)						
					}
					alert("정상적으로 처리 되었습니다.");
				} else {
					alert("처리중 오류발생:\n" + json_data.msg );
				}
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
		
	
	refreshData();
	
	$("#searchVal").focus();

});
