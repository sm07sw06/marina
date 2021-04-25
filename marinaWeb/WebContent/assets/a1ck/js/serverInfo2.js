$(document).ready(function() {

	var jsonObj = new Object();
	
	function refreshData()  
	{
		console.log("refreshData.........");
		
		var Obj = new Object();
		
		Obj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		Obj.__server_id = "*" ;
		Obj.__rows      = "20";
		Obj.__page      = "1" ;

		$('#CRUD').val("U")
		
        var columns = [
	   		{name:'SERVER_ID'  , width: 100, hidden: true},
	   		{name:'SERVER_NM'  , width: 100},
	   		{name:'SERVER_CLASS_CD', width: 20, hidden: true},
	   		{name:'SERVER_CLASS_NM', width: 100},		
	   		{name:'SERVER_IP'  , width: 100},		
	   		{name:'USE_YN'     , width:  40, 
	   			edittype: 'select', 
                formatter: 'select',
                align:'center',
                editable:true,                
                editoptions:{value: getUseSelectOptions()}
	   		},
	   		{name:'SERVER_DESC', width: 100}		
	   	];
		
		$("#jqGrid").jqGrid({
	        url:"GetServerList",
	    	datatype: 'json',
	    	mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
		   	loadComplete : function (data) {
		   		$.each(data, function(index, value) {
		   			if(index == "total") {
		   			}
		   		});
		   	},
		   	colNames:['ID','이름', '분류코드','분류','IP','사용','설명'],
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

	 }

	function loadInfo(rowId, currentRow, currentPage) {
		
		var selectdRow = $("#jqGrid").jqGrid('getRowData', rowId);

		console.log(selectdRow);
		
		$('#ROWID').val(rowId);
		
		jsonObj = {};
		
		jsonObj.__use_yn    = $('input[name="C_USE_YN"]:checked').val();
		jsonObj.__server_id = selectdRow.SERVER_ID;
		jsonObj.__rows      = currentRow+"";
		jsonObj.__page      = currentPage+"" ;
		
		$.ajax({
		   	url:"GetServerList",
			data:{param:JSON.stringify(jsonObj)},
			type:"post",
		   	dataType:"json",
			success: function(json_data) {
	
		        if(json_data.result == 'OK') {

		    		console.log(json_data.rows[0].USE_YN);

			        $('#F_SERVER_ID').val(json_data.rows[0].SERVER_ID);
			        $('#F_SERVER_NM').val(json_data.rows[0].SERVER_NM);
			        $('#F_SERVER_IP').val(json_data.rows[0].SERVER_IP);
			        $('#F_SERVER_DESC' ).val(json_data.rows[0].SERVER_DESC);
			        $('#F_SERVER_CLASS_NM' ).val(json_data.rows[0].SERVER_CLASS_NM);
			        //getAllSelectOptions("F_SERVER_CLASS_CD","SERVER_CLASS_CD",json_data.rows[0].SERVER_CLASS_CD);
			        $('#F_SERVER_CLASS_CD' ).val(json_data.rows[0].SERVER_CLASS_CD);
		    		$('input[name="F_USE_YN"]').val([json_data.rows[0].USE_YN]);
		    		 $('#CRUD').val("U");
			        $('#F_SERVER_ID'    ).attr("readonly", true ); //설정
			        
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
		$('#F_SERVER_ID'  ).val("");
		$('#F_SERVER_NM'    ).val("");
		$('#F_SERVER_IP'    ).val("");
		$('#F_SERVER_DESC' ).val("");
		$('#F_SERVER_CLASS_CD').val("");
		$('input[name="F_USE_YN"]').val(["Y"]);
        //getAllSelectOptions("F_SERVER_CLASS_CD","SERVER_CLASS_CD","");
        //$('#F_SERVER_CLASS_CD' ).val("");
		$('#F_SERVER_CLASS_CD option:eq(0)').prop("selected", true);

		$('#CRUD'         ).val("C");
		$('#F_SERVER_ID'  ).attr("readonly", true); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.crud        = "D";
		
		console.log('F_SERVER_ID:'+ obj.server_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetServerForm").ajaxForm({
			url : 'SetServer',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				$('#F_SERVER_ID'  ).val("");
				$('#F_SERVER_NM'    ).val("");
				$('#F_SERVER_IP'    ).val("");
				$('#F_SERVER_DESC' ).val("");
				$('#F_SERVER_CLASS_CD option:eq(0)').prop("selected", true);
				$('input[name="F_USE_YN"]').val(["Y"]);
				$('#CRUD'         ).val("C");
				$('#F_SERVER_ID'  ).attr("readonly", true); //설정			
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
		$("#SetServerForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.server_nm   = $("input#F_SERVER_NM").val();
		obj.server_ip   = $("input#F_SERVER_IP").val();
		obj.server_desc = $("textarea#F_SERVER_DESC").val();
		obj.server_class_cd = $("select#F_SERVER_CLASS_CD").val();
		obj.server_class_nm = $('select#F_SERVER_CLASS_CD option:selected').text();
		obj.use_yn = $('input[name="F_USE_YN"]:checked').val()
		obj.crud        = $("input#CRUD").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('server_id:'+ obj.server_id); 
		console.log('server_nm:'+ obj.server_nm);
		console.log('server_ip:'+ obj.server_ip);
		console.log('server_desc:'+ obj.server_desc);
		console.log('server_class_cd:'+ obj.server_class_cd);
		console.log('server_class_nm:'+ obj.server_class_nm);
		console.log('use_yn:'+ obj.use_yn);
		
		if(obj.server_nm == ''){
			alert("[알림] 서버명을 입력하세요.");
			$("input#F_SERVER_NM").focus();
		    return;
		}

		$("#SetServerForm").ajaxForm({
			url : 'SetServer',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
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
		$("#SetServerForm").submit() ;
	});

	$('input[name="C_USE_YN"]').val(["Y"]);
	
	refreshData();
	
	$("#searchVal").focus();

});
