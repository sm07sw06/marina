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

<title>스마트 마리나항만 불법계류 통합안전관리 시스템</title>

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
<link rel="stylesheet" type="text/css" href="./assets/a1ck/css/a1ckRef.css">	

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
						<div class="col-lg-12">
							<div class="col-sm-8" >
						        <input class="icheck-13" type="radio" id="C_USE_Y" name="C_USE_YN" value="Y" checked>
						        <label for="C_USE_YN">사용</label>&nbsp;&nbsp;
						        <input class="icheck-13" type="radio" id="C_USE_N" name="C_USE_YN" value="N" >
						        <label for="C_USE_YN">미사용</label>&nbsp;&nbsp;
						        <input class="icheck-13" type="radio" id="C_USE_A" name="C_USE_YN" value="A" >
						        <label for="C_USE_YN">전체</label>
						        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>&nbsp;&nbsp;
								<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">신규</button>&nbsp;&nbsp;
								<button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red">삭제</button>&nbsp;&nbsp;
								<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
							</div>
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
							<div id="gridHolder" style="width:100%; height:600px;"></div>
							<div class="gridPaging" id="gridPageNavigationDiv"></div>
						</div>
							
						</div>
					</div>
					<!--  left list end -->
									
					<!--  right info start -->
					<div id="detail-area" class="col-lg-4 container-fluid" style="height:600px;">	  
					 
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
											<input type="text" class="form-control" id="F_SERVER_ID" readonly>
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
									        <input class="icheck-13" type="radio" id="F_USE_Y" name="F_USE_YN" value="Y">
									        <label>사용</label>
									        <input class="icheck-13" type="radio" id="F_USE_N" name="F_USE_YN" value="N">
									        <label>미사용</label>
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