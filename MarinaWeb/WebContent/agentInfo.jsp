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
				<li class="active"><strong>Agent 관리</strong></li>
			</ol>
	
			<div class='myTitleBox'>Agent 관리</div>
				<!--  search form start -->
				<div class=" search_cond col-lg-12">
					<form class="search-form"> 
						<div class="col-lg-12">
								<select style="height:31px"  id="C_SERVER_ID" >
									<option value="0">서버를 선택하세요.</option>
									<%=codeClass.getComboBoxByServer("", true) %>									
								</select>
								&nbsp;&nbsp;
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="Y">
						        <label for="C_USE_YN">사용</label>
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="N">
						        <label for="C_USE_YN">미사용</label>
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="A">
						        <label for="C_USE_YN">전체</label>
						        &nbsp;&nbsp;

							<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>
							<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">신규</button>
							<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
							<!-- <button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red" >삭제</button> -->
							&nbsp;&nbsp;
							<button onclick="return false;" id="btnStart"   class="btn btn-sm btn-default">시작</button>
							<button onclick="return false;" id="btnStop"    class="btn btn-sm btn-default">종료</button>
							<button onclick="return false;" id="btnReStart" class="btn btn-sm btn-default">재시작</button>
							<button onclick="return false;" id="btnRefresh" class="btn btn-sm btn-default" >갱신</button>

						</div>
					</form>
				</div>
				<!--  search form end --> 

				<!-- main-sub-content start-->
				<div class="main-sub-content" >
				
					<!--  left list start -->
					<div class="col-lg-8">										
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">Agent 목록</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							<!-- panel body -->
							<div class="panel-body">
								<div id= "tableDivID">
									<table id="jqGrid"></table>
								    <div id="jqGridPager"></div>
								</div>
							</div>
						</div>
					</div>
					<!--  left list end -->
									
					<!--  right info start -->
					<div id="detail-area" class="col-lg-4 container-fluid">	  
					 
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">Agent정보 상세</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetAgentForm" id="SetAgentForm"  class="form-horizontal validate" action="" >
							
									<input type="hidden" class="form-control" id="CRUD" name="CRUD"  value="U">
									<input type="hidden" class="form-control" id="ROWID" name="ROWID"  >
				
									<div class="form-group">
										<label for="f_name" class="col-sm-3 control-label">AgentID</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_AGENT_ID" placeholder="AgentID ">
										</div>
									</div>
																	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">Agent명</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_AGENT_NM" placeholder="Agent명"  >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">AgentPort</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_AGENT_PORT" placeholder="AgentPort"  >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">계정</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_ACCOUNT_CD" placeholder="계정" >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">비밀번호</label>
										<div class="col-sm-8">
											<input type="password" class="form-control" id="F_PASSWORD" placeholder="비밀번호" >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">경로</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_PATH" placeholder="경로" >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">설명</label>
										<div class="col-sm-8">
											<textarea class="form-control wysihtml5" rows="4" data-stylesheet-url="assets/css/wysihtml5-color.css" name="F_DESCRIPTION" id="F_DESCRIPTION" placeholder="설명" ></textarea>
										</div>
									</div>
									
									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">종류</label>
										<div class="col-sm-8" >
											<select class="form-control" id="F_RUN_CD" >
												<%=codeClass.getComboBoxByCodeList("RUN_CD", "", true) %>
											</select>
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
	<script src="assets/a1ck/js/agentInfo.js"></script>

</body>
</html>