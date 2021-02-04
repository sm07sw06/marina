	// ----------------------- 그리드 설정 시작 -------------------------------------

	// rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
	var jsVars = "rMateOnLoadCallFunction=gridReadyHandler";
	//rMateGrid 관련 객체
	var collection;	// 그리드의 데이터 객체
	var cnt=0;
	//var gridData = [];
	var jsonObj = new Object();


	// rMateDataGrid 를 생성합니다.
	// 파라메터 (순서대로)
	//  1. 그리드의 id ( 임의로 지정하십시오. )
	//  2. 그리드가 위치할 div 의 id (즉, 그리드의 부모 div 의 id 입니다.)
	//  3. 그리드 생성 시 필요한 환경 변수들의 묶음인 jsVars
	//  4. 그리드의 가로 사이즈 (생략 가능, 생략 시 100%)
	//  5. 그리드의 세로 사이즈 (생략 가능, 생략 시 100%)
	rMateGridH5.create("grid1", "gridHolder", jsVars, "100%", "100%");


	// 그리드의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
	// rMate 그리드의 준비가 완료된 경우 이 함수가 호출됩니다.
	// 이 함수를 통해 그리드에 레이아웃과 데이터를 삽입합니다.
	// 파라메터 : id - rMateGridH5.create() 사용 시 사용자가 지정한 id 입니다.
	function gridReadyHandler(id) {
		var gridData = [];
		// rMateGrid 관련 객체
		gridApp = document.getElementById(id);	// 그리드를 포함하는 div 객체
		gridRoot = gridApp.getRoot();	// 데이터와 그리드를 포함하는 객체

		gridApp.setLayout(layoutStr);
		gridApp.setData(gridData);

		var layoutCompleteHandler = function(event) {
			dataGrid = gridRoot.getDataGrid();	// 그리드 객체
		}
		// 사용자가 import를 완료하면 불려집니다.
		var dataCompleteHandler = function() {
			collection = gridRoot.getCollection();
			gridMovePage(1);
		}

		refreshData();
		
		gridRoot.addEventListener("layoutComplete", layoutCompleteHandler);
		gridRoot.addEventListener("dataComplete", dataCompleteHandler);
		gridRoot.addEvent("dblclick", dblclickHandler);
		
	}

	var gridApp, gridRoot;	// 데이터와 그리드를 포함하는 객체
	var dataGrid;	// 그리드

	//레이아웃 로드 완료 이벤트 핸들러 함수
	function dblclickHandler(event) {
		if(dataGrid.getSelectedIndex() >= 0 ) {
			$('#F_ANCHOR_ID'    ).val(dataGrid.getSelectedItem().ANCHOR_ID);
			$('#F_ANCHOR_NM'    ).val(dataGrid.getSelectedItem().ANCHOR_NM);
			$('#F_SECTOR_ID'    ).val(dataGrid.getSelectedItem().SECTOR_ID);
			$('#F_SECTOR_NM'    ).val(dataGrid.getSelectedItem().SECTOR_NM);
			$('#F_ANCHOR_STATUS').val(dataGrid.getSelectedItem().ANCHOR_STATUS);
			$('#F_BOAT_ID'      ).val(dataGrid.getSelectedItem().BOAT_ID);
			$('#F_BOAT_NM'      ).val(dataGrid.getSelectedItem().BOAT_NM);
			$('#CRUD').val("U");
		}
	}

	function refreshData()  
	{
		var gridData = [];
		jsonObj = {};

		jsonObj.__use_yn = $('input[name="C_USE_YN"]:checked').val();	
		jsonObj.__sector_id = '*';
		jsonObj.__rows      = '20';
		jsonObj.__page      = '1';

		$.ajax({
		   	url:"GetAnchorList",
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
	}
	

	$('#btnQuery').click(function (e) {
		refreshData();
	});
	
	$('#btnAdd').click(function (e) {
		$('#F_ANCHOR_ID'   ).val("");
		$('#F_ANCHOR_NM'   ).val("");
		$('#F_SECTOR_ID'   ).val("");
		$('#F_SECTOR_NM'   ).val("");
		$('#F_BOAT_ID'     ).val("");
		$('#F_BOAT_NM'     ).val("");
		$('#F_ANCHOR_STATUS'	 ).val("");
		$('#F_ANCHOR_STATUS option:eq(0)').prop("selected", true);		
		$('#CRUD'          ).val("C");
		$('#F_ANCHOR_ID'  ).attr("readonly", true); //설정
		$('#F_SECTOR_ID'  ).attr("readonly", true); //설정
		$('#F_BOAT_ID'    ).attr("readonly", true); //설정
		$("input#F_ANCHOR_NM").focus();
	});

	$('#btnSave').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.anchor_id     = $("input#F_ANCHOR_ID").val();
		obj.anchor_nm     = $("input#F_ANCHOR_NM").val();
		obj.sector_id     = $("input#F_SECTOR_ID").val();
		obj.boat_id       = $("input#F_BOAT_ID").val();
		obj.anchor_status = $('select#F_ANCHOR_STATUS option:selected').val();				
		obj.crud          = $("#CRUD").val();

		console.log('anchor_nm:'+ obj.anchor_nm);
		
		if(obj.anchor_nm == ''){
			alert("[알림] 계류지명을 입력하세요.");
			$("input#F_ANCHOR_NM").focus();
		    return;
		}

		$("#SetAnchorForm").ajaxForm({
			url : 'SetAnchor',
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
		$("#SetAnchorForm").submit() ;
	});

	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.sector_id   = $("input#F_ANCHOR_ID").val();
		obj.crud        = "D";
		
		var input = confirm('삭제하시겠습니까?'); 
		if(!input) return;

		if(obj.sector_id == ''){
			alert("[알림] 계류지명을 선택하세요.");
			$("input#F_ANCHOR_NM").focus();
		    return;
		}
		
		console.log('F_ANCHOR_ID:'+ obj.sector_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetAnchorForm").ajaxForm({
			url : 'SetAnchor',
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
		$("#SetAnchorForm").submit() ;
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
				<DataGridColumn dataField="ID" id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
				<DataGridColumn dataField="ANCHOR_ID"   		id="colAnchorId"   		headerText="계류지ID" width="100"  visible="false"   />\
				<DataGridColumn dataField="ANCHOR_NM" 			id="colAnchorNm" 		headerText="계류지" 	width="100"/>\
				<DataGridColumn dataField="SECTOR_ID"   		id="colScetorId"   		headerText="구역ID"  width="100"  visible="false"   />\
				<DataGridColumn dataField="SECTOR_NM" 			id="colScetorNm" 		headerText="구역명" 	width="100"/>\
				<DataGridColumn dataField="ANCHOR_STATUS"   	id="colAnchorStatus" 	headerText="정박상태" width="100" visible="false"   />\
				<DataGridColumn dataField="ANCHOR_STATUS_NM"   	id="colAnchorStatusNm" 	headerText="정박상태" width="100"/>\
				<DataGridColumn dataField="BOAT_ID"   			id="colBoatId" 			headerText="보트ID" 	width="100" visible="false"   />\
				<DataGridColumn dataField="BOAT_NM"   			id="colBoatNm" 			headerText="보트명" 	width="100"/>\
			</columns>\
			<dataProvider>\
				<PagingCollection rowsPerPage="18" source="{$gridData}"/>\
			</dataProvider>\
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
	

	$("input#F_ANCHOR_NM").focus();
	