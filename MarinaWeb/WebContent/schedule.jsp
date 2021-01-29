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

<title>매직아카이브</title>

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


	<!-- Modal 7 (Ajax Modal)-->
	<div class="modal fade" id="modal-7" >
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title">Schedule의 cron 표현식 설명</h4>
				</div>
				<div class="modal-body">
					<div class="panel-body">
						<%@include file="helpSchedule.jsp"%>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
				</div>
			</div>
		</div>
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
				<li class="active"><strong>스케쥴관리</strong></li>
			</ol>
	
			<div class='myTitleBox'>스케쥴관리</div>
				<!-- main-sub-content start-->
				<div class="main-sub-content" >
				
					<!--  left list start -->
					<div class="col-lg-6">		

						<!-- panel start -->
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">스케쥴 목록</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							<!-- panel body -->
							<div class="panel-body">
							
								<form role="form" method="post" name="SetTableForm" id="SetTableForm"  class="validate" action="" >								
									<!-- div class=" search_cond" -->
									<div class="row">
										<div class="col-sm-12" >
											<button onclick="return false;" id="btnQuery"    class="btn btn-sm btn-default"><i class="entypo-search"></i>&nbsp;조회</button>
											<button onclick="return false;" id="btnAdd"      class="btn btn-sm btn-primary"><i class="entypo-plus"></i>&nbsp;추가</button>
											<button onclick="return false;" id="btnDelete"   class="btn btn-sm btn-red"><i class="entypo-minus"></i>&nbsp;삭제</button>
											<button onclick="return false;" id="btnSave"     class="btn btn-sm btn-blue"><i class="entypo-check"></i>&nbsp;저장</button>
											<button onclick="return false;" id="btnConnect"  class="btn btn-sm btn-primary"><i class="entypo-signal"></i>&nbsp;접속테스트</button>
										</div>
									</div>
									<br>

									<div id= "tableDivID1">
										<table id="jqGrid1"></table>
									    <div id="jqGridPager1"></div>
									</div>

									<div class=" search_cond">
									
										<input type="hidden" class="form-control" id="CRUD1" name="CRUD1"  value="C">
										<input type="hidden" class="form-control" id="ROWID1" name="ROWID1"  >
								
										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">ID</label>
													<div >
														<input type="hidden" class="form-control" id="F_JOB_ID" name="F_JOB_ID"   >
														<input type="text" class="form-control" id="F_JOB_CD"  name="F_JOB_CD"   >
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">작업명</label>
													<div >
														<input type="text" class="form-control" id="F_JOB_NM" name="F_JOB_NM"   >
													</div>
												</div>
											</div>
										</div>

										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm"  class=" control-label">작업일정 </label>
													<div class="input-group">
														<input type="text" class="form-control" id="F_JOB_SCHEDULE" name="F_JOB_SCHEDULE" >
														<input type="hidden" class="form-control" id="F_JOB_SCHEDULE_ORG" name="F_JOB_SCHEDULE_ORG" >
														<span class="input-group-btn">
															<button class="btn btn-primary" id="F_JOB_SCHEDULE_LABEL" type="button"><i class="entypo-keyboard"></i></button>
														</span>
													</div>
												</div>
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">보관주기</label>
													<div>
													  	<div class="dualPosition_right1">								
																<div >
																	<select class="form-control" id="F_SAVE_PREQ_CD" name="F_SAVE_PREQ_CD" >
																	<%=codeClass.getComboBoxByCodeList("SAVE_PREQ_CD", "", true) %>
																	</select>														
																</div>													
														</div>
														<div class="dualPosition_right2">								
																<div >
																	<input type="hidden" class="form-control" id="F_SAVE_PREQ_NM" name="F_SAVE_PREQ_NM"   >
																	<input type="text" class="form-control" id="F_SAVE_PREQ" name="F_SAVE_PREQ"   >
																</div>
														</div> 
													</div> 
												</div>
											</div>
										</div>

										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">유형</label>
													<div >
														<input type="hidden" class="form-control" id="F_JOB_TYPE_NM" name="F_JOB_TYPE_NM"   >
														<select class="form-control" id="F_JOB_TYPE_CD" name="F_JOB_TYPE_CD" >
															<%=codeClass.getComboBoxByCodeList("JOB_TYPE_CD","", true) %>
														</select>														
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">방법</label>
													<div >
														<input type="hidden" class="form-control" id="F_JOB_METHOD_NM" name="F_JOB_METHOD_NM"   >
														<select class="form-control" id="F_JOB_METHOD_CD" name="F_JOB_METHOD_CD" >
															<%=codeClass.getComboBoxByCodeList("JOB_METHOD_CD","", true) %>
														</select>														
													</div>
												</div>		
											</div>

										</div>
		
										<div class="form-group dualPosition">
											<div class="dualPosition_left">
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">원본 IP</label>
													<div >
														<input type="text" class="form-control" id="F_SRC_IP"   name="F_SRC_IP"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">원본 Port</label>
													<div >
														<input type="text" class="form-control" id="F_SRC_PORT"   name="F_SRC_PORT"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">원본 DBMS</label>
													<div>
														<input type="hidden" class="form-control" id="F_SRC_DBMS_NM" name="F_SRC_DBMS_NM"   >
														<select class="form-control" id="F_SRC_DBMS_CD" name="F_SRC_DBMS_CD" >
															<%=codeClass.getComboBoxByCodeList("DBMS_CD","", true) %>
														</select>
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">원본 DB명</label>
													<div >
														<input type="text" class="form-control" id="F_SRC_DB"  name="F_SRC_DB"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">원본 사용자</label>
													<div >
														<input type="text" class="form-control" id="F_SRC_USER" name="F_SRC_USER"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">원본 비밀번호</label>
													<div >
														<input type="text" class="form-control" id="F_SRC_PASSWD"  name="F_SRC_PASSWD"   >
													</div>
												</div>										
											</div>		
											<div class="dualPosition_right" >
											
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">대상 IP</label>
													<div >
														<input type="text" class="form-control" id="F_DEST_IP"  name="F_DEST_IP"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">대상 Port</label>
													<div >
														<input type="text" class="form-control" id="F_DEST_PORT" name="F_DEST_PORT"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">대상 DBMS</label>
													<div>
														<input type="hidden" class="form-control" id="F_DEST_DBMS_NM"   name="F_DEST_DBMS_NM"   >
														<select class="form-control" id="F_DEST_DBMS_CD" name="F_DEST_DBMS_CD" >
															<%=codeClass.getComboBoxByCodeList("DBMS_CD","", true) %>
														</select>
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">대상 DB명</label>
													<div >
														<input type="text" class="form-control" id="F_DEST_DB"  name="F_DEST_DB"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">대상 사용자</label>
													<div >
														<input type="text" class="form-control" id="F_DEST_USER"  name="F_DEST_USER"   >
													</div>
												</div>
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">대상 비밀번호</label>
													<div >
														<input type="text" class="form-control" id="F_DEST_PASSWD" name="F_DEST_PASSWD"   >
													</div>
												</div>										
											</div>		
										</div>

										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">테이블</label>
													<div >
														<input type="text" class="form-control" id="F_DEST_TABLE"  name="F_DEST_TABLE"   >
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class="control-label">설명</label>
													<div >
														<textarea class="form-control wysihtml5" rows="1" data-stylesheet-url="assets/css/wysihtml5-color.css" name="F_DESCRIPTION" id="F_DESCRIPTION"  ></textarea>
													</div>
												</div>		
											</div>											
										</div>
										

										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">class</label>
													<div >
														<input type="text" class="form-control" id="F_JOB_CLASS"  name="F_JOB_CLASS"   >
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">경로</label>
													<div >
														<input type="text" class="form-control" id="F_JOB_PATH" name="F_JOB_PATH"   >
													</div>
												</div>		
											</div>
										</div>
										
										<div class="form-group">
											<label for="f_orgNm" class=" control-label">SQL</label>
											<div >
												<textarea class="form-control wysihtml5" rows="3" data-stylesheet-url="assets/css/wysihtml5-color.css" name="F_SRC_SQL" id="F_SRC_SQL"  ></textarea>
											</div>
										</div>		

										
										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_status" class="control-label">사용여부</label>
													<div >
												        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="Y" checked >
												        <label for="F_USE_YN">예</label>
												        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="N">
												        <label for="F_USE_YN">아니요</label>
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_status" class="control-label">동작여부</label>
													<div >
												        <input class="icheck-13" type="radio" id="F_SELECT_YN" name="F_SELECT_YN" value="Y" checked >
												        <label for="F_SELECT_YN">예</label>
												        <input class="icheck-13" type="radio" id="F_SELECT_YN" name="F_SELECT_YN" value="N">
												        <label for="F_SELECT_YN">아니요</label>
												</div>		
											</div>
										</div>
										

																				
									</div>
								</div>		
								</form>		
							<!-- panel body end -->
							</div>
						<!-- panel end -->
						</div>
						
					</div>
					<!--  left list end -->
									
					<!--  right info start -->
					<div id="detail-area" class="col-lg-6 container-fluid">	  
					 
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">컬럼 정보</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetATTRForm" id="SetATTRForm"  class="validate" action="" >
																		
									<div>
										<button onclick="return false;" id="btnAttrAdd"   class="btn btn-sm btn-primary"><i class="entypo-plus"></i>&nbsp;추가</button>
										<button onclick="return false;" id="btnAttrDel"   class="btn btn-sm btn-red">    <i class="entypo-minus"></i>&nbsp;삭제</button>
										<button onclick="return false;" id="btnAttrSave"  class="btn btn-sm btn-blue">   <i class="entypo-check"></i>&nbsp;저장</button>
										<button onclick="return false;" id="btnAttrRenum" class="btn btn-sm btn-blue">   <i class="entypo-list"></i>&nbsp;정렬</button>
									</div>									
																
									<input type="hidden" class="form-control" id="CRUD2" name="CRUD2"  value="U">
									<input type="hidden" class="form-control" id="ROWID2" name="ROWID2"  >
							
									<div class="panel-body">
										<div class="row">
											<div id= "tableDivID2">
												<table id="jqGrid2"></table>
											    <div id="jqGridPager2"></div>
											</div>
										</div>
									</div>
								

																		
									<div class=" search_cond">				

										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">컬럼코드</label>
													<div >
														<input type="hidden" class="form-control" id="F_COL_ID"   >
														<input type="hidden" class="form-control" id="F_COL_SEQ"   >
														<input type="text" class="form-control" id="F_COL_CD"   style="text-transform: uppercase;" >
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">컬러명</label>
													<div >
														<input type="text" class="form-control" id="F_COL_NM"  style="text-transform: uppercase;"  >
													</div>
												</div>
											</div>
										</div>										
																		
										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">타입</label>
													<div >
														<input type="hidden" class="form-control" id="F_COL_TYPE_NM"   >
														<select class="form-control" id="F_COL_TYPE_CD" >
															<!-- option>상태를 선택하세요.</option -->
															<%=codeClass.getComboBoxByCodeList("ATTR_TYPE_CD","", true) %>
														</select>														
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">길이</label>
													<div >
														<input type="text" class="form-control" id="F_COL_LEN"  onkeypress="inNumber();" >
													</div>
												</div>
											</div>
										</div>	

										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">날짜기준</label>
													<div >
												        <input class="icheck-13" type="radio" id="F_COL_DATE_YN" name="F_COL_DATE_YN" value="Y">
												        <label for="F_COL_DATE_YN">예</label>
												        <input class="icheck-13" type="radio" id="F_COL_DATE_YN" name="F_COL_DATE_YN" value="N">
												        <label for="F_COL_DATE_YN">아니요</label>
													</div>

												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="f_orgNm" class=" control-label">암호화</label>
													<div >
												        <input class="icheck-13" type="radio" id="F_COL_ENC_YN" name="F_COL_ENC_YN" value="Y">
												        <label for="F_COL_ENC_YN">예</label>
												        <input class="icheck-13" type="radio" id="F_COL_ENC_YN" name="F_COL_ENC_YN" value="N">
												        <label for="F_COL_ENC_YN">아니요</label>
													</div>
												</div>
											</div>
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
	<script src="assets/a1ck/js/schedule.js"></script>

</body>
</html>