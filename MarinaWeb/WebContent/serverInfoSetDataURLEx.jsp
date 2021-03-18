<!DOCTYPE html>
<%@ page contentType="text/html;charset=utf-8"%>
<jsp:useBean id="codeClass" class="com.a1ck.util.CodeClass" scope="page"/>

<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="Neon Admin Panel" />
<meta name="author" content="" />

<link rel="icon" href="assets/images/favicon.ico">

<title>Magic Archive</title>

<link rel="stylesheet" href="assets/jquery-ui-1.12.1.custom/jquery-ui.min.css">


<link rel="stylesheet" href="assets/css/font-icons/entypo/css/entypo.css">
<link rel="stylesheet" href="assets/css/bootstrap.css">

<!-- Imported styles on this page -->
<link rel="stylesheet" href="assets/a1ck/css/neon-core.css">
<link rel="stylesheet" href="assets/a1ck/css/neon-theme.css">
<link rel="stylesheet" href="assets/a1ck/css/neon-forms.css">
<link rel="stylesheet" href="assets/a1ck/css/custom.css">

<link rel="stylesheet" href="assets/js/datatables/datatables.css">
<link rel="stylesheet" href="assets/js/select2/select2-bootstrap.css">
<link rel="stylesheet" href="assets/js/select2/select2.css">


<link rel="stylesheet" href="assets/a1ck/css/a1ck.css">	
	
<script src="assets/js/jquery-1.12.4.js"></script>
<script src="assets/js/jquery.form.js"></script>
<script src="assets/jquery-ui-1.12.1.custom/jquery-ui.js"></script>
<link rel="stylesheet" type="text/css" href="jqgrid/css/ui.jqgrid.css"/>

<script type="text/javascript" src="jqgrid/js/i18n/grid.locale-kr.js"></script>
<script type="text/javascript" src="jqgrid/js/jquery.jqGrid.min.js"></script>

	
		 
<script src="assets/js/bootstrap.js"></script>

	
<!--[if lt IE 9]><script src="assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->


<!-- rMateGridH5 CSS -->
<link rel="stylesheet" type="text/css" href="./rMateGridH5/Assets/rMateH5.css"/>
<!-- rMateGridH5 라이센스 -->
<script type="text/javascript" src="./LicenseKey/rMateGridH5License.js"></script>
<!-- rMateGridH5 라이브러리 -->
<script type="text/javascript" src="./rMateGridH5/JS/rMateGridH5.js"></script>

