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
				<li class="active"><strong>테이블관리</strong></li>
			</ol>

			<div class='myTitleBox'>테이블관리</div>

				<!-- main-sub-content start-->
				<div class="main-sub-content" >
				
					<!--  left list start -->
					<div class="col-lg-4">		

						<!-- panel start -->
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">테이블 목록</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetTableForm" id="SetTableForm"  class="validate" action="" >								
									<div class="search_cond" >
										<div class="row">
											<div class="col-sm-6" >
												<input type="text"  class="col-sm-12" id="C_TABLE_NM" name="C_TABLE_NM" placeholder="테이블명" >
										        &nbsp;&nbsp;
												<input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="Y">
										        <label for="C_USE_YN">사용</label>
										        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="N">
										        <label for="C_USE_YN">미사용</label>
										        <input class="icheck-13" type="radio" id="C_USE_YN" name="C_USE_YN" value="A">
										        <label for="C_USE_YN">전체</label>
										        &nbsp;&nbsp;
								        	</div>
											<div class="col-sm-6" >
												<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>
												<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">추가</button>
												<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
											</div>
										</div>
									</div>
								 
									<div id= "tableDivID1">
										<table id="jqGrid1"></table>
										<div id="jqGridPager1"></div>
									</div>
                                
									<div class="search_cond">
										<input type="hidden" class="form-control" id="CRUD1" name="CRUD1"  value="C">
										<input type="hidden" class="form-control" id="ROWID1" name="ROWID1"  >
										
										<div class="form-group">
											<label for="f_sNm" class="control-label">서버이름</label>
											<div >																																				
												<select class="form-control" id="F_SERVER_ID" >
														<%= codeClass.getComboBoxByServer("F_SERVER_ID",  true) %>
												</select>
											</div>
										</div>
																		
										<div class="form-group">
											<label for="f_name" class="control-label">테이블코드</label>
											<div >
												<input type="hidden" class="form-control" id="F_TABLE_ID" >
												<input type="text" class="form-control" id="F_TABLE_CD" >
											</div>
										</div>
																		
										<div class="form-group">
											<label for="f_orgNm" class=" control-label">테이블명</label>
											<div >
												<input type="text" class="form-control" id="F_TABLE_NM"   >
											</div>
										</div>
		
										<div class="form-group">
											<label for="f_orgNm" class=" control-label">보관주기</label>
											<input type="hidden" class="form-control" id="F_SAVE_PREQ_NM"   >
												<div>
													<select class="form-control" id="F_SAVE_PREQ_CD" >
														<%=codeClass.getComboBoxByCodeList("SAVE_PREQ_CD", "", true) %>
													</select>
																										
												</div>
											<div >
												<input type="text" class="form-control" id="F_SAVE_PREQ" placeholder="주기" >
											</div>
										</div>
										
										<div class="form-group">
											<label for="f_exp_path" class=" control-label">보관주기 지난데이터 삭제전 복사 경로</label>
											<div >
												<input type="text" class="form-control" id="F_EXP_PATH"   >
											</div>
										</div>	
																			
										<div class="form-group">
											<label for="f_exp_zip_yn" class=" control-label">복사파일 압축여부</label>
											<div  >
												<input class="icheck-13" type="radio" id="F_EXP_ZIP_YN" name="F_EXP_ZIP_YN" value="Y">
												<label for="F_EXP_ZIP_YN" >예</label>
												<input class="icheck-13" type="radio" id="F_EXP_ZIP_YN" name="F_EXP_ZIP_YN" value="N">
												<label for="F_EXP_ZIP_YN">아니오</label>
											</div>
										</div>
																				
										<div class="form-group">
											<label for="f_orgNm" class="control-label">설명</label>
											<div >
												<textarea class="form-control wysihtml5" rows="2" data-stylesheet-url="assets/css/wysihtml5-color.css" name="F_DESCRIPTION" id="F_DESCRIPTION"  ></textarea>
											</div>
										</div>									
										<div class="form-group">
											<label for="f_status" class=" control-label">사용여부</label>
											<div  >
												<input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="Y">
												<label for="F_USE_YN">예</label>
												<input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="N">
												<label for="F_USE_YN">아니오</label>
											</div>
										</div>
									</div>
								</form>		
							<!-- panel body end -->
							</div>
						<!-- panel end -->
						</div>
						
					</div> <!--  left list end -->
					
									
					<!--  right info start -->
					<div id="detail-1area" class="col-lg-8 container-f1luid">	  
					 
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">테이블 상세</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							
							<div class="panel-body">
								<form role="form" method="post" name="SetATTRForm" id="SetATTRForm"  class="validate" action="" >	
							
									<div class="search_cond" >
											<button onclick="return false;" id="btnAttrAdd"   class="btn btn-sm btn-primary">추가</button>
											<button onclick="return false;" id="btnAttrSave"  class="btn btn-sm btn-blue">저장</button>
											<button onclick="return false;" id="btnAttrDel"   class="btn btn-sm btn-red">삭제</button>
											<button onclick="return false;" id="btnAttrRenum" class="btn btn-sm btn-blue">정렬</button>
									</div>	
					
									<div id= "tableDivID2">
										<table id="jqGrid2"></table>
										<div id="jqGridPager2"></div>
									</div>
									

									<div class="search_cond">
										<input type="hidden" class="form-control" id="CRUD2" name="CRUD2"  value="AU">
										<input type="hidden" class="form-control" id="ROWID2" name="ROWID2"  >

										<div class="col-sm-12">
											<div class="form-group col-sm-6">
												<label for="f_sabun" class="control-label">컬럼코드</label>
												<div>
													<input type="text" class="form-control" id="F_ATTR_CD">
												</div>
											</div>
											<div class="form-group col-sm-6">
												<label for="f_name" class="control-label">컬러명</label>
												<div>
													<input type="text" class="form-control" id="F_ATTR_NM">
												</div>
											</div>
										</div>
										
										<div class="col-sm-12">
											<div class="form-group col-sm-6">
												<label for="ATTR_TYPE_CD" class="control-label">타입</label>
												<input type="hidden" class="form-control" id="F_ATTR_TYPE_NM">
												<div>
													<select class="form-control" id="F_ATTR_TYPE_CD" >
														<%=codeClass.getComboBoxByCodeList("ATTR_TYPE_CD", "", true) %>
													</select>
												</div>
											</div>
											<div class="form-group col-sm-6">
												<label for="F_ATTR_NULL_YN" class="control-label">Null</label>
												<div>
													<input class="icheck-13" type="radio" id="F_ATTR_NULL_YN" name="F_ATTR_NULL_YN" value="Y">
													<label for="F_ATTR_NULL_YN">예</label>
													<input class="icheck-13" type="radio" id="F_ATTR_NULL_YN" name="F_ATTR_NULL_YN" value="N">
													<label for="F_ATTR_NULL_YN">아니오</label>
												</div>
											</div>
										</div>

										<div class="col-sm-12">
											<div class="form-group col-sm-6">
												<label for="F_ATTR_SIZE" class="control-label">길이</label>
												<div>
													<input type="text" class="form-control" id="F_ATTR_SIZE" name="F_ATTR_SIZE">
												</div>
											</div>
											<div class="form-group col-sm-6">
												<label for="F_DECIMAL_SIZE" class="control-label">소수</label>
												<div>
													<input type="text" class="form-control" id="F_DECIMAL_SIZE" name="F_DECIMAL_SIZE">
												</div>
											</div>
										</div>								

									</div>		
								</form>
							</div>  <!-- panel-body  -->
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
	</div><!-- page-container -->


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
	<script src="assets/a1ck/js/tableInfo.js"></script>

</body>
</html>