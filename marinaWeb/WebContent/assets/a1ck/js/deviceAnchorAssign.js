	// ----------------------- 그리드 설정 시작 -------------------------------------

	// rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
	var jsVars = "rMateOnLoadCallFunction=gridReadyHandler";
	jsVars += "&assetsPath=rMateGridH5/Assets/";
	//rMateGrid 관련 객체
	var collection;	// 그리드의 데이터 객체
	var cnt=0;
	var jsonObj = new Object();


	// rMateDataGrid 를 생성합니다.
	// 파라메터 (순서대로)
	//  1. 그리드의 id ( 임의로 지정하십시오. )
	//  2. 그리드가 위치할 div 의 id (즉, 그리드의 부모 div 의 id 입니다.)
	//  3. 그리드 생성 시 필요한 환경 변수들의 묶음인 jsVars
	//  4. 그리드의 가로 사이즈 (생략 가능, 생략 시 100%)
	//  5. 그리드의 세로 사이즈 (생략 가능, 생략 시 100%)
	rMateGridH5.create("grid1", "gridHolder", jsVars, "100%", "100%");
	rMateGridH5.create("grid2", "question2", jsVars, "100%", "100%");

	// 그리드의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
	// rMate 그리드의 준비가 완료된 경우 이 함수가 호출됩니다.
	// 이 함수를 통해 그리드에 레이아웃과 데이터를 삽입합니다.
	// 파라메터 : id - rMateGridH5.create() 사용 시 사용자가 지정한 id 입니다.
	function gridReadyHandler(id) {
		if (id == "grid1") {			
			var gridData = [];
			// rMateGrid 관련 객체
			gridApp = document.getElementById(id);	// 그리드를 포함하는 div 객체
			gridRoot = gridApp.getRoot();	// 데이터와 그리드를 포함하는 객체
	
			gridApp.setLayout(layoutStr);
			gridApp.setData(gridData);
	
			var layoutCompleteHandler = function(event) {
				dataGrid = gridRoot.getDataGrid();	// 그리드 객체
			}
	
			var itemDoubleClickHandler = function(event) {
				var rowIndex = event.rowIndex;
				console.log(rowIndex);
				var columnIndex = event.columnIndex;
				var dataRow = gridRoot.getItemAt(rowIndex);
				// 컬럼중 숨겨진 컬럼(visible false인 컬럼)이 있으면 getDisplayableColumns()를 사용하여 컬럼을 가져옵니다.
				var column = dataGrid.getDisplayableColumns()[columnIndex];
				var dataField = column.getDataField();
				if (dataField == "ANCHOR_NM") {
					editRowIndex = rowIndex;
					editDataRow = dataRow;
					editDataField = dataField;
					// pop up layer window
					popupLayerGrid();
				}
			}		
			
			// 사용자가 import를 완료하면 불려집니다.
			var dataCompleteHandler = function() {
				dataGrid = gridRoot.getDataGrid();	// 그리드 객체
				dataGrid.addEventListener("itemDoubleClick", itemDoubleClickHandler);
				
				collection = gridRoot.getCollection();
				gridMovePage(1);
			}
			
			refreshData();
			
			gridRoot.addEventListener("layoutComplete", layoutCompleteHandler);
			gridRoot.addEventListener("dataComplete", dataCompleteHandler);
			gridRoot.addEvent("dblclick", dblclickHandler);
		} else {
			var gridData2 = [];
			// rMateGrid 관련 객체
			gridApp2 = document.getElementById(id);	// 그리드를 포함하는 div 객체
			gridRoot2 = gridApp2.getRoot();	// 데이터와 그리드를 포함하는 객체
	
			gridApp2.setLayout(layoutStr2);
			gridApp2.setData(gridData2);
	
			var layoutCompleteHandler2 = function(event) {
				dataGrid2 = gridRoot2.getDataGrid();	// 그리드 객체
			}
	
			var itemDoubleClickHandler2 = function(event) {
				var rowIndex2 = event.rowIndex;
				console.log(rowIndex2);
				var columnIndex2 = event.columnIndex;
				var dataRow2 = gridRoot2.getItemAt(rowIndex2);
				// 컬럼중 숨겨진 컬럼(visible false인 컬럼)이 있으면 getDisplayableColumns()를 사용하여 컬럼을 가져옵니다.
				var column2 = dataGrid2.getDisplayableColumns()[columnIndex2];
				var dataField2 = column2.getDataField();
				if (dataField2 == "ANCHOR_NM") {
					editRowIndex2 = rowIndex2;
					editDataRow2 = dataRow2;
					editDataField2 = dataField2;
				}
			}		
			
			// 사용자가 import를 완료하면 불려집니다.
			var dataCompleteHandler2 = function() {
				dataGrid2 = gridRoot2.getDataGrid();	// 그리드 객체
				dataGrid2.addEventListener("itemDoubleClick", itemDoubleClickHandler2);
				
				collection2 = gridRoot2.getCollection();
				gridMovePage(1);
			}
			
			refreshData2();
			
			gridRoot2.addEventListener("layoutComplete", layoutCompleteHandler2);
			gridRoot2.addEventListener("dataComplete", dataCompleteHandler2);
			gridRoot2.addEvent("dblclick", dblclickHandler2);				
		}

	}

	var gridApp, gridRoot, dataGrid;
	var gridApp2, gridRoot2, dataGrid2;

	var editRowIndex;
	var editDataRow;
	var editDataField;

	var editRowIndex2;
	var editDataRow2;
	var editDataField2;
	
	function popupLayerGrid() {

		$.blockUI({
				//HTML 태그를 문자열로 적용해도 무관함
				message: $('#question')
				//css 설정
				 ,css: {
					padding:        0,
					margin:         0,
					width:          '500px',
					height:         '460px',
					top:            '10%',
					left:           '20%',
					textAlign:      'center',
					color:          '#000',
					border:         '3px none #aaa',
					backgroundColor:'#f7f7f7',
					cursor:         'default',
					fontFamily:     '맑은 고딕',
					borderRadius:   '3px'
				}
				,focusInput: true
				//모달창 외부 클릭시 닫기
				,onOverlayClick: $.unblockUI
		});
		gridApp2.resize();

	}
	
	$(function(){
		$("#closebtn").click(function(){
			 //모달창 닫기
			 $.unblockUI();
		})
	})

	//레이아웃 로드 완료 이벤트 핸들러 함수
	function dblclickHandler(event) {
		if(dataGrid.getSelectedIndex() >= 0 ) {
			
			$('#F_MARINA_ID').val(dataGrid.getSelectedItem().MARINA_ID);
			$('#F_MACHINE_ID').val(dataGrid.getSelectedItem().MACHINE_ID);
			$('#F_ANCHOR_ID').val(dataGrid.getSelectedItem().ANCHOR_ID);
			$('#F_ANCHOR_NM').val(dataGrid.getSelectedItem().ANCHOR_NM);
			$('#F_LEFT_RIGHT').val(dataGrid.getSelectedItem().LEFT_RIGHT);
			$('#F_MACHINE_REF_ID').val(dataGrid.getSelectedItem().MACHINE_REF_ID);
			$('#CRUD').val("U");
			$('#F_MACHINE_ID' ).attr("readonly", true); //설정
			$('#F_LEFT_RIGHT' ).attr("disabled", true); //설정
			$("input#F_F_MACHINE_ID").focus();
		}
	}
	
	function dblclickHandler2(event) {
		if(dataGrid2.getSelectedIndex() >= 0 ) {
			$('#F_ANCHOR_ID').val(dataGrid2.getSelectedItem().ANCHOR_ID);
			$('#F_ANCHOR_NM').val(dataGrid2.getSelectedItem().ANCHOR_NM);
			//$('#CRUD').val("U");
			$.unblockUI();
		}
	}
	
	

	function refreshData()  
	{
		var gridData = [];
		jsonObj = {};

		jsonObj.__marina_id = '1';
		jsonObj.__machine_id = $('#C_MACHINE_ID').val();
		jsonObj.__rows    = '20';
		jsonObj.__page    = '1';

		$.ajax({
		   	url:"GetAnchorDevice",
			data:{param:JSON.stringify(jsonObj)},
			type:"post",
		   	dataType:"json",
			success: function(json_data) {
		        if(json_data.result == 'OK') {
			   		$.each(json_data.rows, function(index, value) {
			   			gridData.push(value);
			   		});
				} else {
					console.log(json_data.result); 
				}
			}
		});	
		gridApp.clear();
		gridApp.setLayout(layoutStr);
		gridApp.setData(gridData);
		$('#F_MARINA_ID'     ).val("1");
	}
	
	function refreshData2()  
	{
		var gridData2 = [];
		jsonObj = {};

		jsonObj.__marina_id = '1';
		jsonObj.__boat_id = '';
		jsonObj.__boat_nm = '%';
		jsonObj.__rows     = "20";
		jsonObj.__page     = "1" ;

		$.ajax({
		   	url:"GetAnchorList",
			data:{param:JSON.stringify(jsonObj)},
			type:"post",
		   	dataType:"json",
			success: function(json_data) {
		        if(json_data.result == 'OK') {
			   		$.each(json_data.rows, function(index, value) {
			   			gridData2.push(value);
			   		});
				} else {
					console.log(json_data2.result); 
				}
			}
		});	
		gridApp2.clear();
		gridApp2.setLayout(layoutStr2);
		gridApp2.setData(gridData2);
	}
	
	
	$('#btnQuery').click(function (e) {
		refreshData();
	});
	
	$('#btnAdd').click(function (e) {
		$('#F_MARINA_ID'     ).val("1");
		$('#F_MACHINE_ID'    ).val("");
		$('#F_ANCHOR_ID'     ).val("");
		$('#F_ANCHOR_NM'     ).val("");
		$('#F_LEFT_RIGHT'    ).val("");
		$('#F_MACHINE_REF_ID').val("");
		$('#F_MACHINE_ID'    ).attr("readonly", false); //설정
		$('#F_LEFT_RIGHT'    ).attr("disabled", false); //설정
		$('#F_LEFT_RIGHT option:eq(0)').prop("selected", true);
		$('#CRUD'            ).val("C");
		$("input#F_F_MACHINE_ID").focus();
	});

	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.marina_id      = $("input#F_MARINA_ID").val();
		obj.machine_id     = $("input#F_MACHINE_ID").val();
		obj.left_right     =  $('select#F_LEFT_RIGHT option:selected').val();		
		obj.anchor_id      = $("input#F_ANCHOR_ID").val();
		obj.machine_ref_id = $("input#F_MACHINE_REF_ID").val();
		obj.crud        = $("#CRUD").val();

		console.log('marina_id:'+ obj.marina_id);
		console.log('machine_id:'+ obj.machine_id);
		console.log('anchor_id:'+ obj.anchor_id);
		console.log('machine_ref_id:'+ obj.machine_ref_id);
		console.log('left_right:'+ obj.left_right);
		
		if(obj.machine_id == ''){
			alert("[알림] 단말기 No를 입력하세요.");
			$("input#F_MACHINE_ID").focus();
		    return;
		}
		
		if(obj.left_right == ''){
			alert("[알림] 좌우 방향을 선택하세요.");
			$("input#F_LEFT_RIGHT").focus();
		    return;
		}
		
		$("#SetBoatForm").ajaxForm({
			url : 'SetAnchorDevice',
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
		    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 구역에서 전달
		    			alert("이미 등록되어 있는 아이디 입니다.");
		    		} else {
		    			alert("Error");
		    		}
		    	}
			}
		});	
		$("#SetBoatForm").submit() ;
	});

	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.marina_id      = $("input#F_MARINA_ID").val();
		obj.machine_id     = $("input#F_MACHINE_ID").val();
		obj.left_right     =  $('select#F_LEFT_RIGHT option:selected').val();		

		obj.crud        = "D";
		
		var input = confirm('삭제하시겠습니까?'); 
		if(!input) return;

		if(obj.machine_id == ''){
			alert("[알림] 단말기 No를 선택하세요.");
			$("input#F_MACHINE_ID").focus();
		    return;
		}
		$("#SetBoatForm").ajaxForm({
			url : 'SetAnchorDevice',
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
		    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 구역에서 전달
		    			// data 오브젝트에 error의 값이 2일 때의 이벤트 처리
		    			alert("이미 등록되어 있는 아이디 입니다.");
		    		} else {
		    			alert("Error");
		    		}
		    	}
			}
		});	
		$("#SetBoatForm").submit() ;
	});
	
	
	// 엑셀 export
	// excelExportSave(url:String, async:Boolean);
