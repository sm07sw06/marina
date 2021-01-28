$(document).ready(function() {
	

	function refreshData()  
	{
		var Obj = new Object();
		
		Obj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		Obj.__gb       = 'A';
		Obj.__table_id = '*';
		Obj.__table_nm =  $('#C_TABLE_NM').val();
		Obj.__rows     = "20";
		Obj.__page     = "1" ;
		Obj.__server_id = '*';
		Obj.__server_nm = '*';
		

		
		$('#CRUD1').val("U")
		
       var columns = [
	   		{name:'TABLE_ID'    , width:  50},
	   		{name:'TABLE_CD'    , width: 100},		
	   		{name:'TABLE_NM'    , width: 100},		
	   		{name:'SAVE_PREQ_CD', width:  50, align:'center', hidden: true},		
	   		{name:'SAVE_PREQ_NM', width:  50, align:'center', hidden: true},		
	   		{name:'SAVE_PREQ'   , width:  50, align:'center', hidden: true},		
	   		{name:'DESCRIPTION' , width: 100, hidden: true},		
	   		{name:'USE_YN'      , width:  50, 
	   			edittype:  'select', 
                formatter: 'select',
                align:     'center',
                editable:true,                
                editoptions:{value: getUseSelectOptions()}
	   		},
	   		{name:'SERVER_ID'    , width: 100, hidden:true},		
	   		{name:'SERVER_NM'    , width: 100},	
	   		{name:'EXP_PATH'    , width: 100},	
	   		{name:'EXP_ZIP_YN'    , width: 100}	
	   		
	   	];
		
		$("#jqGrid1").jqGrid({
	        url:"GetTableList",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		console.log(data.rows[0]);
		   		loadInfo1(1, 20 , 1);
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['ID', '영문명','이름','주기코드','주기','주기값','설명', '사용','SID','서버이름','exp_path','zip_yn'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager1",
            height: 370,
            rowNum: 16,
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
		$('#F_TABLE_ID'   ).val("");
		$('#F_TABLE_CD'   ).val("");
		$('#F_TABLE_NM'   ).val("");
		$('#F_SAVE_PREQ'  ).val("");
		$('#F_DESCRIPTION').val("");
		$('input[name="F_USE_YN"]').val(["Y"]);
//		getAllSelectOptions("F_SAVE_PREQ_CD","SAVE_PREQ_CD","");
		$('#F_SAVE_PREQ_CD').val("");
		$('#F_SAVE_PREQ_CD option:eq(0)').prop("selected", true);
		$('#CRUD1'         ).val("C");
		$('#F_TABLE_ID'   ).attr("readonly", false); //설정
		$('#F_SERVER_ID').val("");
		$('#F_SERVER_NM').val("");
		$('#F_EXP_PATH').val("");
		$('input[name="F_EXP_ZIP_YN"]').val(["Y"]);
		
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.table_id   = $("input#F_TABLE_ID").val();
		obj.crud        = "D";
		
		console.log('F_TABLE_ID:'+ obj.table_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetTableForm").ajaxForm({
			url : 'SetTable',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				$('#F_TABLE_ID'   ).val("");
				$('#F_TABLE_CD'   ).val("");
				$('#F_TABLE_NM'   ).val("");
				$('#F_SAVE_PREQ'  ).val("");
				$('#F_DESCRIPTION').val("");
				$('#F_USE_YN'     ).val("");
				$('#F_SAVE_PREQ_CD').val("");
				//getJson("F_SAVE_PREQ_CD","SAVE_PREQ_CD",json_data.data[0].SAVE_PREQ_CD);
				$('#CRUD'         ).val("C");
				$('#F_SERVER_ID').val("");
				$('#F_SERVER_NM').val("");
				$('#F_TABLE_ID'   ).attr("readonly", false); //설정	
				$('#F_EXP_PATH').val("");
				$('#F_EXP_ZIP_YN').val("");
				
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
		obj.table_id     = $("input#F_TABLE_ID").val();
		obj.table_cd     = $("input#F_TABLE_CD").val();
		obj.table_nm     = $("input#F_TABLE_NM").val();
		obj.save_preq_cd = $("select#F_SAVE_PREQ_CD").val();
		obj.save_preq_nm = $('select#F_SAVE_PREQ_CD option:selected').text();
		obj.save_preq    = $("input#F_SAVE_PREQ").val();
		obj.description  = $("textarea#F_DESCRIPTION").val();
		obj.use_yn       = $('input[name="F_USE_YN"]:checked').val()
		obj.crud         = $("input#CRUD1").val();
		obj.server_id    = $("select#F_SERVER_ID").val();
		obj.server_nm    = $("#F_SERVER_ID option:selected").text();
		obj.exp_path     = $("input#F_EXP_PATH").val();
		obj.exp_zip_yn   = $('input[name="F_EXP_ZIP_YN"]:checked').val()
				
		
		console.log('sCrud:'+ obj.crud);
		console.log('F_TABLE_ID:'+ obj.table_id); 
		console.log('F_TABLE_CD:'+ obj.table_cd); 
		console.log('F_TABLE_NM:'+ obj.table_nm); 
		console.log('F_SAVE_PREQ_CD:'+ obj.save_preq_cd); 
		console.log('F_SAVE_PREQ_NM:'+ obj.save_preq_nm); 
		console.log('F_SAVE_PREQ:'+ obj.save_preq); 
		console.log('F_DESCRIPTION:'+ obj.description); 
		console.log('F_USE_YN:'+ obj.use_yn); 
		console.log('CRUD:'+ obj.crud); 
		console.log('F_SERVER_ID:'+ obj.server_id); 
		console.log('F_SERVER_NM:'+ obj.server_nm); 
		console.log('F_EXP_PATH:'+ obj.exp_path); 
		console.log('F_EXP_ZIP_YN:'+ obj.exp_zip_yn); 
				
		if(obj.server_nm == ''){
			alert("[알림] 서버를 먼저 선택하세요");
			$("input#F_SERVER_ID").focus();
		    return;
		}		
		
		if(obj.table_cd == ''){
			alert("[알림] 테이블 영문명을 입력하세요.");
			$("input#F_TABLE_CD").focus();
		    return;
		}

		if(obj.table_nm == ''){
			alert("[알림] 테이블 한글명을 입력하세요.");
			$("input#F_TABLE_NM").focus();
		    return;
		}

		$("#SetTableForm").ajaxForm({
			url : 'SetTable',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
 				if (obj.crud == "U" ) {		
					console.log('grid update.........');
					var rowData = $('#jqGrid1').jqGrid('getRowData', $('#ROWID1').val());
					rowData.TABLE_ID= obj.table_id; 
					rowData.TABLE_CD= obj.table_cd; 
					rowData.TABLE_NM= obj.table_nm; 
					rowData.SAVE_PREQ_CD= obj.save_preq_cd; 
					rowData.SAVE_PREQ_NM= obj.save_preq_nm; 
					rowData.SAVE_PREQ= obj.save_preq; 
					rowData.DESCRIPTION= obj.description; 
					rowData.USE_YN= obj.use_yn; 
					rowData.SERVER_ID= obj.server_id; 
					rowData.SERVER_NM= obj.server_nm; 
					rowData.EXP_PATH= obj.exp_path; 
					rowData.EXP_ZIP_YN= obj.exp_zip_yn; 
					

					$('#jqGrid1').jqGrid('setRowData', $('#ROWID1').val(), rowData)
				} else {
					console.log('grid append.........');
					var ids = $('#jqGrid1').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid1').jqGrid('addRowData',idsLen,{});	
					var rowData = $('#jqGrid1').jqGrid('getRowData', idsLen);
					rowData.TABLE_ID   = json_data.genKey;
					rowData.TABLE_CD= obj.table_cd; 
					rowData.TABLE_NM= obj.table_nm; 
					rowData.SAVE_PREQ_CD= obj.save_preq_cd; 
					rowData.SAVE_PREQ_NM= obj.save_preq_nm; 
					rowData.SAVE_PREQ= obj.save_preq; 
					rowData.DESCRIPTION= obj.description; 
					rowData.USE_YN= obj.use_yn; 
					rowData.SERVER_ID= obj.server_id; 
					rowData.SERVER_NM= obj.server_nm; 
					rowData.EXP_PATH= obj.exp_path; 
					rowData.EXP_ZIP_YN= obj.exp_zip_yn;					
					
					$('#jqGrid1').jqGrid('setRowData',idsLen, rowData)						
				} 
//				$('#btnQuery').click();
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
		
		console.log( "rowId:" + rowId);
		console.log( "reload:" + rowId);
		
		var selectdRow = $("#jqGrid1").jqGrid('getRowData', rowId);

		$('#ROWID1').val(rowId);
		
        $('#F_TABLE_ID'   ).val(selectdRow.TABLE_ID);
        $('#F_TABLE_CD'   ).val(selectdRow.TABLE_CD);
        $('#F_TABLE_NM'   ).val(selectdRow.TABLE_NM);
//        getAllSelectOptions("F_SAVE_PREQ_CD","SAVE_PREQ_CD",selectdRow.SAVE_PREQ_CD);        
        $('#F_SAVE_PREQ_CD'   ).val(selectdRow.SAVE_PREQ_CD);
        $('#F_SAVE_PREQ_NM' ).val(selectdRow.SAVE_PREQ_NM);
        $('#F_SAVE_PREQ'  ).val(selectdRow.SAVE_PREQ);
        $('#F_DESCRIPTION').val(selectdRow.DESCRIPTION);
        $('input[name="F_USE_YN"]').val([selectdRow.USE_YN]);
        $('#F_TABLE_ID'   ).attr("readonly", true ); //설정								
        
		$('#F_ATTR_CD'   ).val("");
		$('#F_ATTR_NM'   ).val("");
//		getAllSelectOptions("F_ATTR_TYPE_CD","ATTR_TYPE_CD","");   
		$('#F_ATTR_TYPE_CD'   ).val("");
		$('#F_ATTR_SIZE'  ).val("");
		$('#F_DECIMAL_SIZE'  ).val("0");
	    $('#F_ATTR_CD'   ).attr("readonly", false ); //설정
        $('#CRUD2').val("AC");
  
        $('#F_SERVER_ID'   ).val(selectdRow.SERVER_ID);
//        $('#F_SERVER_NM'   ).val(selectdRow.SERVER_NM);
        $('#F_SERVER_ID'   ).val(selectdRow.SERVER_ID);
        $('#F_EXP_PATH'   ).val(selectdRow.EXP_PATH);
        $('input[name="F_EXP_ZIP_YN"]').val([selectdRow.EXP_ZIP_YN]);
        
       

		jsonObj = new Object();
		
		jsonObj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		jsonObj.__gb        = "C" ;
		jsonObj.__table_id  = selectdRow.TABLE_ID;
		jsonObj.__table_nm  = "*" ;
		jsonObj.__rows      = "20";
		jsonObj.__page      = "1" ;
		jsonObj.__server_id = selectdRow.SERVER_ID;
		//jsonObj.__server_nm = selectedRow.SERVER_NM;
		
		$('#CRUD1').val("U")
		
       var columns = [
	   		{name:'TABLE_ID'    , width: 50, hidden: true},
	   		{name:'ATTR_CD'     , width:100},		
	   		{name:'ATTR_NM'     , width:100},		
	   		{name:'ATTR_TYPE_CD', width: 50, align:'center', hidden: true},		
	   		{name:'ATTR_TYPE_NM', width: 50, align:'center'},		
	   		{name:'ATTR_SIZE'   , width: 50, align:'center'},		
	   		{name:'DECIMAL_SIZE', width: 50, align:'center'},		
	   		{name:'ATTR_NULL_YN', width: 50, 
	   			edittype: 'select', 
                formatter: 'select',
                align:'center',
                editable:true,                
                editoptions:{value: getUseSelectOptions()}
	   		}	   		
	   	];

		// 초기화
		$("#tableDivID2").replaceWith(function () {
			  return "<div id='tableDivID2'><table id='jqGrid2'></table><div id='jqGridPager2'></div></div>";
		});		
		
		$("#jqGrid2").jqGrid({
	        url:"GetTableList",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(jsonObj)},
		   	loadComplete : function (data) {
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['ID', '코드','컬럼명','타입','타입','길이','소수', 'NULL'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager2",
            height: 400,
            rowNum: 20,
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
		
	};	
	
	function loadInfo2(rowId, currentRow, currentPage) { // table_id, table_cd, table_nm, save_preq_cd, save_preq, description, use_yn) {
		
		var selectdRow = $("#jqGrid2").jqGrid('getRowData', rowId);

		console.log( "rowId:" + rowId + "::" + selectdRow.ATTR_NULL_YN);

		$('#ROWID2').val(rowId);
		
        $('#F_ATTR_CD'   ).val(selectdRow.ATTR_CD);
        $('#F_ATTR_NM'   ).val(selectdRow.ATTR_NM);
//        getAllSelectOptions("F_ATTR_TYPE_CD","ATTR_TYPE_CD",selectdRow.ATTR_TYPE_CD);        
        $('#F_ATTR_TYPE_CD'   ).val(selectdRow.ATTR_TYPE_CD);
        $('#F_ATTR_TYPE_NM' ).val(selectdRow.ATTR_TYPE_NM);
        $('input[name="F_ATTR_NULL_YN"]').val([selectdRow.ATTR_NULL_YN]);        
        $('#F_ATTR_SIZE').val(selectdRow.ATTR_SIZE);
        $('#F_DECIMAL_SIZE').val(selectdRow.DECIMAL_SIZE);
        $('#F_TABLE_ID'   ).attr("readonly", true ); //설정								
        $('#F_ATTR_CD'    ).attr("readonly", true ); //설정								
        $('#CRUD2'   ).val("AU");
      
	};	
	
	$('#btnAttrAdd').on( 'click', function () {
		$('#F_ATTR_CD'   ).val("");
		$('#F_ATTR_NM'   ).val("");
//		getAllSelectOptions("F_ATTR_TYPE_CD","ATTR_TYPE_CD","");   
		$('#F_ATTR_TYPE_CD'   ).val("");
		$('#F_ATTR_TYPE_CD option:eq(0)').prop("selected", true);
		$('#F_ATTR_SIZE'  ).val("");
		$('#F_DECIMAL_SIZE'  ).val("0");
	    $('#F_ATTR_CD'   ).attr("readonly", false ); //설정
        $('#CRUD2'   ).val("AC");
	 });

	
	$('#btnAttrDel').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.table_id     = $("input#F_TABLE_ID").val();
		obj.attr_cd      = $("input#F_ATTR_CD").val();
		obj.crud         = "AD";
		
		console.log('sCrud:'+ obj.crud);
		console.log('F_TABLE_ID:'+ obj.table_id); 
		console.log('F_ATTR_CD:'+ obj.attr_cd); 
		
		if(obj.table_id == ''){
			alert("[알림] 테이블을 먼저 선택하세요");
			$("input#F_ATTR_CD").focus();
		    return;
		}

		$("#SetATTRForm").ajaxForm({
			url : 'SetTable',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				$('#F_ATTR_CD').val("");
				$('#F_ATTR_NM').val("");
				$('#F_ATTR_SIZE').val("");
				$('#F_DECIMAL_SIZE').val("");
				$('#F_ATTR_TYPE_CD').val("");
				$('#F_ATTR_NULL_YN').val("");
				$('#CRUD2').val("AC");
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
		obj.table_id     = $("input#F_TABLE_ID").val();
		obj.attr_cd      = $("input#F_ATTR_CD").val();
		obj.attr_nm      = $("input#F_ATTR_NM").val();
		obj.attr_size    = $("input#F_ATTR_SIZE").val();
		obj.decimal_size = $("input#F_DECIMAL_SIZE").val();
		obj.attr_type_cd = $("select#F_ATTR_TYPE_CD").val();
		obj.attr_type_nm = $('select#F_ATTR_TYPE_CD option:selected').text();
		obj.attr_null_yn = $('input[name="F_ATTR_NULL_YN"]:checked').val()
		obj.use_yn       = $('input[name="F_USE_YN"]:checked').val()		
		obj.crud         = $("input#CRUD2").val();
		
		
		console.log('sCrud:'+ obj.crud2);
		console.log('F_TABLE_ID:'+ obj.table_id); 
		console.log('F_ATTR_CD:'+ obj.attr_cd); 
		console.log('F_ATTR_NM:'+ obj.attr_nm); 
		console.log('F_ATTR_SIZE:'+ obj.attr_size); 
		console.log('F_DECIMAL_SIZE:'+ obj.decimal_size); 
		console.log('F_ATTR_TYPE_CD:'+ obj.attr_type_cd); 
		console.log('F_ATTR_TYPE_NM:'+ obj.attr_type_nm); 
		console.log('F_USE_YN:'+ obj.attr_use_yn); 
		console.log('F_ATTR_NULL_YN:'+ obj.attr_null_yn); 

		
		if(obj.table_id == ''){
			alert("[알림] 테이블을 먼저 선택하세요");
			$("input#F_ATTR_CD").focus();
		    return;
		}	
		
		if(obj.table_id == ''){
			alert("[알림] 테이블을 먼저 선택하세요");
			$("input#F_ATTR_CD").focus();
		    return;
		}

		if(obj.attr_nm == ''){
			alert("[알림] 컬럼명을 입력하세요.");
			$("input#F_ATTR_NM").focus();
		    return;
		}

		if(Number(obj.attr_size) <= 0){
			alert("[알림] 길이가 너무 작습니다.");
			$("input#F_ATTR_SIZE").focus();
		    return;
		}

		if(Number(obj.attr_size) > 999){
			alert("[알림] 길이가 너무 큽니다.");
			$("input#F_ATTR_SIZE").focus();
		    return;
		}

		if(Number(obj.decimal_size) < 0){
			alert("[알림] 소수자리가 너무 작습니다.");
			$("input#F_DECIMAL_SIZE").focus();
		    return;
		}

		if(Number(obj.decimal_size) > 999){
			alert("[알림] 소수자리가 너무 큽니다.");
			$("input#F_DECIMAL_SIZE").focus();
		    return;
		}


		$("#SetATTRForm").ajaxForm({
			url : 'SetTable',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				if (obj.crud == "AU" ) {		
					console.log('grid update.........');
					var rowData = $('#jqGrid2').jqGrid('getRowData', $('#ROWID2').val());
					rowData.ATTR_CD= obj.attr_cd; 
					rowData.ATTR_NM= obj.attr_nm; 
					rowData.ATTR_SIZE= obj.attr_size; 
					rowData.DECIMAL_SIZE= obj.decimal_size; 
					rowData.ATTR_TYPE_CD= obj.attr_type_cd; 
					rowData.ATTR_TYPE_NM= obj.attr_type_nm; 
					rowData.ATTR_NULL_YN= obj.attr_null_yn; 
					$('#jqGrid2').jqGrid('setRowData', $('#ROWID2').val(), rowData)
				} else {
					console.log('grid append.........');
					var ids = $('#jqGrid2').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid2').jqGrid('addRowData',idsLen,{});	
					var ids2 = $('#jqGrid2').getDataIDs();
					var rowData = $('#jqGrid2').jqGrid('getRowData', idsLen);
					rowData.ATTR_CD= obj.attr_cd; 
					rowData.ATTR_NM= obj.attr_nm; 
					rowData.ATTR_SIZE= obj.attr_size; 
					rowData.DECIMAL_SIZE= obj.decimal_size; 
					rowData.ATTR_TYPE_CD= obj.attr_type_cd; 
					rowData.ATTR_TYPE_NM= obj.attr_type_nm; 
					rowData.ATTR_NULL_YN= obj.attr_null_yn; 
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

   			console.log((index+1) + "::" + rowNum + "::" + rowData.ATTR_NM);
   			
   			var obj = new Object();
   			obj.table_id = $("input#F_TABLE_ID").val();
   			obj.attr_cd  = rowData.ATTR_CD ;   			
   			obj.attr_seq = rowNum + "";  
   			obj.crud     = "RN";  //renumbering

   			console.log(JSON.stringify(obj));
   			
   			$("#SetATTRForm").ajaxForm({
   				url : 'SetTable',
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
	
	$('input[name="C_USE_YN"]').val(["Y"]);
	//refreshData();
	$('#btnQuery').click();
	
	$("#searchVal").focus();

});
