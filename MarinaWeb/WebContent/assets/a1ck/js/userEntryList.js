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
			$('#F_USER_CD').val(dataGrid.getSelectedItem().USER_CD);
			$('#F_USER_NM').val(dataGrid.getSelectedItem().USER_NM);
			$('#F_TELEPHONE').val(dataGrid.getSelectedItem().TELEPHONE);
			$('#F_EMAIL').val(dataGrid.getSelectedItem().EMAIL);
			$('#F_USER_ID').val(dataGrid.getSelectedItem().USER_ID);
			$('#F_APPROWAITCNT').val(dataGrid.getSelectedItem().APPROWAITCNT);
			$('#F_PASSWORD').val(dataGrid.getSelectedItem().PASSWORD);
			$('#F_PASSWORDORG').val(dataGrid.getSelectedItem().PASSWORDORG);
			$('input[name=F_USE_YN][value="' + dataGrid.getSelectedItem().USE_YN + '"]').prop("checked", true);
			$('#CRUD').val("U");
			$('#F_USER_CD').attr('readonly', true);
			
	        if ( dataGrid.getSelectedItem().PICTURE.trim() == "" || dataGrid.getSelectedItem().PICTURE == 'null' ) { 
	        	//console.log('111111');
	        	$('#F_PICTURE').attr('src', "assets/images/" + "200x150.png");
	        	$('.fileinput .fileinput-preview img').attr('src', "assets/images/" + "200x150.png");
	        } else {
	        	//console.log('222222');
	        	$('#F_PICTURE').attr('src', "userImages/" + dataGrid.getSelectedItem().PICTURE);
	        	$('.fileinput .fileinput-preview img').attr('src', "userImages/" + dataGrid.getSelectedItem().PICTURE);
	        }
			
		}
	}

	function refreshData()  
	{
		var gridData = [];

		jsonObj.__user_cd = $('#C_USER_CD').val();
		jsonObj.__user_nm = $('#C_USER_NM').val();
		jsonObj.__from    = $('#C_FROM').val();
		jsonObj.__to      = $('#C_TO').val();
		jsonObj.__rows    = "20";
		jsonObj.__page    = "1" ;

		$.ajax({
		   	url:"GetUserEntryList",
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
	

	$('#f_picture_preview').change(function(){
 
		var filesize = this.files[0].size/1024/1024;
		if(filesize >= 5) {
			alert("[알림] 첨부파일 사이즈는 5MB 이내로 등록하세요.");
			$("input#F_USER_CD").focus();
		    return;			
		}
 
	});
	
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
			"년간 매출 보고서",	// 문자열 하나를 기본 제목 스타일로 넣을 경우
			null,							// 빈라인 - 행 높이는 DataGrid의 exportTitleHeight를 따릅니다.
			{height:25, fontSize:12, color:"#444444", borderColor:"#999999",	// cells 에 개별 셀에 대한 내용을 정의하는 경우
				cells: [
					{text:"", colSpan:7},
					null,
					null,
					null,
					null,
					null,
					null,
					{text:"담당", border:true},
					{text:"과장", border:true},
					{text:"부장", border:true},
					{text:"대표이사", border:true}
				]
			},
			{height:70, borderColor:"#999999",
				cells: [
					{text:"", colSpan:7},
					null,
					null,
					null,
					null,
					null,
					null,
					{text:"", border:true},
					{text:"", border:true},
					{text:"", border:true},
					{text:"", border:true}
				]
			},
			{height:20, text:""},
			{height:30, fontSize:14, color:"#333333", text:"아래와 같이 년간 매출을 보고합니다."},		// ojbect로 한 행의 속성을 정의한 경우
			{height:20, text:""}
		];
		// 엑셀문서의 꼬릿말라인들을 지정합니다.
		dataGrid.exportFooters = [
			{height:14, text:""},
			{height:18, fontSize:10, color:"#888888", textAlign:"left", backgroundColor:"#EEEEEE", text:"이 문서는 대외비입니다. 외부에 유출이 안되도록 유의해 주시기 바랍니다."},		// 행의 속성을 정의하여 넣습니다.
			null,									// 빈라인 - 라인 높이는 DataGrid의 exportFooterHeight를 따릅니다.
			//inputForm.exportFooter.value,			// 화면에서 넣은 값을 넣어주는 경우.
			"1111111111111111",			// 화면에서 넣은 값을 넣어주는 경우.
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
		gridRoot.excelExportSave("http://demo.riamore.net/demo/grid/saveExcel.jsp", false);
	}

	//----------------------- 그리드 설정 끝 -----------------------

	var layoutStr =
	'<rMateGrid>\
		<NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
		<DataGrid id="dg1" verticalAlign="middle" sortableColumns="true" textAlign="center">\
			<groupedColumns>\
				<DataGridColumn dataField="No" id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
				<DataGridColumn dataField="REG_DATE" id="colRegDate" headerText="일자"  width="100"     />\
				<DataGridColumn dataField="DVC_NM" 	 id="colDvcNm"   headerText="장치"  width="100"/>\
				<DataGridColumn dataField="USER_NM"  id="colUserNm"  headerText="이름"  width="100"/>\
				<DataGridColumn dataField="STATUS"   id="colStatus"  headerText="상태"  width="100"/>\
			</groupedColumns>\
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
	

	$("input#F_USER_CD").focus();
	$("#C_FROM").val(getToday());
	$("#C_TO").val(getToday());
	