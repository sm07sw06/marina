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
		    gridApp.setData(gridData);
		 
		    var selectionChangeHandler = function(event) {
		        var rowIndex = event.rowIndex;
		        if (rowIndex < 0)    // column header
		            return;
		        var columnIndex = event.columnIndex;
		        var dataRow = gridRoot.getItemAt(rowIndex);
		        inputForm.Region.value = dataRow["Region"];
		        inputForm.Territory.value = dataRow["Territory"];
		        inputForm.Territory_Rep.value = dataRow["Territory_Rep"];
		        inputForm.Actual.value = dataRow["Actual"];
		        inputForm.Estimate.value = dataRow["Estimate"];
		        inputForm.Real.value = dataRow["Real"];
		        inputForm.Price.value = dataRow["Price"];
		        inputForm.rowIndex.value = rowIndex;
		        // 컬럼중 숨겨진 컬럼(visible false인 컬럼)이 있으면 getDisplayableColumns()를 사용하여 컬럼을 가져옵니다.
		        var column = dataGrid.getDisplayableColumns()[columnIndex];
		        var dataField = column.getDataField();
		    }
		 
		    var layoutCompleteHandler = function(event) {
		        dataGrid = gridRoot.getDataGrid();  // 그리드 객체
		        dataGrid.addEventListener("change", selectionChangeHandler);
		    }
		 
		    gridRoot.addEventListener("layoutComplete", layoutCompleteHandler);
		}
		var gridApp, gridRoot, dataGrid, collection;
		 
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
		 
		//----------------------- 그리드 설정 끝 -----------------------

		var layoutStr =
