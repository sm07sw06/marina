	// ----------------------- 그리드 설정 시작 -------------------------------------

	// rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
	var jsVars = "rMateOnLoadCallFunction=gridReadyHandler";
	jsVars += "&assetsPath=rMateGridH5/Assets/";
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
	rMateGridH5.create("grid2", "question2" , jsVars, "100%", "100%");

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
			// 사용자가 import를 완료하면 불려집니다.
			var dataCompleteHandler = function() {
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
			
			// 사용자가 import를 완료하면 불려집니다.
			var dataCompleteHandler2 = function() {
				dataGrid2 = gridRoot2.getDataGrid();	// 그리드 객체
				
				collection2 = gridRoot2.getCollection();
				gridMovePage(1);
			}
			
			refreshData2();
			
			gridRoot2.addEventListener("layoutComplete", layoutCompleteHandler2);
			gridRoot2.addEventListener("dataComplete", dataCompleteHandler2);
			gridRoot2.addEvent("dblclick", dblclickHandler2);			
		}
		
	}

	var gridApp, gridRoot;	// 데이터와 그리드를 포함하는 객체
	var dataGrid;	// 그리드
	var gridApp2, gridRoot2, dataGrid2;
	
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
	
	
	function refreshData()  
	{
		
		var gridData = [];
		jsonObj = {};

		jsonObj.__marina_id = '1';
		jsonObj.__cctv_cd = $('#C_CCTV_CD').val();
		jsonObj.__from  = $('#C_FROM').val().replace(/-/g,"");
		jsonObj.__to    = $('#C_TO').val().replace(/-/g,"");
		jsonObj.__rows      = '20';
		jsonObj.__page      = '1';

		if(jsonObj.__from == ''){
			alert("[알림] 조회 시작일자를 입력하세요.");
			$("input#C_FROM").focus();
		    return;
		}		
		if(jsonObj.__to == ''){
			alert("[알림] 조회 종료일자를 입력하세요.");
			$("input#C_TO").focus();
		    return;
		}		
		if(jsonObj.__from > jsonObj.__to){
			alert("[알림] 조회 기간을 확인하세요.");
			$("input#C_FROM").focus();
		    return;
		}		
		
		$.ajax({
		   	url:"GetCctvMonitoringReport",
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
		//console.log(gridData);
		gridApp.setData(gridData);
	}
	
	function refreshData2()  
	{
		var gridData2 = [];
		jsonObj = {};

		jsonObj.__boat_id = '';
		jsonObj.__boat_nm = '%';
		jsonObj.__rows     = "20";
		jsonObj.__page     = "1" ;

		$.ajax({
		   	url:"GetCctvMonitoringReport",
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
	
	function dblclickHandler(event) {
		if(dataGrid.getSelectedIndex() >= 0 ) {
			console.log(dataGrid.getSelectedIndex());
		}
	}	
	
	function dblclickHandler2(event) {
		if(dataGrid2.getSelectedIndex() >= 0 ) {
			$('#C_BOAT_ID').val(dataGrid2.getSelectedItem().BOAT_ID);
			$('#C_BOAT_NM').val(dataGrid2.getSelectedItem().BOAT_NM);
			$.unblockUI();
		}
	}
	
	
	$('#btnQuery').click(function (e) {
		refreshData();
	});
	
	// 엑셀 export
	// excelExportSave(url:String, async:Boolean);
//	    url : 업로드할 구역의 url, 기본값 null
//	    async : 비동기 모드로 수행여부, 기본값 false
	function excelExport() {
		
		// 엑셀문서의 제목 행들을 지정합니다.
		dataGrid.exportTitles = [
			"입출항 CCTV 확인 보고서",	// 문자열 하나를 기본 제목 스타일로 넣을 경우
		];
		// 엑셀문서의 꼬릿말라인들을 지정합니다.
		dataGrid.exportFooters = [
			{height:14, text:""},
		];
		
		// PagingCollection의 rowsPerPage를 0으로 세팅하여 전체 데이터를 보여주도록 하며 현재 페이지 번호를 저장합니다.
		var rowsPerPage = collection.getRowsPerPage();
		var currentPage = collection.getCurrentPage();
		collection.setRowsPerPage(0);
		// colNo 컬럼의 indexStartNo를 1로 초기화 해줍니다.
		var colNo = gridRoot.getObjectById("colNo");
		if (colNo)
			colNo.indexStartNo = 1;

		dataGrid.exportFileName = "export." + dataGrid.exportType;

		gridRoot.addEventListener("exportSaveComplete", function() {
				// 내보내기 후에 불려져서 PagingCollection의 rowsPerPage, currentPage와 colNo컬럼의 indexStartNo를 원복합니다.
				collection.setRowsPerPage(rowsPerPage);
				collection.setCurrentPage(currentPage);
				if (colNo)
					colNo.indexStartNo = (currentPage - 1) * rowsPerPage + 1;
			}
		);
		gridRoot.excelExportSave("http://demo11.riamore.net/demo/grid/saveExcel.jsp", false);
	}

	//----------------------- 그리드 설정 끝 -----------------------

	var layoutStr =
	'<rMateGrid>\
		<NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
	    <DateFormatter id="datefmt"/>\
	    <DateFormatter id="datefmt2" formatString="YY년 MM월 DD일 HH시 NN분 SS초"/>\
		<DataGrid id="dg1" verticalAlign="middle" sortableColumns="true" textAlign="center">\
			<groupedColumns>\
				<DataGridColumn dataField="ID" 				id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
				<DataGridColumn dataField="SEND_TIME"   	id="colSendTime"   	headerText="일시"    width="100" formatter="{datefmt2}"/>\
				<DataGridColumn dataField="CCTV_CD" 		id="colCctvCd" 		headerText="CCTV"  width="100" />\
				<DataGridColumn dataField="BOATINOUT_NM"    id="colBoatInoutNm" headerText="입출항"  width="60" />\
				<DataGridColumn dataField="PHOTO_BASE64" 	id="colPhotoBase64" headerText="사진"    width="200" />\
			</groupedColumns>\
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
				<DataGridColumn dataField="BOAT_ID"   	 id="colBoatId"     	headerText="ID"  width="100"     />\
				<DataGridColumn dataField="BOAT_NM" 	 id="colBoatNm"   		headerText="보트명" width="200"/>\
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
	
	function getToday(){
	    var now = new Date();
	    var year = now.getFullYear();
	    var month = now.getMonth() + 1;    //1월이 0으로 되기때문에 +1을 함.
	    var date = now.getDate();

	    month = month >=10 ? month : "0" + month;
	    date  = date  >= 10 ? date : "0" + date;
	     // ""을 빼면 year + month (숫자+숫자) 됨.. ex) 2018 + 12 = 2030이 리턴됨.

	    //console.log(""+year + month + date);
	    return today = "" + year + "-" + month + "-" + date; 
	}
	
	
	$("input#C_BOAT_NM").focus();
	$("#C_FROM").val(getToday());
	$("#C_TO").val(getToday());
	