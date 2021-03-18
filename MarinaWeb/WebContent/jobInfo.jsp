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
	
	<link rel="stylesheet" href="assets/js/datatables/datatables.css">
	
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

	<!-- Modal 7 (Ajax Modal)-->
	<div class="modal fade" id="modal-7" >
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title">테이블 선택</h4>
				</div>
<!-- 				<div class="modal-body">
					<div id= "tableDivID0">
						<table id="jqGrid0"></table>
					    <div id="jqGridPager0"></div>
					</div>
				</div> -->
				
								<div class="modal-body">
									<div class="panel-body">
										<table class="table table-bordered table-striped datatable" id="uTable">
											<thead>
												<tr>
													<th name="TABLE_ID"   >ID</th>
													<th name="TABLE_CD"   >CD</th>
													<th name="TABLE_NM"   >NM</th>
												</tr>
											</thead>
											<tbody>
											</tbody>
										</table>
									</div>
								</div>
												
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
				</div>
			</div>
		</div>
	</div>
	
<div id="a_form" title="Cerca Cliente" class="c">
  <table id="a_grid" align="center" class="d"></table> 
  <div id="a_pager" align="center"></div>
</div>
	
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
				<li><a href="#">작업관리</a></li>
				<li class="active"><strong>작업 등록</strong></li>
			</ol>
	
			<div class='myTitleBox'>작업 등록</div>
				<!--  search form start -->
				<div class=" search_cond col-lg-12">
					<form class="search-form"> 
						<div class="form-group col-lg-2" >
							<select class="form-control" id="C_SERVER_ID" >
								<option value="0">상태를 선택하세요.</option>
								 <%=codeClass.getComboBoxByServer("", true) %>
							</select>
						</div>
						<div class="form-group col-lg-6" >
							<div>
								<input type="text" style="width:200px;height:30px;" id="C_JOB_NM"  name="C_JOB_NM"  class="control" placeholder=" 작업명 또는 ID를 입력하세요." >
								&nbsp;&nbsp;		
								<input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="Y">
						        <label for="C_USE_YN">사용</label>
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="N">
						        <label for="C_USE_YN">미사용</label>
						        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="A">
						        <label for="C_USE_YN">전체</label>
							</div>
						</div>
						<div class="form-group col-lg-3" >
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
					<div class="col-lg-4">										
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">작업 목록</div>
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
					<div id="detail-area" class="col-lg-8 container-fluid">	  
					 
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">작업정보 상세</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetJobForm" id="SetJobForm"  class="form-horizontal validate" action="" >
							
									<input type="hidden" class="form-control" id="CRUD" name="CRUD"  value="C">
									<input type="hidden" class="form-control" id="ROWID" name="ROWID"  >
							
									<div class="form-group">
										<label for="F_JOB_CD" class="col-sm-3 control-label">작업ID</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_JOB_CD"  >
										</div>
									</div>
																	
									<div class="form-group">
										<label for="F_JOB_NM" class="col-sm-3 control-label">작업명</label>
										<div class="col-sm-8">
											<input type="hidden" class="form-control" id="F_JOB_ID"  readonly> 
											<input type="text" class="form-control" id="F_JOB_NM"  >
										</div>
									</div>
																	
									<div class="form-group">
										<label for="F_TABLE_CD" class="col-sm-3 control-label">테이블</label>
										<div class="col-sm-9 searchBox">
											<!-- button type="button" class="btn btn-default btn-icon" style="width:150px;" > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="entypo-search"></i></button -->										
											<input type="hidden" class="form-control" id="F_TABLE_ID"  readonly>
											<input type="text" class="form-control searchBox_left"  id="F_TABLE_CD"  readonly>
											<img ID='showAjaxModal' src="assets/images/search.png" class="searchBox_mid"  alt="" />
											<input type="text" class="form-control searchBox_right" id="F_TABLE_NM"  readonly>
										</div>
									</div>
	
									<div class="form-group">
										<label for="F_SOURCE_PATH" class="col-sm-3 control-label">소스경로</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_SOURCE_PATH" >
										</div>
									</div>
	
									<div class="form-group">
									<label for="F_SOURCE_FILE" class="col-sm-3 control-label">소스파일</label>
									<div class="col-sm-8">
											<input type="text" class="form-control" id="F_SOURCE_FILE"  >
										</div>
									</div>
									
									<div class="form-group">
										<label for="F_INFO_PATH" class="col-sm-3 control-label">인포경로</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_INFO_PATH" >
										</div>
									</div>
																		
									<div class="form-group">
										<label for="F_INFO_FILE" class="col-sm-3 control-label">인포파일</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_INFO_FILE"  >
										</div>
									</div>	

									<div class="form-group">
										<label for="F_JOB_LOG_PATH" class="col-sm-3 control-label">작업로그경로</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_JOB_LOG_PATH"  >
										</div>
									</div>	
									
						<!-- 	<div class="form-group">
								<label class="col-sm-3 control-label">Time Picker (Dropdown)</label>
								
								<div class="col-sm-3">
									<input type="text" class="form-control timepicker" data-template="dropdown" data-show-seconds="false" data-default-time="11:25 AM" data-show-meridian="true" data-minute-step="5" />
								</div>
							</div> -->

									<div class="form-group">
										<label for="F_JOB_TM_HAF" class="col-sm-3 control-label">작업시각</label>
										<div class="col-sm-3" >
											<select class="form-control" id="F_JOB_TM_HAF" >
												<option value="0">오전</option>
												<option value="1">오후</option>
											</select>
										</div>
										<div class="col-sm-3" >
											<select class="form-control" id="F_JOB_TM_MIN" >
												<option value="00">00</option>
												<option value="01">01</option>
												<option value="02">02</option>
												<option value="03">03</option>
												<option value="04">04</option>
												<option value="05">05</option>
												<option value="06">06</option>
												<option value="07">07</option>
												<option value="08">08</option>
												<option value="09">09</option>
												<option value="10">10</option>
												<option value="11">11</option>
											</select>
										</div>
										<div class="col-sm-3" >
											<select class="form-control" id="F_JOB_TM_SEC" >
												<option value="00">00</option>
												<option value="05">05</option>
												<option value="10">10</option>
												<option value="15">15</option>
												<option value="20">20</option>
												<option value="25">25</option>
												<option value="30">30</option>
												<option value="35">35</option>
												<option value="40">40</option>
												<option value="45">45</option>
												<option value="50">50</option>
												<option value="55">55</option>
											</select>
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">구분자</label>
										<div class="col-sm-8" >
											<input type="text" class="form-control" id="F_SEPARATOR"  >
										<!--
											<select class="form-control" id="F_SEPARATOR" >
												<option value="|" >| &nbsp; (VERTICAL BAR)</option>
												<option value="," >, &nbsp; (COMMA)</option>
												<option value="~;">~; &nbsp; (TILDE/SEMICOLON)</option>
											</select>
                                        -->
										</div>
									</div>
										
									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">스케쥴적용</label>
										<div class="col-sm-8" >
									        <input class="icheck-13" type="radio" id="F_SCHEDULE_YN" name="F_SCHEDULE_YN" value="Y">
									        <label for="F_SCHEDULE_YN">예</label>
									        <input class="icheck-13" type="radio" id="F_SCHEDULE_YN" name="F_SCHEDULE_YN" value="N">
									        <label for="F_SCHEDULE_YN">아니오</label>
										</div>
									</div>

									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">원시파일삭제</label>
										<div class="col-sm-8" >
									        <input class="icheck-13" type="radio" id="F_SOURCE_DEL_YN" name="F_SOURCE_DEL_YN" value="Y">
									        <label for="F_SOURCE_DEL_YN">예</label>
									        <input class="icheck-13" type="radio" id="F_SOURCE_DEL_YN" name="F_SOURCE_DEL_YN" value="N">
									        <label for="F_SOURCE_DEL_YN">아니오</label>
										</div>
									</div>

									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">마지막컬럼 구분자여부</label>
										<div class="col-sm-8" >
									        <input class="icheck-13" type="radio" id="F_LAST_COL_YN" name="F_LAST_COL_YN" value="Y">
									        <label for="F_LAST_COL_YN">예</label>
									        <input class="icheck-13" type="radio" id="F_LAST_COL_YN" name="F_LAST_COL_YN" value="N">
									        <label for="F_LAST_COL_YN">아니오</label>
										</div>
									</div>

									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">사용여부</label>
										<div class="col-sm-8" >
									        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="Y">
									        <label for="F_USE_YN">예</label>
									        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="N">
									        <label for="F_USE_YN">아니오</label>
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
	<script src="assets/a1ck/js/jobInfo.js"></script>

	<link rel="stylesheet" href="assets/js/daterangepicker/daterangepicker-bs3.css">
	<script src="assets/js/bootstrap-timepicker.min.js"></script>

</body>
</html>