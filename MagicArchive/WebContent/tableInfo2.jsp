<!DOCTYPE html>
<%@ page contentType="text/html;charset=utf-8"%>

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
<!-- 
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link rel="stylesheet" href="assets/js/jquery-ui/css/no-theme/jquery-ui-1.10.3.custom.min.css" >
 -->
<link rel="stylesheet" href="assets/css/font-icons/entypo/css/entypo.css">
<!--
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic"> 
 -->
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
	
<!-- 
<link rel="stylesheet" href="//jqueryui.com/jquery-wp-content/themes/jqueryui.com/style.css">
	<link rel="stylesheet" href="assets/css/datepicker.css" >
 -->
<!-- link rel="stylesheet" href="assets/css/skins/facebook.css" -->

<script src="assets/js/jquery-1.12.4.js"></script>
<script src="assets/js/jquery.form.js"></script>
<script src="assets/jquery-ui-1.12.1.custom/jquery-ui.js"></script>
<!-- 
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="assets/js/jquery-1.11.3.min.js"></script>
<script src="assets/js/jquery-ui/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
 -->
	 
<script src="assets/js/bootstrap.js"></script>
<!-- 
<script src="assets/js/bootstrap-datepicker.js"></script>
 -->	

	
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
				<!--  search form start -->
				<!-- div class=" search_cond col-lg-12">
					<form class="search-form"> 
						<div class="col-lg-8">
							<div class="col-sm-4">
								<select class="form-control" id="C_SERVER_ID" >
									<option value="0">상태를 선택하세요.</option>
								</select>
							</div>
							<div class="col-sm-4">
								<input type="text" class="form-control" id="C_TABLE_NM" name="C_TABLE_NM" placeholder="테이블명" >
							</div>
																					
							<div class="col-sm-4">
								<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>
								<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">신규</button>
								<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
								<button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red" >삭제</button>
							</div>
						</div>
					</form>
				</div-->
				<!--  search form end --> 

				<!-- main-sub-content start-->
				<div class="main-sub-content" >
				
					<!--  left list start -->
					<div class="col-lg-4">		
							
						<!-- form class="search-form"> 
							<div class=" search_cond ">
								<div >
									<input type="text" class="form-control" id="C_TABLE_NM" name="C_TABLE_NM" placeholder="테이블명" >
								</div>
							</div>

						</form-->
																			
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
							
								<form class="search-form"> 
									<div class=" search_cond">
										<div>
											<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>
											<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">추가</button>
											<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
										</div>
									</div>							
	
									<div class=" search_cond ">
										<div >
											<input type="text" class="form-control" id="C_TABLE_NM" name="C_TABLE_NM" placeholder="테이블명" >
										</div>
									</div>
		
								
									<table class="table table-bordered datatable" id="uTable">
										<thead>
											<tr>
												<th name="TABLE_ID"    	width="30px" >테이블ID</th>
												<th name="TABLE_CD"    	width="100px">테이블코드</th>
												<th name="TABLE_NM"    	width="100px">테이블명</th>
												<th name="SAVE_PREQ_CD" width="100px">테이블명</th>
												<th name="SAVE_PREQ"    width="100px">테이블명</th>
												<th name="DESCRIPTION"  width="100px">테이블명</th>
												<th name="USE_YN"       width="100px">테이블명</th>
																			
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
									<br><br>
									<div>
									<div class=" search_cond">
										<input type="hidden" class="form-control" id="CRUD" name="CRUD"  value="U">
								
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
											<div class="form-group">
												<div  >
													<select class="form-control" id="F_SAVE_PREQ_CD" >
														<option value='D' >일</option>
														<option value='M' selected>월</option>
														<option value='H' >반기</option>
														<option value='Y' >년</option>
														<option value='A' >영구</option>
													</select>
												</div>
											</div>										
											<div >
												<input type="text" class="form-control" id="F_SAVE_PREQ" placeholder="주기" >
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
										        <label for="F_USE_YN">사용</label>
										        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="N">
										        <label for="F_USE_YN">미사용</label>
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
					<div id="detail-area" class="col-lg-8 container-fluid">	  
					 
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
								<form role="form" method="post" name="SetATTRForm" id="SetATTRForm"  class="form-horizontal validate" action="" >
							
									<div class="col-sm-4">
										<button onclick="return false;" id="btnAttrAdd"   class="btn btn-sm btn-primary">추가</button>
										<button onclick="return false;" id="btnAttrSave"  class="btn btn-sm btn-blue">저장</button>
										<button onclick="return false;" id="btnAttrDel"   class="btn btn-sm btn-red">삭제</button>
									</div>	
									<br><br>
																
									<input type="hidden" class="form-control" id="CRUD2" name="CRUD2"  value="U">
							
									<div class="panel-body">
										<table class="table table-bordered datatable" id="uTable2">
											<thead>
												<tr>
													<th name="ATTR_CD"    	>컬럼ID</th>
													<th name="ATTR_NM"      >컬럼명</th>
													<th name="ATTR_TYPE_CD" >타입</th>
													<th name="ATTR_TYPE_NM" >타입명</th>
													<th name="ATTR_NULL_YN" >NULL여부</th>																				
													<th name="ATTR_SIZE"    >길이</th>
													<th name="DECIMAL_SIZE" >소수</th>
												</tr>
											</thead>
											<tbody>
											</tbody>
										</table>
									</div>
				
									<div class="form-group">
										<label for="f_sabun" class="col-sm-2 control-label">컬럼코드</label>
										<div class="col-sm-4">
											<input type="text" class="form-control" id="F_ATTR_CD">
										</div>
										<label for="f_name" class="col-sm-2 control-label">컬러명</label>
										<div class="col-sm-4">
											<input type="text" class="form-control" id="F_ATTR_NM">
										</div>
									</div>
																	
									<div class="form-group">
										<label for="f_status" class="col-sm-2 control-label">타입</label>
										<div class="col-sm-4" >
											<select class="form-control" id="F_ATTR_TYPE_CD" >
												<option>상태를 선택하세요.</option>
											</select>
										</div>
										<label for="f_status" class="col-sm-2 control-label">Null</label>
										<div class="col-sm-4" >
									        <input class="icheck-13" type="radio" id="F_ATTR_NULL_YN" name="F_ATTR_NULL_YN" value="Y">
									        <label for="F_ATTR_NULL_YN">예</label>
									        <input class="icheck-13" type="radio" id="F_ATTR_NULL_YN" name="F_ATTR_NULL_YN" value="N">
									        <label for="F_ATTR_NULL_YN">아니오</label>
										</div>
									</div>

									<div class="form-group">
										<label for="f_orgNm" class="col-sm-2 control-label">길이</label>
										<div class="col-sm-4">
											<input type="text" class="form-control" id="F_ATTR_SIZE" >
										</div>
										<label for="f_orgNm" class="col-sm-2 control-label">소수</label>
										<div class="col-sm-4">
											<input type="text" class="form-control" id="F_DECIMAL_SIZE" >
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
	<script src="assets/a1ck/js/tableInfo.js"></script>

</body>
</html>