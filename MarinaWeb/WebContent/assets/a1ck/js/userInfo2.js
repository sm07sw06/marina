$(document).ready(function() {
	

	function refreshData()  
	{
		var Obj = new Object();

		Obj.__user_cd = '*';
		Obj.__user_nm =  $('#C_USER_NM').val();
		Obj.__rows     = "20";
		Obj.__page     = "1" ;

		$('#CRUD').val("U")

		console.log("__user_cd:"+Obj.__user_cd)
		console.log("__user_nm:"+Obj.__user_nm)

        $('#F_USER_ID'  ).val("");
        $('#F_USER_CD'  ).val("");
        $('#F_USER_NM'  ).val("");
        $('#F_TELEPHONE').val("");
        $('#F_EMAIL'    ).val("");
        $('#F_PASSWORD' ).val("");
        $('#F_PASSWORDORG').val("XXXXX");
        $('#F_USER_ID'  ).val("");
        $('#F_APPROWAITCNT').val("");
        $('input[name="F_USE_YN"]').val(["Y"]);        
        $('#CRUD'     ).val("U");
        $('#F_USER_CD'  ).attr("readonly", true ); //설정
        
		var columns1 = [
				{name:'USER_CD'     , width: 100 },
				{name:'USER_NM'     , width: 100 },		
				{name:'TELEPHONE'   , width: 100 },		
				{name:'PASSWORD'    , width: 100 ,hidden: true},		
				{name:'PASSWORDORG' , width: 100 ,hidden: true},		
				{name:'EMAIL'       , width: 100 },		
				{name:'USER_ID'     , width: 100 ,hidden: true},		
				{name:'APPROWAITCNT', width: 100 ,hidden: true},		
		   		{name:'USE_YN'     , width:  50, 
		   			edittype: 'select', 
	                formatter: 'select',
	                align:'center',
	                editable:true,                
	                editoptions:{value: getUseSelectOptions()}
		   		},		
				{name:'PICTURE', width: 100 ,hidden: true}		
			];

		$("#jqGrid").jqGrid({
			url:"GetUserList",
			datatype: 'json',
			mtype: 'POST',
			postData : {param:JSON.stringify(Obj)},
			loadComplete : function (data) {
				$.each(data, function(index, value) {
					if(index == "total") {
					}
				});
			},
			colNames:['사용자번호', '이름', '연락처', '비밀번호','비밀번호원본', '이메일', '아이디', '메세지수','사용여부','사진'],
			hoverrows : false,
			Regional:'ko',
			pager: "#jqGridPager",
			height: 400,
			rowNum: 20,
			viewrecords: true, // show the current page, data rang and total records on the toolbar
			autowidth : true,
			pageModel: { type: 'local', rPP: 20, rPPOptions: [1, 10, 20, 30, 40, 50, 100] },
			scrollModel: { lastColumn: null },
			colModel: columns1,
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

    $('#btnQuery').click(function (e) {
		$("#userDivID").replaceWith(function () {
			  return "<div id= 'userDivID'><table id='jqGrid'></table><div id='jqGridPager'></div></div>";
		});
		refreshData();	
	});

	$('#btnAdd').click(function (e) {
        $('#F_USER_ID'  ).val("");
        $('#F_USER_CD'  ).val("");
        $('#F_USER_NM'  ).val("");
        $('#F_TELEPHONE').val("");
        $('#F_PASSWORD' ).val("");
        $('#F_PASSWORDORG').val("XXXXX");
        $('#F_EMAIL'  ).val("");
        $('#F_APPROWAITCNT').val("");
        $('input[name="F_USE_YN"]').val(["Y"]);        
        $('#CRUD'     ).val("C");
        $('#F_USER_CD'  ).attr("readonly", false ); //설정
        $('#F_PICTURE'  ).attr("src", "assets/images/200x150.png" ); //설정	
        
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();

		$('#CRUD'     ).val("D");
		
		var obj = new Object();
		obj.user_id     = $("input#F_USER_ID").val();
		obj.user_nm     = $("input#F_USER_NM").val();

		if(obj.user_id == ''){
			alert("[알림] 삭제할 사용자를 선택하세요");
		    return;
		}

		var input = confirm('사용자 ['+ obj.user_nm + ']를 삭제시 복구가 불가능 합니다. 삭제하시겠습니까?');
		if (!input) return;
		
		
		$("#SetUserForm").ajaxForm({
			url : 'SetUser',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
		        $('#F_USER_CD'  ).val("");
		        $('#F_USER_NM'  ).val("");
		        $('#F_TELEPHONE').val("");
		        $('#F_EMAIL'    ).val("");
		        $('#F_PASSWORD' ).val("");
		        $('#F_PASSWORDORG').val("XXXXX");
		        $('#F_USER_ID'  ).val("");
		        $('#F_APPROWAITCNT').val("");
		        $('#CRUD'     ).val("C");
		        $('#F_USER_CD'  ).attr("readonly", true ); //설정	
		        $('#F_PICTURE'  ).attr("src", "assets/images/200x150.png" ); //설정	

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
		$("#SetUserForm").submit() ;
	});

	
	$('#btnSave').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.user_cd     = $("input#F_USER_CD").val();
		obj.user_nm     = $("input#F_USER_NM").val();
		obj.password    = $("input#F_PASSWORD").val();
		
		if(obj.user_cd == ''){
			alert("[알림] 사용자ID를 입력하세요.");
			$("input#F_USER_CD").focus();
		    return;
		}

		if(obj.user_nm == ''){
			alert("[알림] 사용자이름을 입력하세요.");
			$("input#F_USER_NM").focus();
		    return;
		}

		if(obj.password == ''){
			alert("[알림] 비밀번호를  입력하세요.");
			$("input#F_PASSWORD").focus();
		    return;
		}

		$("#SetUserForm").ajaxForm({
			url : 'SetUser',
			dataType:'json',
			enctype : "multipart/form-data",
			type: 'post',
//			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
 				if (obj.crud == "U" ) {		
					console.log('grid update.........');
					var rowData = $('#jqGrid').jqGrid('getRowData', $('#ROWID').val());
					rowData.USER_ID= obj.user_id; 
					rowData.USER_CD= obj.user_cd; 
					rowData.USER_NM= obj.user_nm; 
					rowData.TELEPHONE= obj.telephone; 
					rowData.EMAIL= obj.email; 
					rowData.PASSWORD= obj.password; 
					rowData.APPROWAITCNT= obj.approwaitcnt; 
					rowData.USE_YN= obj.use_yn; 
					$('#jqGrid').jqGrid('setRowData', $('#ROWID').val(), rowData)
				} else {
					console.log('grid append.........');
					var ids = $('#jqGrid').getDataIDs();
					var idsLen = ids.length + 1;
					
					$('#jqGrid').jqGrid('addRowData',idsLen,{});	
					var ids2 = $('#jqGrid').getDataIDs();
					var rowData = $('#jqGrid').jqGrid('getRowData', idsLen);
					rowData.USER_ID = json_data.genKey;
					rowData.USER_CD= obj.user_cd; 
					rowData.USER_NM= obj.user_nm; 
					rowData.TELEPHONE= obj.telephone; 
					rowData.EMAIL= obj.email; 
					rowData.PASSWORD= obj.password; 
					rowData.APPROWAITCNT= obj.approwaitcnt; 
					rowData.USE_YN= obj.use_yn;
//					$('#F_PICTURE'  ).attr("src", "assets/images/200x150.png" ); //설정						
					$('#jqGrid').jqGrid('setRowData',idsLen, rowData)	
					
					$('#btnQuery').click();
				} 
			//	$('#btnQuery').click();
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
		$("#SetUserForm").submit() ;
	});


	function loadInfo(rowId, currentRow, currentPage) { // user_id, user_cd, user_nm, save_preq_cd, save_preq, description, use_yn) {
		
		var selectdRow = $("#jqGrid").jqGrid('getRowData', rowId);

		console.log( "rowId:" + rowId);

		$('#ROWID').val(rowId);
		
        $('#F_USER_CD'  ).val(selectdRow.USER_CD);
        $('#F_USER_NM'  ).val(selectdRow.USER_NM);
        $('#F_TELEPHONE').val(selectdRow.TELEPHONE);
        $('#F_EMAIL').val(selectdRow.EMAIL);
        $('#F_PASSWORD' ).val(selectdRow.PASSWORD);
        $('#F_PASSWORDORG').val(selectdRow.PASSWORDORG);
        $('#F_USER_ID'  ).val(selectdRow.USER_ID);
        $('#F_APPROWAITCNT').val(selectdRow.APPROWAITCNT);
		$('input[name="F_USE_YN"]').val([selectdRow.USE_YN]);
        $('#CRUD'     ).val("U");
        $('#F_USER_CD'  ).attr("readonly", true ); //설정		   
        
        console.log( "selectdRow.PICTURE:" + selectdRow.PICTURE.trim());
        
        if ( selectdRow.PICTURE.trim() == "" || selectdRow.PICTURE == 'null' ) { 
        	//console.log('111111');
        	$('#F_PICTURE').attr('src', "assets/images/" + "200x150.png");
        	$('.fileinput .fileinput-preview img').attr('src', "assets/images/" + "200x150.png");
        } else {
        	//console.log('222222');
        	$('#F_PICTURE').attr('src', "userImages/" + selectdRow.PICTURE);
        	$('.fileinput .fileinput-preview img').attr('src', "userImages/" + selectdRow.PICTURE);
        }
	};	
	
	refreshData();
	
	$("#searchVal").focus();

});
