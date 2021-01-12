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
				<li class="active"><strong>작업 이력</strong></li>
			</ol>
	
			<div class='myTitleBox'>작업 이력</div>
 

				<!-- main-sub-content start-->
				<div class="main-sub-content" >
					<!--  left list start -->
					<div class="col-lg-12">										
		
						<!--  search form start -->
						<div class=" search_cond">
							<form class="search-form col-lg-6"> 
								<div class="form-group">
									<div class="searchDate col-lg-8">
										<div  class="input-group searchDate_left">
											<input type="text" class="form-control datepicker" id="C_FROM" name="C_FROM"  data-format="yyyy.mm.dd">
											<div class="input-group-addon">
												<a href="#"><i class="entypo-calendar"></i></a>
											</div>
										</div>
										<div  class="input-group searchDate_right">
											<input type="text" class="form-control datepicker" id="C_TO" name="C_TO"  data-format="yyyy.mm.dd">
											<div class="input-group-addon">
												<a href="#"><i class="entypo-calendar"></i></a>
											</div>
										</div>
									</div>
									<div class="col-lg-4">
										<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>
									</div>										
								</div>
							</form>
						</div>
						<!--  search form end -->

						<div class="panel panel-primary col-lg-8" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">작업 현황</div>
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


						<div class="panel panel-primary col-lg-4" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">사용 현황</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							<!-- panel body -->
 							<div class="panel-body">
								<div class="dualPosition">
									<div class="dualPosition dualPosition_left">
										<img src="assets/images/crop-1.jpg" width="130" alt="" />
									</div>
									<div class="dualPosition dualPosition_right">
										<div>
											<span>전체</span>&nbsp;&nbsp;<span id='F_TOTAL_AMT'>11111</span><span>&nbsp;&nbsp;Gb</span>
										</div>
										<div>
											<span>사용</span>&nbsp;&nbsp;<span id='F_USED_AMT'>11111</span><span>&nbsp;&nbsp;Gb</span>
										</div>
										<div>
											<span>여유</span>&nbsp;&nbsp;<span id='F_FREE_AMT'>11111</span><span>&nbsp;&nbsp;Gb</span>
										</div>
										<div>
											<span>상태</span>&nbsp;&nbsp;<span id='F_STATUS'>양호</span>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
					<!--  left list end -->
									

					<form role="form" method="post" name="SetJobForm" id="SetJobForm"  class="form-horizontal validate" action="" >

						<!--  right1 info start -->
						<div id="detail-area" class="col-lg-12 container-fluid">	  
						 
							<div class="panel panel-primary" data-collapsed="0">
								<!-- panel head -->
								<div class="panel-heading">
									<div class="panel-title">작업처리 이력</div>
									<div class="panel-options">
										<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
									</div>
								</div>
								
								<!-- panel body -->
								<div class="panel-body">
									<div id= "tableDivID2">
										<table id="jqGrid2"></table>
									    <div id="jqGridPager2"></div>
									</div>
								</div> <!-- panel-body  -->
							</div> <!--  id="pannel"  -->

						</div> <!--  id="detail-area"  -->
						<!--  right2 info end -->
					</form>
																				
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
	<script src="assets/a1ck/js/jobMonitor.js"></script>

	<link rel="stylesheet" href="assets/js/daterangepicker/daterangepicker-bs3.css">
	<script src="assets/a1ck/js/bootstrap-datepicker_a1ck.js"></script>
	

</body>
</html>