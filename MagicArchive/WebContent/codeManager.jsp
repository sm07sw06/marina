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
				<li class="active"><strong>코드관리</strong></li>
			</ol>
	
			<div class='myTitleBox'>코드관리</div>
				<!-- main-sub-content start-->
				<div class="main-sub-content" >
				
					<!--  left list start -->
					<div class="col-lg-6">		

						<!-- panel start -->
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">코드 목록</div>
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
											<button onclick="return false;" id="btnQuery"    style="display:none;"  class="btn btn-icon btn-sm btn-default">조회<i class="entypo-search"></i></button>
											<button onclick="return false;" id="btnAdd"      class="btn btn-icon btn-sm btn-primary">추가<i class="entypo-plus"></i></button>
 											<button onclick="return false;" id="btnDelete"   class="btn btn-icon btn-sm btn-red">삭제<i class="entypo-minus"></i></button>
											<button onclick="return false;" id="btnSave"     class="btn btn-icon btn-sm btn-blue">저장<i class="entypo-check"></i></button>
										</div>
									</div>
									<div class=" search_cond">
									
										<input type="hidden" class="form-control" id="CRUD1" name="CRUD1"  value="U">
										<input type="hidden" class="form-control" id="ROWID1" name="ROWID1"  >
								
										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="F_GROUP_CD" class=" control-label">그룹코드</label>
													<div >
														<input type="text" class="form-control" id="F_GROUP_CD"  name="F_GROUP_CD"  onKeyUp="this.value=this.value.toUpperCase();" style="text-transform: uppercase;"   >
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="F_GROUP_NM" class=" control-label">그룹코드명</label>
													<div >
														<input type="text" class="form-control" id="F_GROUP_NM" name="F_GROUP_NM"   >
													</div>
												</div>
											</div>
										</div>

 										<div class="form-group">
											<div >
												<label for="f_status" class="control-label">사용여부</label>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="Y">
										        <label for="F_USE_YN">예</label>
										        &nbsp;&nbsp;&nbsp;
										        <input class="icheck-13" type="radio" id="F_USE_YN" name="F_USE_YN" value="N">
										        <label for="F_USE_YN">아니요</label>
											</div>
										</div> 
																				
									</div>
								</div>
								
									
						<div class="content">
							<!-- 그리드가 삽입될 DIV -->
							<div id="gridHolder" style="width:100%; height:410px;"></div>
							<div class="gridPaging" id="gridPageNavigationDiv"></div>
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
								<div class="panel-title">상세코드</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetATTRForm" id="SetATTRForm"  class="validate" action="" >
																		
									<div>
										<button onclick="return false;" id="btnAttrAdd"   class="btn btn-sm btn-primary"><i class="entypo-plus"></i>&nbsp;추가</button>
								  		<button onclick="return false;" id="btnAttrDel"   class="btn btn-sm btn-red"><i class="entypo-minus"></i>&nbsp;삭제</button> 
										<button onclick="return false;" id="btnAttrSave"  class="btn btn-sm btn-blue"><i class="entypo-check"></i>&nbsp;저장</button>

									</div>	

									<input type="hidden" class="form-control" id="CRUD2" name="CRUD2"  value="UD">
									<input type="hidden" class="form-control" id="ROWID2" name="ROWID2"  >
							
									<div class=" search_cond">				

										<div class="form-group dualPosition">
											<div class="dualPosition_left">								
												<div class="form-group">
													<label for="F_DETAIL_CD" class=" control-label">코드</label>
													<div >
														<input type="text" class="form-control" id="F_DETAIL_CD"   style="text-transform: uppercase;" >
													</div>
												</div>		
											</div>
											<div class="dualPosition_right">								
												<div class="form-group">
													<label for="F_DETAIL_NM" class=" control-label">코드명</label>
													<div >
														<input type="text" class="form-control" id="F_DETAIL_NM"   >
													</div>
												</div>
											</div>
										</div>	
										
 										<div class="form-group">
											<div >
												<label for="f_status" class="control-label">사용여부</label>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										        <input class="icheck-13" type="radio" id="F_USE_SUB_YN" name="F_USE_SUB_YN" value="Y">
										        <label for="F_USE_SUB_YN">예</label>
										        &nbsp;&nbsp;&nbsp;
										        <input class="icheck-13" type="radio" id="F_USE_SUB_YN" name="F_USE_SUB_YN" value="N">
										        <label for="F_USE_SUB_YN">아니요</label>
											</div>
										</div> 
										
									
									</div>
									

						<div class="content">
							<!-- 그리드가 삽입될 DIV -->
							<div id="gridHolder2" style="width:100%; height:410px;"></div>
							<div class="gridPaging" id="gridPageNavigationDiv2"></div>
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
	<script src="assets/a1ck/js/codeManager.js"></script>

</body>
</html>