<!-- 페이징 관련 스타일 -->
<style type="text/css">
.gridPaging { text-align:center; font-family:verdana; font-size:12px; width:100%; padding-top:15px; }
.gridPaging a { color:#797674; text-decoration:none; border:1px solid #e0e0e0; background-color:#f6f4f4; padding:3px 5px 3px 5px;}
.gridPaging a:link { color:#797674; text-decoration:none; }
.gridPaging a:visited { color:#797674; text-decoration:none; }
.gridPaging a:hover { text-decoration:none; border:1px solid #7a8ba2; text-decoration:none; }
.gridPaging a:active { text-decoration:none; }
.gridPagingMove { font-weight:bold; }
.gridPagingDisable { font-weight:bold; color:#cccccc; border:1px solid #e0e0e0; background-color:#f6f4f4; padding:3px 5px 3px 5px;}
.gridPagingCurrent { font-weight:bold; color:#ffffff; border:1px solid #2f3d64; background-color:#2f3d64; padding:3px 5px 3px 5px;}
</style>

<script type="text/javascript">

		// ----------------------- 그리드 설정 시작 -------------------------------------
		 
		// rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
		var jsVars = "rMateOnLoadCallFunction=gridReadyHandler";
		 
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
		    // rMateGrid 관련 객체
		    gridApp = document.getElementById(id);  // 그리드를 포함하는 div 객체
		    gridRoot = gridApp.getRoot();   // 데이터와 그리드를 포함하는 객체
		 
		    gridApp.setLayout(layoutStr);
		    
		    gridMovePage(gridCurrentPage);
// 		    gridApp.setDataURLEx("GetServerList");
		}
		// rMateGrid 관련 객체
		var gridApp, gridRoot;	// 데이터와 그리드를 포함하는 객체
		var dataGrid;	// 그리드
		var collection;	// 그리드의 데이터 객체
		//----------------------- 그리드 설정 끝 -----------------------
		
		// 전체 삭제
		function removeAll() {
		    gridRoot.removeAll();
		//  inputForm.itemXMLData.value = "";
		    inputForm.rowIndex.value = "0";
		}
		 
		// 행 삭제
		function removeItemAt() {
		    var selectedIndex = dataGrid.getSelectedIndex();
		    gridRoot.removeItemAt(selectedIndex);
		}
		 
		// 행 수정
		function setItemAt() {
		    if (!inputForm.Region.value)
		        alert("수정할 데이터를 필드에 입력해주시기 바랍니다.");
		    else {
		        var item = {
		            "Region": inputForm.Region.value,
		            "Territory": inputForm.Territory.value,
		            "Territory_Rep": inputForm.Territory_Rep.value,
		            "Actual": inputForm.Actual.value,
		            "Estimate": inputForm.Estimate.value,
		            "Real": inputForm.Real.value,
		            "Price": inputForm.Price.value
		        };
		        gridRoot.setItemAt(item, inputForm.rowIndex.value);
		    }
		}
		 
		// 행 추가
		function addItemAt() {
		    var item = {
		        "Region": inputForm.Region.value,
		        "Territory": inputForm.Territory.value,
		        "Territory_Rep": inputForm.Territory_Rep.value,
		        "Actual": inputForm.Actual.value,
		        "Estimate": inputForm.Estimate.value,
		        "Real": inputForm.Real.value,
		        "Price": inputForm.Price.value
		    };
		    gridRoot.addItemAt(item, inputForm.rowIndex.value);
		    girdMoveSelctedIndex(inputForm.rowIndex.value);
		}
		 
		// 맨끝에 행 추가
		function addItem() {
		    var item = {
		        "Region": inputForm.Region.value,
		        "Territory": inputForm.Territory.value,
		        "Territory_Rep": inputForm.Territory_Rep.value,
		        "Actual": inputForm.Actual.value,
		        "Estimate": inputForm.Estimate.value,
		        "Real": inputForm.Real.value,
		        "Price": inputForm.Price.value
		    };
		    gridRoot.addItemAt(item);
		    girdMoveSelctedIndex();
		}
		 
		// 그리드의 selctedIndex를 전달된 행으로 이동
		function girdMoveSelctedIndex(idx) {
		    // addItemAt나 removeItemAt후에 바로 selctedIndex를 변경하면 무시되는 경우가 발생하여 setTimeout로 지연후 실행토록 함
		    setTimeout("gridSetSelectedIndex("+idx+")", 100);
		}
		 
		function gridSetSelectedIndex(idx) {
		    // 현재 그리드의 verticalScrollPosition을 조사하여 스크롤을 일으킬지 조사하여 필요시 세팅
		    var verticalScrollPosition = dataGrid.getVerticalScrollPosition();
		    // 그리드의 행수를 가져옵니다 (이 값은 화면에 제대로 표시되지 않는 행을 포함하기 때문에 실제와 다른 값으로 보일 수 있으며, DataGrid의 variableRowHeight가 true일 경우에는 추정치를 의미합니다.
		    var rowCount = dataGrid.getRowCount();
		    if (rowCount > 0)
		        rowCount = rowCount - 1;
		    var halfRowCount = (rowCount / 2).toFixed();
		 
		    // idx가 값이 없는 경우 collection에서 현재 데이터의 레코드수를 가져와 맨 마지막 행값을 계산.
		    if (idx == null || idx == undefined) {
		        if (!collection)
		            collection = gridRoot.getCollection();
		        idx = collection.getLength() - 1;
		    }
		    dataGrid.setSelectedIndex(idx);
		    if (idx < verticalScrollPosition || idx > verticalScrollPosition + rowCount) {
		        if (idx - halfRowCount >= 0) // 화면 중간에 위치하도록 계산
		            dataGrid.setVerticalScrollPosition(idx - halfRowCount);
		        else
		            dataGrid.setVerticalScrollPosition(0);
		    }
		}
		 
		// 수정 작업 결과 가져오기 (그리드에서 작업된 입력,수정,삭제 내용을 가져옵니다)
		// 데이터는 배열 형태로
		//  idx: 행번호
		//  job: 수행 작업 (I:입력, U:수정, D:삭제)
		//  data: 행의 자료
		// 를 가지고 있으며 삭제가 먼저 오도록 정렬되어 있습니다.
		function getChangedData() {
		    var changedData = gridRoot.getChangedData();
		    if (changedData.length == 0)
		        if ( gridRoot.getRemoveAllData() ) {
		            alert("전체 삭제");
		        } else
		            alert("변경된 자료가 없습니다");
		    else {
		        for (var i = 0; i < changedData.length; i++)
		            alert("index:"+changedData[i].idx+"\n"+"job:"+changedData[i].job+"\n"+"data:"+changedData[i].data);
		    }
		}
		 
		// 수정 작업 결과 XML로 가져오기 (그리드에서 작업된 입력,수정,삭제 내용을 XML로 가져옵니다)
		// 데이터는 XML 형태로
		//  idx: 행번호
		//  job: 수행 작업 (I:입력, U:수정, D:삭제)
		//  data: 행의 자료
		// node를 가지고 있으며 삭제가 먼저 오도록 정렬되어 있습니다.
		function getChangedDataXML() {
		    var changedDataXML = gridRoot.getChangedDataXML();
		    if (changedDataXML == null)
		        if ( gridRoot.getRemoveAllData() ) {
		            alert("전체 삭제");
		        } else
		            alert("변경된 자료가 없습니다");
		    else
		        alert(changedDataXML);
		}
		 

		var layoutStr =
'<rMateGrid>\
    <NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
    <DataGrid id="dg1" horizontalScrollPolicy="auto" verticalAlign="middle" selectionMode="multipleRows" sortableColumns="false" textAlign="center">\
        <columns>\
            <DataGridColumn dataField="No" id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
            <DataGridColumn dataField="From" width="80"/>\
            <DataGridColumn dataField="Subject" width="200"/>\
            <DataGridColumn dataField="Length" width="110" textAlign="right" formatter="{numfmt}"/>\
            <DataGridColumn dataField="ReceiveDate" headerText="Receive" width="150" />\
            <DataGridColumn dataField="CC"/>\
            <DataGridColumn dataField="AttachCount" width="60" textAlign="right" formatter="{numfmt}"/>\
        </columns>\
    </DataGrid>\
</rMateGrid>';

//페이징 관련 자바스크립트
var gridTotalRowCount = 580;	// 전체 데이터 건수 - html이 서버에서 작성될때 반드시 넣어줘야 하는 변수입니다.

var gridRowsPerPage = 20;	// 1페이지에서 보여줄 행 수
var gridViewPageCount = 10;		// 페이지 네비게이션에서 보여줄 페이지의 수
var gridCurrentPage = 1;	// 현재 페이지
var gridTotalPage = Math.ceil(gridTotalRowCount / gridRowsPerPage);	// 전체 페이지 계산

//화면에 표시할 맨앞으로 와 맨뒤로, 앞으로, 뒤로 문구 - 이미지를 쓸 경우 img 태그로 대체
var gridStartTxt = "≪";
var gridEndTxt = "≫";
var gridPrevTxt = "◀";
var gridNextTxt = "▶";
var gridPageGapTxt = " ";	// 페이지 사이의 구분을 위한 문자 - 사용하지 않을 경우 공백을 넣습니다.

//주어진 페이지 번호에 따라 페이지 네비게이션 html을 만들고 gridPageNavigationDiv에 innerHTML로 넣어줍니다.
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
	gridCurrentPage = goPage <= gridTotalPage ? goPage : gridTotalPage;
	// 테스트를 위해 리아모어 서버에 예를 넣어 두었습니다. 개발후 실제 url로 변경하시기 바랍니다.
	gridApp.setDataURLEx("http://demo.riamore.net/bbs/gridPagingData.jsp?page="+gridCurrentPage);  //GetServerList
	drawGridPagingNavigation(gridCurrentPage);
	var colNo = gridRoot.getObjectById("colNo");
	if (colNo)
		colNo.indexStartNo = (gridCurrentPage - 1) * gridRowsPerPage + 1;
}


		</script>


</head>

<body class="page-body" data-url="http://neon.dev">

	<div class="page-container"><!-- add class "sidebar-collapsed" to close sidebar by default, "chat-visible" to make chat appear always -->

	<!-- menu start -->
	<%@ include file="menuInfo.jsp" %>
	<!-- menu end-->

		<div class="main-content">
					
			<!-- header start -->
			<%@ include file="headerInfo.jsp" %>
			<!-- header end-->
						
			<ol class="breadcrumb bc-3" >
				<li><a href="index.jsp"><i class="fa-home"></i>Home</a></li>
				<li><a href="#">기초등록</a></li>
				<li class="active"><strong>서버관리</strong></li>
			</ol>
	
			<div class='myTitleBox'>서버관리</div>
				<!--  search form start -->
				<div class=" search_cond col-lg-12">
					<form class="search-form"> 
						<div class="col-lg-8">
							<div class="col-sm-8" >
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="Y">
						        <label for="C_USE_YN">사용</label>
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="N">
						        <label for="C_USE_YN">미사용</label>
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="A">
						        <label for="C_USE_YN">전체</label>
							</div>
							<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>
							<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">신규</button>
							<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
							<!-- <button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red" >삭제</button> -->
						</div>
					</form>
				</div>
				<!--  search form end --> 

				<!-- main-sub-content start-->
				<div class="main-sub-content" >
				
					<!--  left list start -->
					<div class="col-lg-8">										
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel body -->
	<div class="content">
		<!-- 그리드가 삽입될 DIV -->
		<div id="gridHolder" style="width:100%; height:400px;"></div>
		<div class="gridPaging" id="gridPageNavigationDiv"></div>
	</div>
		
						</div>
					</div>
					<!--  left list end -->
									
					<!--  right info start -->
					<div id="detail-area" class="col-lg-4 container-fluid">	  
					 
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">서버정보 상세</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetServerForm" id="SetServerForm"  class="form-horizontal validate" action="" >
							
									<input type="hidden" class="form-control" id="CRUD" name="CRUD"  value="U">
									<input type="hidden" class="form-control" id="ROWID" name="ROWID"  >
							
									<div class="form-group">
										<label for="f_name" class="col-sm-3 control-label">서버ID</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_SERVER_ID" >
										</div>
									</div>
																	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">서버명</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_SERVER_NM"   >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">서버IP</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_SERVER_IP"  >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">종류</label>
										<input type="hidden" class="form-control" id="F_SERVER_CLASS_NM"  >
										<div class="col-sm-8" >
											<select class="form-control" id="F_SERVER_CLASS_CD" >
												<%=codeClass.getComboBoxByCodeList("SERVER_CLASS_CD", "", true) %>
											</select>
										</div>
									</div>

									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">설명</label>
										<div class="col-sm-8">
											<textarea class="form-control wysihtml5" rows="4" data-stylesheet-url="assets/css/wysihtml5-color.css" name="F_SERVER_DESC" id="F_SERVER_DESC" ></textarea>
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">사용여부</label>

										<div class="col-sm-8" >
									        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="Y">
									        <label for="F_USE_YN">사용</label>
									        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="N">
									        <label for="F_USE_YN">미사용</label>
										</div>
									</div>
									
								</form>
							</div> <!-- panel-body  -->
						</div> <!--  id="pannel"  -->
					</div> <!--  id="detail-area"  -->
					<!--  right info start -->
					
				</div>
				<!-- main-sub-content end-->
			</div> <!-- myTitleBox -->
			
			
			<!-- Footer start-->
			<%@ include file="footerInfo.jsp" %>
			<!-- Footer end-->
		</div> <!--main-content -->
	</div>


	<!-- Bottom scripts (common) -->
	<script src="assets/js/gsap/TweenMax.min.js"></script>
	<script src="assets/js/resizeable.js"></script>
	<script src="assets/js/neon-api.js"></script>
 
	<!-- Imported scripts on this page -->
	<script src="assets/js/jquery.dataTables.min.js"></script>
	<script src="assets/js/select2/select2.min.js"></script>
	<script src="assets/a1ck/js/a1ck_joinable.js"></script>
	<script src="assets/a1ck/js/a1ck_fileinput.js"></script>
	<script src="assets/js/dropzone/dropzone.js"></script>
	<script src="assets/js/neon-chat.js"></script>
	<!-- 
	<script src="assets/js/datatables/datatables.js"></script>
	 -->
	
	<!-- JavaScripts initializations and stuff -->
	<script src="assets/js/neon-custom.js"></script>
	<script>
		var sessionsabun = "<%=userid%>";
	</script>
	<!-- Demo Settings -->
	<!-- script src="assets/js/neon-demo.js"></script -->
	<script src="assets/a1ck/js/a1ck-js.js"></script>		
	<script src="assets/a1ck/js/serverInfo.js"></script>

</body>
</html>