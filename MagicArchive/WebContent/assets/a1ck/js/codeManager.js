	// ----------------------- 그리드 설정 시작 -------------------------------------

	// rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
	var jsVars  = "rMateOnLoadCallFunction=gridReadyHandler&assetsPath=./rMateGridH5/Assets/";
	var jsVars2 = "rMateOnLoadCallFunction=gridReadyHandler2&assetsPath=./rMateGridH5/Assets/";
	//rMateGrid 관련 객체
	var collection;	// 그리드의 데이터 객체
	var collection2;	// 그리드의 데이터 객체
	var cnt=0;
	var jsonObj = new Object();

	var gridData = [];
	
	// rMateDataGrid 를 생성합니다.
	// 파라메터 (순서대로)
	//  1. 그리드의 id ( 임의로 지정하십시오. )
	//  2. 그리드가 위치할 div 의 id (즉, 그리드의 부모 div 의 id 입니다.)
	//  3. 그리드 생성 시 필요한 환경 변수들의 묶음인 jsVars
	//  4. 그리드의 가로 사이즈 (생략 가능, 생략 시 100%)
	//  5. 그리드의 세로 사이즈 (생략 가능, 생략 시 100%)
	rMateGridH5.create("grid1", "gridHolder" , jsVars , "100%", "100%");
	rMateGridH5.create("grid2", "gridHolder2", jsVars2, "100%", "100%");

	// 그리드의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
	// rMate 그리드의 준비가 완료된 경우 이 함수가 호출됩니다.
	// 이 함수를 통해 그리드에 레이아웃과 데이터를 삽입합니다.
	// 파라메터 : id - rMateGridH5.create() 사용 시 사용자가 지정한 id 입니다.
	function gridReadyHandler(id) {
		console.log("@@@@ gridReadyHandler in......");
		// rMateGrid 관련 객체
		gridApp = document.getElementById(id);	// 그리드를 포함하는 div 객체
		gridRoot = gridApp.getRoot();	// 데이터와 그리드를 포함하는 객체

		gridApp.setLayout(layoutStr);
		gridApp.setData(gridData);

		var menuItemSelectedHandler = function(event) {
			console.log("menuItemSelectedHandler in......");
			contextMenuHandler(event.menuItemCaption);
		};
		
		var layoutCompleteHandler = function(event) {
			console.log("layoutCompleteHandler in......");
			dataGrid = gridRoot.getDataGrid();	// 그리드 객체
		}
		
		function contextMenuHandler(caption) {
			console.log("contextMenuHandler in......");
			dataGrid.setSelectedIndex(idx);
		    var idx = dataGrid.getSelectedIndex();
		    // 맨 위의 행이면 skip
		    if (idx <= 0)
		        return;
		 
		    var item = gridRoot.getItemAt(idx);
		    if (item) {
		        gridRoot.removeItemAt(idx);
		        gridRoot.addItemAt(item, idx-1, false);
		        setTimeout("setSelectedIndex("+(idx-1)+")", 100);
//		      dataGrid.setSelectedIndex(idx-1);
		    }

		    
			if (caption == "Insert Row") {
				var item =   { "Region": "NorthEast", "Territory": "NewYork", "Territory_Rep": "NY",	"Actual": 0, "Estimate": 0, "Real": 0, "Price": 0 };
				gridRoot.addItemAt(item, gridRoot.getLastRollOverIndex());
			} else if (caption == "Delete Row")
				gridRoot.removeItemAt(gridRoot.getLastRollOverIndex());
		}
		
		// 사용자가 import를 완료하면 불려집니다.
		var dataCompleteHandler = function() {
			console.log("dataCompleteHandler in......");
			collection = gridRoot.getCollection();
			gridMovePage(1);
		}

		refreshData();
		
		gridRoot.addEventListener("layoutComplete", layoutCompleteHandler);
		gridRoot.addEventListener("dataComplete", dataCompleteHandler);
		gridRoot.addEvent("dblclick", dblclickHandler);
		
	}
	
	function gridReadyHandler2(id) {
		console.log("@@@@ gridReadyHandler2 in......");		

		// rMateGrid 관련 객체
		gridApp2 = document.getElementById(id);	// 그리드를 포함하는 div 객체
		gridRoot2 = gridApp2.getRoot();	// 데이터와 그리드를 포함하는 객체

		gridApp2.setLayout(layoutStr2);
		gridApp2.setData(gridData);

		var menuItemSelectedHandler2 = function(event) {
			contextMenuHandler(event.menuItemCaption);
		};
		
		var layoutCompleteHandler2 = function(event) {
			dataGrid2 = gridRoot2.getDataGrid();	// 그리드 객체
		}
		
		function contextMenuHandler2(caption) {
			dataGrid2.setSelectedIndex(idx);
		    var idx = dataGrid2.getSelectedIndex();
		    // 맨 위의 행이면 skip
		    if (idx <= 0)
		        return;
		 
		    var item = gridRoot2.getItemAt(idx);
		    if (item) {
		        gridRoot2.removeItemAt(idx);
		        gridRoot2.addItemAt(item, idx-1, false);
		        setTimeout("setSelectedIndex("+(idx-1)+")", 100);
//		      dataGrid.setSelectedIndex(idx-1);
		    }

		    
			if (caption == "Insert Row") {
				var item =   { "Region": "NorthEast", "Territory": "NewYork", "Territory_Rep": "NY",	"Actual": 0, "Estimate": 0, "Real": 0, "Price": 0 };
				gridRoot2.addItemAt(item, gridRoot2.getLastRollOverIndex());
			} else if (caption == "Delete Row")
				gridRoot2.removeItemAt(gridRoot2.getLastRollOverIndex());
		}
		
		// 사용자가 import를 완료하면 불려집니다.
		var dataCompleteHandler2 = function() {
			console.log("dataCompleteHandler2 in......");			
			collection2 = gridRoot2.getCollection();
			gridMovePage2(1);
		}

		
		gridRoot2.addEventListener("layoutComplete", layoutCompleteHandler2);
		gridRoot2.addEventListener("dataComplete", dataCompleteHandler2);
		gridRoot2.addEvent("dblclick", dblclickHandler2);
		
	}	

	var gridApp, gridRoot;	// 데이터와 그리드를 포함하는 객체
	var dataGrid;	// 그리드

	var gridApp2, gridRoot2;	// 데이터와 그리드를 포함하는 객체
	var dataGrid2;	// 그리드

	//레이아웃 로드 완료 이벤트 핸들러 함수
	function dblclickHandler(event) {
		
		if(dataGrid.getSelectedIndex() >= 0 ) {
			$('#F_GROUP_CD').val(dataGrid.getSelectedItem().GROUP_CD);
			$('#F_GROUP_NM').val(dataGrid.getSelectedItem().GROUP_NM);
			$('input[name=F_USE_YN][value="' + dataGrid.getSelectedItem().USE_YN + '"]').prop("checked", true);
			$('#CRUD1').val("U");
			$('#F_GROUP_CD').attr("readonly", true ); //설정		
			
			refreshData2() ; 
		}
	}
	function dblclickHandler2(event) {
		if(dataGrid2.getSelectedIndex() >= 0 ) {
			$('#F_DETAIL_ID').val(dataGrid2.getSelectedIndex());
			$('#F_DETAIL_CD').val(dataGrid2.getSelectedItem().DETAIL_CD);
			$('#F_DETAIL_NM').val(dataGrid2.getSelectedItem().DETAIL_NM);
			$('input[name=F_USE_YN][value="' + dataGrid2.getSelectedItem().USE_YN + '"]').prop("checked", true);
			$('#CRUD2').val("UD");
			$('#F_DETAIL_CD').attr("readonly", true ); //설정		
		}
	}


	function refreshData()  
	{
		var gridData0 = [];
		jsonObj = {};

		jsonObj.__crud = 'R';
		jsonObj.__rows = '20';
		jsonObj.__page = '1';
		
		$('#CRUD1').val("C")
		$('#CRUD2').val("CD")
		
		$('input[name="F_USE_YN"]').val(["Y"]);	

		$.ajax({
		   	url:"GetCodeManager",
			data:{param:JSON.stringify(jsonObj)},
			type:"post",
			async: false,
		   	dataType:"json",
			success: function(json_data) {
		        if(json_data.result == 'OK') {
			   		$.each(json_data.rows, function(index, value) {
			   			gridData0.push(value);
			   		});
				} else {
					console.log(json_data.result); 
				}
			}
		});	
		//gridApp.clear();
		gridApp.setLayout(layoutStr);
		gridApp.setData(gridData0);
	}
	
	function refreshData2()  
	{
		
		var gridData0 = [];		
		
        $('#F_DETAIL_CD'   ).val("");
        $('#F_DETAIL_NM'   ).val("");
		$('input[name="F_USE_SUB_YN"]').val(["Y"]);

		$('#F_DETAIL_CD').attr("readonly", false ); //설정
	    $('#F_GROUP_CD' ).attr("readonly", true ); //설정	    
		$('#CRUD2').val("CD")
		
		jsonObj = {};

		jsonObj.__group_cd = $('#F_GROUP_CD').val();
		jsonObj.__crud = 'RD';
		jsonObj.__rows = '20';
		jsonObj.__page = '1';
		
		$('input[name="F_USE_SUB_YN"]').val(["Y"]);	
		
		$.ajax({
		   	url:"GetCodeManager",
			data:{param:JSON.stringify(jsonObj)},
			type:"post",
			async: false,
		   	dataType:"json",
			success: function(json_data) {
		        if(json_data.result == 'OK') {
			   		$.each(json_data.rows, function(index, value) {
			   			gridData0.push(value);
			   		});
				} else {
					console.log(json_data.result); 
				}
			}
		});	
		gridApp2.setLayout(layoutStr2);
		gridApp2.setData(gridData0);		
	
	}
	

	$('#btnQuery').click(function (e) {
		refreshData();
	});

	$('#btnAttrQuery').click(function (e) {
		refreshData2();
	});
	
	
	$('#btnAdd').click(function (e) {
		$('#F_GROUP_CD').val("");
		$('#F_GROUP_NM').val("");
		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#CRUD1').val("C");
		$('#F_GROUP_CD').attr("readonly", false ); //설정		
		$("input#F_GROUP_CD").focus();
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
		$("#SetTableForm").submit() ;
	});

	$('#btnDelete').click(function (e) {
		var formData = new FormData();

		var inputString = confirm('삭제후 복구 할수 없습니다.\n삭제 하시겠습니까?');

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
		$("#SetTableForm").submit() ;
	});
	
	
	
	
	$('#btnAttrAdd').on( 'click', function () {
		
        $('#F_DETAIL_CD'   ).val("");
        $('#F_DETAIL_NM'   ).val("");
        $('input[name="F_USE_SUB_YN"]').val(["Y"]);        
	    $('#F_GROUP_CD' ).attr("readonly", false ); //설정
	    $('#F_DETAIL_CD').attr("readonly", false); //설정	
        $('#CRUD2'   ).val("CD");
        
		$("input#F_DETAIL_CD").focus();	
        
	 });
	
	$('#btnAttrDel').click(function (e) {
		
		var formData = new FormData();

		var inputString = confirm('삭제후 복구 할수 없습니다.\n삭제 하시겠습니까?');
		
		if (inputString) {
	
			var obj = new Object();
			obj.__group_cd    = $("input#F_GROUP_CD").val();
			obj.__detail_cd   = $("input#F_DETAIL_CD").val();
			obj.__detail_nm   = $("input#F_DETAIL_NM").val().toUpperCase();
			obj.__use_yn      = "N";
			obj.__crud        = "DD";
			
			if($.trim(obj.__group_cd) == '' ){
				alert("[알림] 그릅코드1를 먼저 선택하세요");
				$("input#F_GROUP_CD").focus();
			    return;
			} else if($.trim(obj.__detail_cd) == ''){
				alert("[알림] 코드를 입력하세요.");
				$("input#F_DETAIL_CD").focus();
			    return;
			} else {
				$("#SetATTRForm").ajaxForm({
					url : 'SetCodeManager',
					dataType:'json',
					type: 'post',
					data:{param:JSON.stringify(obj)},
					success: function(json_data) {
						$("input#F_DETAIL_CD").val('');
						$("input#F_DETAIL_NM").val('');
						$('#btnAttrQuery').click();
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
			}
		}
	});

	$('#btnAttrSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.__group_cd    = $("input#F_GROUP_CD").val();
		obj.__detail_cd   = $("input#F_DETAIL_CD").val();
		obj.__detail_nm   = $("input#F_DETAIL_NM").val().toUpperCase();
		obj.__use_yn      = $('input[name="F_USE_SUB_YN"]:checked').val()
		obj.__crud        = $("input#CRUD2").val();
		
		if($.trim(obj.__group_cd) == '' ){
			alert("[알림] 그릅코드1를 먼저 선택하세요");
			$("input#F_GROUP_CD").focus();
		    return;
		}

		 if($.trim(obj.__detail_cd) == ''){
			alert("[알림] 코드를 입력하세요.");
			$("input#F_DETAIL_CD").focus();
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
					$('#btnAttrQuery').click();
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
		
	
	
	// 엑셀 export
	// excelExportSave(url:String, async:Boolean);
//	    url : 업로드할 서버의 url, 기본값 null
//	    async : 비동기 모드로 수행여부, 기본값 false
	function excelExport() {
		// PagingCollection의 rowsPerPage를 0으로 세팅하여 전체 데이터를 보여주도록 하며 현재 페이지 번호를 저장합니다.
		var rowsPerPage = collection.getRowsPerPage();
		var currentPage = collection.getCurrentPage();
		collection.setRowsPerPage(0);
		// colNo 컬럼의 indexStartNo를 1로 초기화 해줍니다.
		var colNo = gridRoot.getObjectById("colNo");
		if (colNo)
			colNo.indexStartNo = 1;

		dataGrid.exportOnlyData = inputForm.dataOnly.checked;

		// excel 파일 종류 지정
		for (var i = 0; i < inputForm.export_type.length; i++) {
			if (inputForm.export_type[i].checked) {
				dataGrid.exportType = inputForm.export_type[i].value;
				break;
			}
		}
		dataGrid.exportFileName = "export." + dataGrid.exportType;

		gridRoot.addEventListener("exportSaveComplete", function() {
				// 내보내기 후에 불려져서 PagingCollection의 rowsPerPage, currentPage와 colNo컬럼의 indexStartNo를 원복합니다.
				collection.setRowsPerPage(rowsPerPage);
				collection.setCurrentPage(currentPage);
				if (colNo)
					colNo.indexStartNo = (currentPage - 1) * rowsPerPage + 1;
			}
		);
		gridRoot.excelExportSave("http://demo.riamore.net/demo/grid/saveExcel.jsp", false);
	}

	//----------------------- 그리드 설정 끝 -----------------------

	var layoutStr =
	'<rMateGrid>\
		<NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
		<DataGrid id="dg1" verticalAlign="middle" sortableColumns="true" textAlign="center">\
			<columns>\
				<DataGridColumn dataField="ID" id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
				<DataGridColumn dataField="GROUP_CD" id="colGroupId" width="120"/>\
				<DataGridColumn dataField="GROUP_NM" id="colGroupNm" width="200"/>\
				<DataGridColumn dataField="USE_YN" id="colUseYn" width="80"/>\
			</columns>\
			<dataProvider>\
				<PagingCollection rowsPerPage="12" source="{$gridData}"/>\
			</dataProvider>\
		</DataGrid>\
	</rMateGrid>';

	var layoutStr2 =
		'<rMateGrid>\
			<NumberFormatter id="numfmt2" useThousandsSeparator="true"/>\
			<DataGrid id="dg2" verticalAlign="middle" sortableColumns="true" textAlign="center">\
				<columns>\
					<DataGridColumn dataField="DETAIL_ID" id="colDetailNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
					<DataGridColumn dataField="GROUP_CD" id="colGroupCd" visible="false" width="120"/>\
					<DataGridColumn dataField="DETAIL_CD" id="colDetailCd" width="120"/>\
					<DataGridColumn dataField="DETAIL_NM" id="colDetailNm" width="200"/>\
					<DataGridColumn dataField="USE_YN" id="colUseYn" width="80"/>\
				</columns>\
				<dataProvider>\
					<PagingCollection rowsPerPage="12" source="{$gridData}"/>\
				</dataProvider>\
			</DataGrid>\
		</rMateGrid>';	
	// 페이징 관련 자바스크립트
	var gridTotalRowCount;	// 전체 데이터 건수 - html이 서버에서 작성될때 반드시 넣어줘야 하는 변수입니다.
	var gridRowsPerPage;	// 1페이지에서 보여줄 행 수
	var gridViewPageCount = 10;		// 페이지 네비게이션에서 보여줄 페이지의 수
	var gridCurrentPage;	// 현재 페이지
	var gridTotalPage;	// 전체 페이지 계산

	// 페이징 관련 자바스크립트
	var gridTotalRowCount2;	// 전체 데이터 건수 - html이 서버에서 작성될때 반드시 넣어줘야 하는 변수입니다.
	var gridRowsPerPage2;	// 1페이지에서 보여줄 행 수
	var gridViewPageCount2 = 10;		// 페이지 네비게이션에서 보여줄 페이지의 수
	var gridCurrentPage2;	// 현재 페이지
	var gridTotalPage2;	// 전체 페이지 계산

	// 화면에 표시할 맨앞으로 와 맨뒤로, 앞으로, 뒤로 문구 - 이미지를 쓸 경우 img 태그로 대체
	var gridStartTxt = "≪";
	var gridEndTxt = "≫";
	var gridPrevTxt = "◀";
	var gridNextTxt = "▶";
	var gridPageGapTxt = " ";	// 페이지 사이의 구분을 위한 문자 - 사용하지 않을 경우 공백을 넣습니다.

	var gridStartTxt2 = "≪";
	var gridEndTxt2 = "≫";
	var gridPrevTxt2 = "◀";
	var gridNextTxt2 = "▶";
	var gridPageGapTxt2 = " ";	// 페이지 사이의 구분을 위한 문자 - 사용하지 않을 경우 공백을 넣습니다.

	// 주어진 페이지 번호에 따라 페이지 네비게이션 html을 만들고 gridPageNavigationDiv에 innerHTML로 넣어줍니다.
	function drawGridPagingNavigation(goPage) {
		if (gridTotalPage == 0) {
			gridPageNavigationDiv.innerHTML = "<span class='gridPagingDisable'>" + gridStartTxt + "</span> <span class='gridPagingDisable'>" + gridPrevTxt + "</span> <span class='gridPagingDisable'>" + gridNextTxt + "</span> <span class='gridPagingDisable'>" + gridEndTxt + "</span>";
			return;
		}

		var retStr = "";
		var prepage = parseInt((goPage - 1)/gridViewPageCount) * gridViewPageCount;
		var nextpage = ((parseInt((goPage - 1)/gridViewPageCount)) * gridViewPageCount) + gridViewPageCount + 1;

		// 맨앞으로
		retStr += "<span class="; 	
		if (goPage > 1) {
			retStr += "'gridPagingMove'><a href='javascript:gridMovePage(1)'>" + gridStartTxt + "</a></span> ";
		} else {
			retStr += "'gridPagingDisable'>" + gridStartTxt + "</span> ";
		}

		// 앞으로
		retStr += "<span class=";
		if (goPage > gridViewPageCount) {
			retStr += "'gridPagingMove'><a href='javascript:gridMovePage(" + prepage + ")'>" + gridPrevTxt + "</a></span>&nbsp; ";
		} else {
			retStr += "'gridPagingDisable'>" + gridPrevTxt + "</span>&nbsp; ";
		}

		for (var i = (1 + prepage); i < gridViewPageCount + 1 + prepage; i++) {
			if (goPage == i) {
				retStr += "<span class='gridPagingCurrent'>";
				retStr += i;
				retStr += "</span>";
			} else {
				retStr += "<span>";
				retStr += "<a href='javascript:gridMovePage(" + i + ")'>" + i + "</a>";
				retStr += "</span>";
			}

			if (i >= gridTotalPage) {
				retStr += " ";
				break;
			}

			if (i == gridViewPageCount + prepage)
				retStr += " ";
			else
				retStr += gridPageGapTxt;
		}

		// 뒤로
		retStr += "&nbsp;<span class=";
		if (nextpage <= gridTotalPage) {
			retStr += "'gridPagingMove'><a href='javascript:gridMovePage(" + nextpage + ")'>" + gridNextTxt + "</a></span> ";
		} else {
			retStr += "'gridPagingDisable'>" + gridNextTxt + "</span> ";
		}

		// 맨뒤로
		retStr += "<span class=";
		if (goPage != gridTotalPage) {
			retStr += "'gridPagingMove'><a href='javascript:gridMovePage(" + gridTotalPage + ")'>" + gridEndTxt + "</span>";
		} else {
			retStr += "'gridPagingDisable'>" + gridEndTxt + "</span>";
		}
		gridPageNavigationDiv.innerHTML = retStr;
	}

	// 주어진 페이지 번호에 따라 페이지 네비게이션 html을 만들고 gridPageNavigationDiv에 innerHTML로 넣어줍니다.
	function drawGridPagingNavigation2(goPage2) {
		if (gridTotalPage2 == 0) {
			gridPageNavigationDiv2.innerHTML = "<span class='gridPagingDisable'>" + gridStartTxt2 + "</span> <span class='gridPagingDisable'>" + gridPrevTxt2 + "</span> <span class='gridPagingDisable'>" + gridNextTxt + "</span> <span class='gridPagingDisable'>" + gridEndTxt + "</span>";
			return;
		}

		var retStr2 = "";
		var prepage2 = parseInt((goPage2 - 1)/gridViewPageCount2) * gridViewPageCount2;
		var nextpage2 = ((parseInt((goPage2 - 1)/gridViewPageCount2)) * gridViewPageCount2) + gridViewPageCount2 + 1;

		// 맨앞으로
		retStr2 += "<span class="; 	
		if (goPage2 > 1) {
			retStr2 += "'gridPagingMove'><a href='javascript:gridMovePage2(1)'>" + gridStartTxt2 + "</a></span> ";
		} else {
			retStr2 += "'gridPagingDisable'>" + gridStartTxt2 + "</span> ";
		}

		// 앞으로
		retStr2 += "<span class=";
		if (goPage2 > gridViewPageCount2) {
			retStr2 += "'gridPagingMove'><a href='javascript:gridMovePage2(" + prepage2 + ")'>" + gridPrevTxt2 + "</a></span>&nbsp; ";
		} else {
			retStr2 += "'gridPagingDisable'>" + gridPrevTxt2 + "</span>&nbsp; ";
		}

		for (var i = (1 + prepage2); i < gridViewPageCount2 + 1 + prepage2; i++) {
			if (goPage2 == i) {
				retStr2 += "<span class='gridPagingCurrent'>";
				retStr2 += i;
				retStr2 += "</span>";
			} else {
				retStr2 += "<span>";
				retStr2 += "<a href='javascript:gridMovePage2(" + i + ")'>" + i + "</a>";
				retStr2 += "</span>";
			}

			if (i >= gridTotalPage2) {
				retStr2 += " ";
				break;
			}

			if (i == gridViewPageCount2 + prepage2)
				retStr2 += " ";
			else
				retStr2 += gridPageGapTxt2;
		}

		// 뒤로
		retStr2 += "&nbsp;<span class=";
		if (nextpage2 <= gridTotalPage2) {
			retStr2 += "'gridPagingMove'><a href='javascript:gridMovePage2(" + nextpage2 + ")'>" + gridNextTxt2 + "</a></span> ";
		} else {
			retStr2 += "'gridPagingDisable'>" + gridNextTxt2 + "</span> ";
		}

		// 맨뒤로
		retStr2 += "<span class=";
		if (goPage2 != gridTotalPage2) {
			retStr2 += "'gridPagingMove'><a href='javascript:gridMovePage2(" + gridTotalPage2 + ")'>" + gridEndTxt2 + "</span>";
		} else {
			retStr2 += "'gridPagingDisable'>" + gridEndTxt2 + "</span>";
		}
		
		console.log(retStr2);
		gridPageNavigationDiv2.innerHTML = retStr2;
	}	
	
	function gridMovePage(goPage) {
		gridTotalRowCount = collection.getTotalLength();
		gridRowsPerPage = collection.getRowsPerPage();
		gridTotalPage = collection.getTotalPageCount();
		gridCurrentPage = goPage <= gridTotalPage ? goPage : gridTotalPage;

		drawGridPagingNavigation(gridCurrentPage);
		collection.setCurrentPage(gridCurrentPage);
		var colNo = gridRoot.getObjectById("colNo");
		if (colNo)
			colNo.indexStartNo = (gridCurrentPage - 1) * gridRowsPerPage + 1;
	}
	
	function gridMovePage2(goPage) {
		gridTotalRowCount2 = collection2.getTotalLength();
		gridRowsPerPage2 = collection2.getRowsPerPage();
		gridTotalPage2 = collection2.getTotalPageCount();
		gridCurrentPage2 = goPage <= gridTotalPage2 ? goPage : gridTotalPage2;

		drawGridPagingNavigation2(gridCurrentPage2);
		collection2.setCurrentPage(gridCurrentPage2);
		var colNo2 = gridRoot2.getObjectById("colNo");
		if (colNo2)
			colNo2.indexStartNo = (gridCurrentPage2 - 1) * gridRowsPerPage2 + 1;
	}
	
	