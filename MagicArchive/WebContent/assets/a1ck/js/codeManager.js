	// ----------------------- 그리드 설정 시작 -------------------------------------

	// rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
	var jsVars1 = "rMateOnLoadCallFunction=gridReadyHandler1";
	var jsVars2 = "rMateOnLoadCallFunction=gridReadyHandler2";	
	//rMateGrid 관련 객체
	var collection1;	// 그리드의 데이터 객체
	var collection2;	// 그리드의 데이터 객체
	var cnt=0;
	var jsonObj = new Object();

	var gridData1 = [];
	var gridData2 = [];

	
	// rMateDataGrid 를 생성합니다.
	// 파라메터 (순서대로)
	//  1. 그리드의 id ( 임의로 지정하십시오. )
	//  2. 그리드가 위치할 div 의 id (즉, 그리드의 부모 div 의 id 입니다.)
	//  3. 그리드 생성 시 필요한 환경 변수들의 묶음인 jsVars
	//  4. 그리드의 가로 사이즈 (생략 가능, 생략 시 100%)
	//  5. 그리드의 세로 사이즈 (생략 가능, 생략 시 100%)
	rMateGridH5.create("grid1", "gridHolder1", jsVars1, "100%", "100%");
	rMateGridH5.create("grid2", "gridHolder2", jsVars2, "100%", "100%");

	// 그리드의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
	// rMate 그리드의 준비가 완료된 경우 이 함수가 호출됩니다.
	// 이 함수를 통해 그리드에 레이아웃과 데이터를 삽입합니다.
	// 파라메터 : id - rMateGridH5.create() 사용 시 사용자가 지정한 id 입니다.
	function gridReadyHandler1(id) {
		// rMateGrid 관련 객체
		gridApp1 = document.getElementById(id);	// 그리드를 포함하는 div 객체
		gridRoot1 = gridApp1.getRoot();	// 데이터와 그리드를 포함하는 객체

		gridApp1.setLayout(layoutStr);
		gridApp1.setData(gridData1);

		var layoutCompleteHandler1 = function(event) {
			dataGrid1 = gridRoot1.getDataGrid();	// 그리드 객체
		}
		/*
		// 사용자가 import를 완료하면 불려집니다.
		var dataCompleteHandler1 = function() {
			collection1 = gridRoot1.getCollection();
			gridMovePage1(1);
		}
*/
		refreshData1();
		
		gridRoot1.addEventListener("layoutComplete", layoutCompleteHandler1);
//		gridRoot1.addEventListener("dataComplete", dataCompleteHandler1);
		gridRoot1.addEvent("dblclick", dblclickHandler1);
	}

	function gridReadyHandler2(id) {
		// rMateGrid 관련 객체
		gridApp2 = document.getElementById(id);	// 그리드를 포함하는 div 객체
		gridRoot2 = gridApp2.getRoot();	// 데이터와 그리드를 포함하는 객체

		gridApp2.setLayout(layoutStr);
		gridApp2.setData(gridData2);

		var layoutCompleteHandler2 = function(event) {
			dataGrid2 = gridRoot2.getDataGrid();	// 그리드 객체
		}
		// 사용자가 import를 완료하면 불려집니다.
/*
		var dataCompleteHandler2 = function() {
			collection2 = gridRoot2.getCollection();
			gridMovePage2(1);
		}
*/
		gridRoot2.addEventListener("layoutComplete", layoutCompleteHandler2);
//		gridRoot2.addEventListener("dataComplete", dataCompleteHandler2);
		gridRoot2.addEvent("dblclick", dblclickHandler2);
	}	
	
	var gridApp1, gridRoot1;	// 데이터와 그리드를 포함하는 객체
	var dataGrid1;	// 그리드

	var gridApp2, gridRoot2;	// 데이터와 그리드를 포함하는 객체
	var dataGrid2;	// 그리드

	function moveRight() {
		var sIndexArr = dataGrid1.getSelectedIndices();
		if (sIndexArr == null || sIndexArr.length == 0)
			return;

		// 선택한 행을 오른쪽 rMateGrid에 삽입한다.
		var sItemArr = gridRoot1.clone(dataGrid.getSelectedItems());
		for (var i = 0; i < sItemArr.length; i++) {
			gridRoot2.addItemAt(sItemArr[i]);
		}
		// 삽입된 행 선택 및 필요시 scroll
		var gr2Length = gridRoot2.getCollection().getLength() - 1;
		var addedIndices = [];
		for (i = 0; i < sItemArr.length; i++) {
			addedIndices.push(gr2Length - i);
		}
		// setSelectedIndices는 timeout후 실행토록 함
		setTimeout(function() {
			dataGrid2.setSelectedIndices(addedIndices);
			dataGrid2.setVerticalScrollPosition(dataGrid2.getMaxVerticalScrollPosition());
		}, 100);
		// 선택한 행 삭제. 삭제는 뒤에서 부터 해야 합니다. 따라서 가장 큰 index번호부터 나오도록 sorting합니다.
		sIndexArr.sort(function(a,b){return a-b;});
		for (i = sIndexArr.length - 1; i >= 0; i--) {
			gridRoot.removeItemAt(sIndexArr[i]);
		}
	}

	function moveLeft() {
		var sIndexArr = dataGrid2.getSelectedIndices();
		if (sIndexArr == null || sIndexArr.length == 0)
			return;

		// 선택한 행을 왼쪽 rMateGrid에 삽입한다.
		var sItemArr = gridRoot2.clone(dataGrid2.getSelectedItems());
		for (var i = 0; i < sItemArr.length; i++) {
			gridRoot.addItemAt(sItemArr[i]);
		};
		// 삽입된 행 선택 및 필요시 scroll
		var grLength = gridRoot1.getCollection().getLength() - 1
		var addedIndices = [];
		for (i = 0; i < sItemArr.length; i++) {
			addedIndices.push(grLength - i);
		}
		// setSelectedIndices는 timeout후 실행토록 함
		setTimeout(function() {
			dataGrid1.setSelectedIndices(addedIndices);
			dataGrid1.setVerticalScrollPosition(dataGrid.getMaxVerticalScrollPosition());
		}, 100);
		// 선택한 행 삭제. 삭제는 뒤에서 부터 해야 합니다. 따라서 가장 큰 index번호부터 나오도록 sorting합니다.
		sIndexArr.sort(function(a,b){return a-b;});
		for (i = sIndexArr.length - 1; i >= 0; i--) {
			gridRoot2.removeItemAt(sIndexArr[i]);
		}
	}

	
	//레이아웃 로드 완료 이벤트 핸들러 함수
	function dblclickHandler1(event) {
//		console.log(dataGrid1.getSelectedItem());
//		console.log(dataGrid1.getSelectedItem().SERVER_IP);
//		console.log(dataGrid1.getSelectedIndex());
		if(dataGrid1.getSelectedIndex() >= 0 ) {
			$('#F_GROUP_CD').val(dataGrid1.getSelectedItem().GROUP_CD);
			$('#F_GROUP_NM').val(dataGrid1.getSelectedItem().GROUP_NM);
			$('input[name=F_USE_YN][value="' + dataGrid1.getSelectedItem().USE_YN + '"]').prop("checked", true);
			$('#CRUD').val("U");
		}
	}
	function dblclickHandler2(event) {
//		console.log(dataGrid1.getSelectedItem());
//		console.log(dataGrid1.getSelectedItem().SERVER_IP);
//		console.log(dataGrid1.getSelectedIndex());
		if(dataGrid2.getSelectedIndex() >= 0 ) {
			$('#F_GROUP_CD').val(dataGrid2.getSelectedItem().GROUP_CD);
			$('#F_GROUP_NM').val(dataGrid2.getSelectedItem().GROUP_NM);
			$('input[name=F_USE_YN][value="' + dataGrid2.getSelectedItem().USE_YN + '"]').prop("checked", true);
			$('#CRUD').val("U");
		}
	}

	
	function refreshData1()  
	{
		
		$('#CRUD1').val("C")
		
		$('input[name="F_USE_YN"]').val(["Y"]);	
		$('input[name="F_USE_SUB_YN"]').val(["Y"]);	

		
		jsonObj = {};
		jsonObj.__crud = 'R';
		jsonObj.__rows = '20';
		jsonObj.__page = '1';

		
		$.ajax({
		   	url:"GetCodeManager",
			data:{param:JSON.stringify(jsonObj)},
			type:"post",
		   	dataType:"json",
			success: function(json_data) {
				console.log(json_data);
				if(json_data.result == 'OK') {
			   		$.each(json_data.rows, function(index, value) {
			   			gridData1.push(value);
			   		});
				} else {
					console.log(json_data.result); 
				}
			}
		});	
		gridApp1.clear();
		gridApp1.setLayout(layoutStr);
		gridApp1.setData(gridData1);
	 }
    

	$('#btnQuery').click(function (e) {
		refreshData();
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
		$("input#F_SERVER_NM").focus();
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
		obj.use_yn = $('input[name="F_USE_YN"]:checked').val();	
		if(obj.use_yn !== 'Y' && obj.use_yn !== 'N')
			obj.use_yn = 'N';
		obj.crud        = $("input#CRUD").val();

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

	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.server_id   = $("input#F_SERVER_ID").val();
		obj.crud        = "D";
		
		var input = confirm('삭제하시겠습니까?'); 
		if(!input) return;

		if(obj.server_id == ''){
			alert("[알림] 서버를 선택하세요.");
			$("input#F_SERVER_NM").focus();
		    return;
		}
		
		console.log('F_SERVER_ID:'+ obj.server_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetServerForm").ajaxForm({
			url : 'SetServer',
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
		$("#SetServerForm").submit() ;
	});
	
	

	//----------------------- 그리드 설정 끝 -----------------------

	var layoutStr =
	'<rMateGrid>\
		<NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
		<DataGrid id="dg1" verticalAlign="middle" sortableColumns="true" textAlign="center">\
			<columns>\
				<DataGridColumn dataField="ID" id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
				<DataGridColumn dataField="GROUP_CD" id="colServerId" width="80"/>\
				<DataGridColumn dataField="GROUP_NM" id="colServerNm" width="200"/>\
				<DataGridColumn dataField="USE_YN" id="colUseYn" width="80"/>\
			</columns>\
		</DataGrid>\
	</rMateGrid>';

	// 페이징 관련 자바스크립트
	var gridTotalRowCount;	// 전체 데이터 건수 - html이 서버에서 작성될때 반드시 넣어줘야 하는 변수입니다.

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
			gridPageNavigationDiv1.innerHTML = "<span class='gridPagingDisable'>" + gridStartTxt + "</span> <span class='gridPagingDisable'>" + gridPrevTxt + "</span> <span class='gridPagingDisable'>" + gridNextTxt + "</span> <span class='gridPagingDisable'>" + gridEndTxt + "</span>";
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
		gridPageNavigationDiv1.innerHTML = retStr;
	}

	function gridMovePage1(goPage) {
		gridTotalRowCount = collection1.getTotalLength();
		gridRowsPerPage = collection1.getRowsPerPage();
		gridTotalPage = collection1.getTotalPageCount();
		gridCurrentPage = goPage <= gridTotalPage ? goPage : gridTotalPage;

		drawGridPagingNavigation(gridCurrentPage);
		collection1.setCurrentPage(gridCurrentPage);
		var colNo = gridRoot1.getObjectById("colNo");
		if (colNo)
			colNo.indexStartNo = (gridCurrentPage - 1) * gridRowsPerPage + 1;
	}
	
