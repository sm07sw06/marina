$(document).ready(function() {
	
	function refreshData()  
	{
		
		console.log('..refreshData...............'+ $('#C_SERVER_ID').val());
		
		var Obj = new Object();
		
		Obj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		Obj.__server_id = $('#C_SERVER_ID').val();
		Obj.__work_cd   = "*";
		Obj.__rows      = "20";
		Obj.__page      = "1" ;		

		$("#jqGrid").jqGrid('clearGridData',true);
		
        var columns = [
	   		{name:'SERVER_ID'  , width: 100 , hidden: true},
	   		{name:'SERVER_NM'  , width: 100 , hidden: true},
	   		{name:'WORK_CD'    , width: 100},
	   		{name:'WORK_NM'    , width: 100},
	   		{name:'ACCOUNT_CD' , width: 100},
	   		{name:'USE_YN'     , width:  40, 
	   			edittype: 'select', 
                formatter: 'select',
                align:'center',
                editable:true,                
                editoptions:{value: getUseSelectOptions()}
	   		},	   		
	   		{name:'DESCRIPTION', width: 150}		
	   	];
		$("#jqGrid").jqGrid({
	        url:"GetWorkList",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['ID','서버이름', '업무코드', '업무명','계정','사용','설명'],
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
		});//.trigger("reloadGrid");
		jQuery("#jqGrid").jqGrid('navGrid','#jqGridPager',{edit:false,add:false,del:false});
	 }

	function loadInfo(rowId, currentRow, currentPage) {
		
		var selectdRow = $("#jqGrid").jqGrid('getRowData', rowId);

		console.log(selectdRow);
		
		$('#ROWID').val(rowId);
		
		jsonObj = {};
		
		jsonObj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		jsonObj.__server_id = selectdRow.SERVER_ID;
		jsonObj.__work_cd   = selectdRow.WORK_CD;
		jsonObj.__rows      = currentRow+"";
		jsonObj.__page      = currentPage+"" ;
		
		console.log(jsonObj.__server_id);
		console.log(jsonObj.__work_cd);
		
		$.ajax({
			url: 'GetWorkList',    
			data: {param:JSON.stringify(jsonObj)},
			type:"post",			
			dataType:"json",
			success: function(json_data) {
	
		        if(json_data.result == 'OK') {
			        $('#F_WORK_CD' ).val(json_data.rows[0].WORK_CD);
			        $('#F_WORK_NM' ).val(json_data.rows[0].WORK_NM);
			        $('#F_ACCOUNT_CD' ).val(json_data.rows[0].ACCOUNT_CD);
			        $('#F_DESCRIPTION' ).val(json_data.rows[0].DESCRIPTION);
			        $('#F_WORK_CD'    ).attr("readonly", true ); //설정
			        $('input[name="F_USE_YN"]').val([json_data.rows[0].USE_YN]);			        
			        $('#CRUD').val("U");
				} else {
					console.log(json_data.result); 
				}
			}
		});	
	};	
   
	$('#btnQuery').click(function (e) {
		
		console.log('..btnQuery..........'); 
		
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
//		$('#F_SERVER_NM'  ).val($('#C_SERVER_ID  option:selected').text());
		$('#F_WORK_CD'    ).val("");
		$('#F_WORK_NM'    ).val("");
		$('#F_ACCOUNT_CD' ).val("");
		$('#F_DESCRIPTION').val("");
		$('#CRUD'         ).val("C");
		$('#F_WORK_CD'    ).attr("readonly", false); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $('#C_SERVER_ID').val();
		obj.work_cd     = $("input#F_WORK_CD").val();
		obj.work_nm     = "";
		obj.account_cd  = "";
		obj.description = "";
		obj.crud        = "D";
		
		console.log('C_SERVER_ID:'+ obj.server_id);
		console.log('F_WORK_CD:'+ obj.work_cd);
		console.log('sCrud:'+ obj.crud);

		$("#SetWorkForm").ajaxForm({
			url : 'SetWork',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				//$('#btl02', parent.document).click();
				//$('#iframItemRange').reload();
				
				$('#F_WORK_CD'    ).val("");
				$('#F_WORK_NM'    ).val("");
				$('#F_ACCOUNT_CD' ).val("");
				$('#F_DESCRIPTION').val("");
				$('#CRUD'         ).val("C");
				$('#F_WORK_CD'    ).attr("readonly", false); //설정				
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
		$("#SetWorkForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $('#C_SERVER_ID').val();
		obj.server_nm   = $("input#F_SERVER_NM").val();
		obj.work_cd     = $("input#F_WORK_CD").val();
		obj.work_nm     = $("input#F_WORK_NM").val();
		obj.account_cd  = $("input#F_ACCOUNT_CD").val();
		obj.description = $("textarea#F_DESCRIPTION").val();
		obj.use_yn      = $('input[name="F_USE_YN"]:checked').val()
		obj.crud        = $("input#CRUD").val();
		
		console.log('crud:'+ obj.crud);
		console.log('server_id:'+ obj.server_id); 
		console.log('work_cd:'+ obj.work_cd);
		console.log('work_nm:'+ obj.work_nm);
		console.log('account_cd:'+ obj.account_cd);
		console.log('description:'+ obj.description);

		if (!IsAlphabet(obj.work_cd, 4 )) {
			alert("[알림] 업무코드는 영문 4자리로 입력하세요.");
			$("input#F_WORK_CD").focus();
		    return;			
		}
		
		if(obj.work_nm == ''){
			alert("[알림] 업무명을 입력하세요.");
			$("input#F_WORK_NM").focus();
		    return;
		}
		
		console.log('0000000000000');
		$("#SetWorkForm").ajaxForm({
			url : 'SetWork',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
/*				if (obj.crud == "U" ) {
					var rowData = $('#jqGrid').jqGrid('getRowData', $('#ROWID').val());
					rowData.SERVER_NM= obj.server_nm; 
					rowData.WORK_CD= obj.work_cd; 
					rowData.WORK_NM= obj.work_nm; 
					rowData.ACCOUNT_CD= obj.account_cd; 
					rowData.DESCRIPTION= obj.description; 
					$('#jqGrid').jqGrid('setRowData', $('#ROWID').val(), rowData)
				} else {
					var ids = $('#jqGrid').getDataIDs();
					var idsLen = ids.length + 1;
					$('#jqGrid').jqGrid('addRowData',idsLen,{});	
					var ids2 = $('#jqGrid').getDataIDs();
					var rowData = $('#jqGrid').jqGrid('getRowData', idsLen);
					rowData.SERVER_ID= obj.server_id; 
					rowData.SERVER_NM= obj.server_nm; 
					rowData.WORK_CD= obj.work_cd; 
					rowData.WORK_NM= obj.work_nm; 
					rowData.ACCOUNT_CD= obj.account_cd; 
					rowData.DESCRIPTION= obj.description; 
					$('#jqGrid').jqGrid('setRowData',idsLen, rowData)					
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
		$("#SetWorkForm").submit() ;
	});

// 	$.when(getServer($("#C_SERVER_ID"), '1')).done($('#btnQuery').click());
// 	$.when(getServer($("#C_SERVER_ID"), '1')).done( console.log('wwwwwwwww') );

	$('input[name="C_USE_YN"]').val(["Y"]);
	$('#F_WORK_CD').attr("readonly", false); //설정
	
	$('#btnQuery').click();
	 
	$("#searchVal").focus();

});
