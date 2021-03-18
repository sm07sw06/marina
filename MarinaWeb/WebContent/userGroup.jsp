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

	<!-- page-container start -->
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
				<li><a href="#">사용자관리</a></li>
				<li class="active"><strong>사용자그룹 등록</strong></li>
			</ol>

			<div class='myTitleBox'>사용자그룹 등록</div>
				<!-- main-sub-content start-->
				<div class="main-sub-content" >

					<!--  left list start -->
					<div id="left-area" class="col-lg-4 container-fluid">		
						<!-- panel start -->
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">사용자그룹 목록</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetGroupForm" id="SetGroupForm"  class="validate" action="" >								
									<div class="panel-body">
										<div>
											<div >
												<input type="text"  class="col-sm-12" id="C_USER_GRP_NM" name="C_USER_GRP_NM" placeholder="사용자그룹" >
											</div>
										</div> 
										<br><br>
										<div >
											<div >
												<button onclick="return false;" id="btnQuery"     class="btn btn-sm btn-default">조회</button>
												<button onclick="return false;" id="btnAdd"       class="btn btn-sm btn-primary">추가</button>
												<button onclick="return false;" id="btnSave"      class="btn btn-sm btn-blue">저장</button>
												<button onclick="return false;" id="btnAttrRenum" class="btn btn-sm btn-blue">그룹멤버저장</button>
											</div>
										</div> 
										<br>
										<div id= "tableDivID1">
											<table id="jqGrid1"></table>
											<div id="jqGridPager1"></div>
										</div>
	
										<div class="search_cond">
											<input type="hidden" class="form-control" id="CRUD1" name="CRUD1"  value="U">
											<input type="hidden" class="form-control" id="ROWID1" name="ROWID1"  >
											<div class="form-group">
												<label for="f_orgNm" class=" control-label">사용자그룹명</label>
												<div >
													<input type="hidden" class="form-control" id="F_USER_GRP_ID" >
													<input type="text" class="form-control" id="F_USER_GRP_NM"   >
												</div>
											</div>

										</div>
										<div class="form-group">
											<label for="f_orgNm" class="control-label">설명</label>
											<div>
												<textarea class="form-control wysihtml5" rows="4" data-stylesheet-url="assets/css/wysihtml5-color.css" name="F_DESCRIPTION" id="F_DESCRIPTION" placeholder="설명" ></textarea>
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
									</div>
								</form>		
							<!-- panel body end -->
							</div>
						<!-- panel end -->
						</div>
					</div>
					<!--  left list end -->

					<!--  center info start -->
					<div id="detail-area" class="col-lg-4 container-fluid">	  

						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">사용자 전체</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>

							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetUserFrom" id="SetUserFrom"  class="validate" action="" >
									<input type="hidden" class="form-control" id="CRUD2" name="CRUD2"  value="U">
									<input type="hidden" class="form-control" id="ROWID2" name="ROWID2"  >
									<div class="panel-body">
										<div id= "tableDivID2">
											<table id="jqGrid2"></table>
											<div id="jqGridPager2"></div>
										</div>
									</div>
								</form>
							</div> <!-- panel-body  -->
						</div> <!--  id="pannel"  -->
					</div> <!--  id="detail-area"  -->
					<!--  center info end -->


					<!--  right info start -->
					<div id="detail-area" class="col-lg-4 container-fluid">	  
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">그룹 사용자</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>

							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetUserTo" id="SetUserTo"  class="validate" action="" >
									<input type="hidden" class="form-control" id="CRUD3" name="CRUD3"  value="U">
									<input type="hidden" class="form-control" id="ROWID3" name="ROWID3"  >
									<div class="panel-body">
										<div id= "tableDivID3">
											<table id="jqGrid3"></table>
											<div id="jqGridPager3"></div> 
										</div>
									</div>
								</form>
							</div> <!-- panel-body  -->
						</div> <!--  id="pannel"  -->
					</div> <!--  id="detail-area"  -->
					<!--  right info end -->

				</div>
				<!-- main-sub-content end-->
			</div> <!-- myTitleBox -->
			<!-- Footer start-->
			<%@ include file="footerInfo.jsp" %>
			<!-- Footer end-->
		</div> <!--main-content -->
	</div>
	<!-- page-container end -->

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
	<script src="assets/a1ck/js/userGroup.js"></script>

</body>
</html>