//	    url : 업로드할 구역의 url, 기본값 null
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
				<DataGridColumn dataField="ID" 			id="colNo" 			 headerText="No"		itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
				<DataGridColumn dataField="MARINA_ID"  	id="colMarinaId"   	 headerText="마리나"    	width="100" visible="false" />\
				<DataGridColumn dataField="MACHINE_ID"  id="colMachineId" 	 headerText="단말기No"   	width="100"  />\
				<DataGridColumn dataField="LEFT_RIGHT"  id="colLeftRight"    headerText="좌우구분"     width="60" fontWeight="bold" itemEditor="ComboBoxEditor" editorDataField="selectedDataField" itemRendererDataField="code" itemRenderer="DataProviderItem" itemRendererDataProvider="[{\'label\':\'좌\',\'code\':\'0\'},{\'label\':\'우\',\'code\':\'1\'}]"/>\
				<DataGridColumn dataField="ANCHOR_ID"   id="colAnchor_Id"    headerText="계류지ID"   	width="100" visible="false" />\
				<DataGridColumn dataField="ANCHOR_NM" 	id="colAnchorNm" 	 headerText="계류지명"  	width="200" />\
				<DataGridColumn dataField="MACHINE_REF_ID"  id="colMachineRefId" 	 headerText="연관단말기 No"   width="100"  />\
			</columns>\
			<dataProvider>\
				<PagingCollection rowsPerPage="18" source="{$gridData}"/>\
			</dataProvider>\
		</DataGrid>\
	</rMateGrid>';


	
	var layoutStr2 =
		'<rMateGrid>\
		<NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
		<DataGrid id="dg1" verticalAlign="middle" sortableColumns="true" textAlign="center">\
			<groupedColumns>\
				<DataGridColumn dataField="No" id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
				<DataGridColumn dataField="ANCHOR_ID"    id="colBoatId"     	headerText="ID"  width="100"     />\
				<DataGridColumn dataField="ANCHOR_NM" 	 id="colBoatNm"   		headerText="보트명" width="200"/>\
			</groupedColumns>\
		</DataGrid>\
	</rMateGrid>';

	
	
	
	// 페이징 관련 자바스크립트  visible="false"  
	var gridTotalRowCount;	// 전체 데이터 건수 - html이 구역에서 작성될때 반드시 넣어줘야 하는 변수입니다.

	var gridRowsPerPage;	// 1페이지에서 보여줄 행 수
	var gridViewPageCount = 10;		// 페이지 네비게이션에서 보여줄 페이지의 수
	var gridCurrentPage;	// 현재 페이지
	var gridTotalPage;	// 전체 페이지 계산

	// 화면에 표시할 맨앞으로 와 맨뒤로, 앞으로, 뒤로 문구 - 이미지를 쓸 경우 img 태그로 대체
	var gridStartTxt = "≪";
	var gridEndTxt = "≫";
	var gridPrevTxt = "◀";
	var gridNextTxt = "▶";
	var gridPageGapTxt = " ";	// 페이지 사이의 구분을 위한 문자 - 사용하지 않을 경우 공백을 넣습니다.

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
	