'<rMateGrid>\
<NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
<PercentFormatter id="percfmt"/>\
<DataGrid id="dg1" sortableColumns="true" headerHeight="50" rowHeight="30" draggableColumns="true" showHeaders="true" horizontalScrollPolicy="auto" variableRowHeight="false" selectionMode="singleRow">\
<columns>\
<DataGridColumn id="dg1col1" dataField="Year" textAlign="center"/>\
<DataGridColumn id="dg1col2" dataField="Quarter" 	textAlign="center"/>\
	<DataGridColumn id="dg1col3" dataField="Month" 	textAlign="center"/>\
	<DataGridColumn id="dg1col4" dataField="Seoul" 	textAlign="right" formatter="{numfmt}"/>\
	<DataGridColumn id="dg1col5" dataField="Pusan" 	textAlign="right" formatter="{numfmt}"/>\
	<DataGridColumn id="dg1col6" dataField="Incheon" 	textAlign="right" formatter="{numfmt}"/>\
	<DataGridColumn id="dg1col7" dataField="NewYork" 	textAlign="right" formatter="{numfmt}"/>\
	<DataGridColumn id="dg1col8" dataField="LA" textAlign="right" 	formatter="{numfmt}"/>\
	<DataGridColumn id="dg1col9" dataField="Washington" 	textAlign="right" formatter="{numfmt}"/>\
	<DataGridColumn id="dg1col10" dataField="Revenue" 	textAlign="right" formatter="{numfmt}"/>\
	<DataGridColumn id="dg1col11" dataField="Percent" width="80" 	textAlign="right" formatter="{percfmt}"/>\
	</columns>\
	</DataGrid>\
	</rMateGrid>';

	
		var gridData = [{"Year":2007, "Quarter":"1/4", "Month":1, "Seoul":109520,
						"Pusan":40454, "Incheon":82477, "NewYork":47424, "LA":103225, "Washington":61161,
						"Revenue":444260, "Percent":40},
						{"Year":2007, "Quarter":"1/4", "Month":2, "Seoul":15749, "Pusan":29714,
						"Incheon":31393, "NewYork":45006, "LA":17945, "Washington":90148,
						"Revenue":229956, "Percent":20},
						{"Year":2007, "Quarter":"1/4", "Month":3, "Seoul":14766, "Pusan":97314,
						"Incheon":103216, "NewYork":86072, "LA":52863, "Washington":93789,
						"Revenue":448020, "Percent":40},
						{"Year":2007, "Quarter":"2/4", "Month":4, "Seoul":52352, "Pusan":56859,
						"Incheon":15688, "NewYork":65438, "LA":39181, "Washington":109514,
						"Revenue":339031, "Percent":31},
						{"Year":2007, "Quarter":"2/4", "Month":5, "Seoul":100842, "Pusan":30391,
						"Incheon":23745, "NewYork":72742, "LA":102195, "Washington":30407,
						"Revenue":360322, "Percent":33},
						{"Year":2007, "Quarter":"2/4", "Month":6, "Seoul":19217, "Pusan":75298,
						"Incheon":70807, "NewYork":36447, "LA":100805, "Washington":84934,
						"Revenue":387508, "Percent":36},
						{"Year":2007, "Quarter":"3/4", "Month":7, "Seoul":74324, "Pusan":64947,
						"Incheon":101350, "NewYork":34673, "LA":24486, "Washington":57781,
						"Revenue":357561, "Percent":28},
						{"Year":2007, "Quarter":"3/4", "Month":8, "Seoul":85932, "Pusan":95733,
						"Incheon":40327, "NewYork":69255, "LA":80024, "Washington":102739,
						"Revenue":474011, "Percent":37},
						{"Year":2007, "Quarter":"3/4", "Month":9, "Seoul":101804, "Pusan":65098,
						"Incheon":79194, "NewYork":101669, "LA":30608, "Washington":73020,
						"Revenue":451393, "Percent":35},
						{"Year":2007, "Quarter":"4/4", "Month":10, "Seoul":92130, "Pusan":91881,
						"Incheon":45166, "NewYork":65524, "LA":45348, "Washington":72708,
						"Revenue":412757, "Percent":36},
						{"Year":2007, "Quarter":"4/4", "Month":11, "Seoul":80925, "Pusan":70537,
						"Incheon":25347, "NewYork":29360, "LA":76296, "Washington":42766,
						"Revenue":325230, "Percent":29},
						{"Year":2007, "Quarter":"4/4", "Month":12, "Seoul":99008, "Pusan":30598,
						"Incheon":99124, "NewYork":22776, "LA":107805, "Washington":38384,
						"Revenue":397696, "Percent":35},
						{"Year":2008, "Quarter":"1/4", "Month":1, "Seoul":68503, "Pusan":10155,
						"Incheon":47908, "NewYork":60857, "LA":104179, "Washington":109097,
						"Revenue":400699, "Percent":31},
						{"Year":2008, "Quarter":"1/4", "Month":2, "Seoul":80573, "Pusan":75743,
						"Incheon":107750, "NewYork":76243, "LA":79265, "Washington":85345,
						"Revenue":504918, "Percent":40},
						{"Year":2008, "Quarter":"1/4", "Month":3, "Seoul":23435, "Pusan":30538,
						"Incheon":86528, "NewYork":36735, "LA":96031, "Washington":96928,
						"Revenue":370196, "Percent":29},
						{"Year":2008, "Quarter":"2/4", "Month":4, "Seoul":35657, "Pusan":109415,
						"Incheon":45569, "NewYork":87683, "LA":92773, "Washington":53422,
						"Revenue":424520, "Percent":45},
						{"Year":2008, "Quarter":"2/4", "Month":5, "Seoul":50140, "Pusan":30142,
						"Incheon":83992, "NewYork":87292, "LA":72324, "Washington":32520,
						"Revenue":356410, "Percent":37},
						{"Year":2008, "Quarter":"2/4", "Month":6, "Seoul":39458, "Pusan":10848,
						"Incheon":10553, "NewYork":48474, "LA":25642, "Washington":36591,
						"Revenue":171565, "Percent":18},
						{"Year":2008, "Quarter":"3/4", "Month":7, "Seoul":33761, "Pusan":49046,
						"Incheon":31351, "NewYork":46829, "LA":97148, "Washington":42630,
						"Revenue":300765, "Percent":31},
						{"Year":2008, "Quarter":"3/4", "Month":8, "Seoul":89645, "Pusan":72565,
						"Incheon":23678, "NewYork":78847, "LA":62559, "Washington":87722,
						"Revenue":415017, "Percent":42},
						{"Year":2008, "Quarter":"3/4", "Month":9, "Seoul":14844, "Pusan":30709,
						"Incheon":83037, "NewYork":23130, "LA":65006, "Washington":48367,
						"Revenue":265093, "Percent":27},
						{"Year":2008, "Quarter":"4/4", "Month":10, "Seoul":30598, "Pusan":55523,
						"Incheon":90576, "NewYork":79997, "LA":71346, "Washington":63569,
						"Revenue":391608, "Percent":34},
						{"Year":2008, "Quarter":"4/4", "Month":11, "Seoul":64461, "Pusan":61341,
						"Incheon":74479, "NewYork":10715, "LA":40404, "Washington":93611,
						"Revenue":345011, "Percent":30},
						{"Year":2008, "Quarter":"4/4", "Month":12, "Seoul":99229, "Pusan":95468,
						"Incheon":108828, "NewYork":27176, "LA":28673, "Washington":54816,
						"Revenue":414191, "Percent":36}];
	</script>
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