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
<link rel="stylesheet" href="assets/a1ck/css/jqu11ery.prompt.css">	

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
				<li><a href="#">계정관리</a></li>
				<li><a href="#">통합ID관리</a></li>
				<li class="active"><strong>사용자 정보관리</strong></li>
			</ol>
	
			<div class='myTitleBox'>사용자 정보관리</div>
				<!--  search form start -->
				<div class=" search_cond col-lg-12">
					<form class="search-form"> 
						<div class="col-lg-8">
							<input type="text" style="width:200px;" id="C_USER_NM"  name="C_USER_NM"  class="control" placeholder="이름또는 ID를 입력하세요." >
							<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>
							<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">신규</button>
							<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
							<button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red" >삭제</button>
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
								<div class="panel-title">사용자목록</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							<!-- panel body -->
							<div class="panel-body">
								<div id= "userDivID">
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
								<div class="panel-title">사용자정보</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetUserForm" id="SetUserForm"  class="form-horizontal validate" enctype="multipart/form-data" action="" accept-charset="UTF-8" >
							
									<input type="hidden" class="form-control" id="CRUD" name="CRUD"  value="U">
									<input type="hidden" class="form-control" id="ROWID" name="ROWID"  >

							
									<div class="form-group">
										<label for="f_sabun" class="col-sm-3 control-label">사용자번호</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_USER_CD" name="F_USER_CD"  >
											<input type="hidden" class="form-control" id="F_USER_ID" name="F_USER_ID" >
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_name" class="col-sm-3 control-label">이름</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_USER_NM" name="F_USER_NM"  >
										</div>
									</div>
																	
<!-- 									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">재직여부</label>
										<div class="col-sm-8" >
											<select class="form-control" id="f_status" readonly>
												<option>상태를 선택하세요.</option>
												<option value="C" > 재직</option>
												<option value="H" > 휴직</option>
												<option value="T" > 퇴직</option>
											</select>
										</div>
									</div> -->
	
									<div class="form-group">
										<label for="F_TELEPHONE" class="col-sm-3 control-label">연락처</label>											
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_TELEPHONE" name="F_TELEPHONE"  >
										</div>
									</div>
	
									<div class="form-group">
										<label for="F_EMAIL" class="col-sm-3 control-label">이메일</label>											
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_EMAIL" name="F_EMAIL"  >
										</div>
									</div>
									
									<div class="form-group">
										<label for="F_PASSWORD" class="col-sm-3 control-label">비밀번호</label>											
										<div class="col-sm-8">
											<input type="password" class="form-control" id="F_PASSWORD" name="F_PASSWORD" >
											<input type="hidden" class="form-control" id="F_PASSWORDORG" name="F_PASSWORDORG" >
										</div>
									</div>

									<div class="form-group">
										<label for="f_picture" class="col-sm-3 control-label">얼굴</label>	
										<div class="col-sm-8">
											<div class="fileinput fileinput-new" data-provides="fileinput">
												<div class="fileinput-new thumbnail" style="width: 200px; height: 150px;" data-trigger="fileinput">
													<img src="assets/images/200x150.png" id='F_PICTURE' name='F_PICTURE'  width="200" height="150"  alt="...">
												</div>
												<div class="fileinput-preview fileinput-exists thumbnail" style="max-width: 200px; max-height: 150px"></div>
												<div>
													<span class="btn btn-white btn-file">
														<span class="fileinput-new">얼굴등록</span>
														<span class="fileinput-exists">변경</span>
														<input type="file" name="f_picture_preview" id="f_picture_preview"  accept="images/*">
													</span>
													<a href="#" class="btn btn-orange fileinput-exists" data-dismiss="fileinput">삭제</a>
												</div>
											</div>
										</div>
									</div>
									
									<div class="form-group">
										<label for="f_status" class="col-sm-3 control-label">사용여부</label>
										<div class="col-sm-8" >
									        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="Y">
									        <label for="F_USE_YN">사용</label>
									        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="N">
									        <label for="F_USE_YN">미사용</label>
									        <input type="hidden" name="F_USE_YN_VAL" id="F_USE_YN_VAL" >
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
	
	<!-- JavaScripts initializations and stuff -->
	<script src="assets/js/neon-custom.js"></script>
<script>
	var sessionsabun = "<%=userid%>";
</script>
	<!-- Demo Settings -->
	<!-- script src="assets/js/neon-demo.js"></script -->
	<script src="assets/a1ck/js/a1ck-js.js"></script>	
	<script src="assets/a1ck/js/jquery.prompt.js"></script>	
	<script src="assets/a1ck/js/userInfo.js"></script>

</body>
</html>