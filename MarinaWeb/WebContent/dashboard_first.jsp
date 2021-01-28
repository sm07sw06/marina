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

<title>융합보안플랫폼</title>

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


<body>

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
				<li><a href="#">대쉬보드</a></li>
				<li class="active"><strong>본부별 보안현황</strong></li>
			</ol>
					
					    <div id="wrapper0">
					
					        <div id="wrapper1">
					
									<!--  <p>Date: <input type="text" id="datepicker"></p>  -->
						
						
									<!-- div id="img000"><p id='img000_img' class></P></div> <!-- 날짜 -->
						
						            <!-- /.row -->
									<div id="level00"><img id='level00_img' src="/com.a1ck/images/level1.jpg"></div>
						
									<div id="level01"><img id='level01_img' src="/com.a1ck/images/shield1.gif"></div>
									<div id="level02"><img id='level02_img' src="/com.a1ck/images/shield1.gif"></div>
									<div id="level03"><img id='level03_img' src="/com.a1ck/images/shield1.gif"></div>
									<div id="level04"><img id='level04_img' src="/com.a1ck/images/shield1.gif"></div>
									<div id="level05"><img id='level05_img' src="/com.a1ck/images/shield1.gif"></div>
									<div id="level06"><img id='level06_img' src="/com.a1ck/images/shield1.gif"></div>
						
									<div id="level11"><img src="/com.a1ck/images/office_main.jpg"></img></div>
									<div id="level12"><img src="/com.a1ck/images/office_inchun.jpg"></img></div>
									<div id="level13"><img src="/com.a1ck/images/office_pyungtack.jpg"></img></div>
									<div id="level14"><img src="/com.a1ck/images/office_taean.jpg"></img></div>
									<div id="level15"><img src="/com.a1ck/images/office_taeandev.jpg"></img></div>
									<div id="level16"><img src="/com.a1ck/images/office_kunsan.jpg"></img></div>
						
									<!--  
									<div id="index1_imgprev"><img id='imgprev_img' src="/com.a1ck/images/arrow-left.png"></img></div>
									<div id="index1_imgnext"><img id='imgnext_img' src="/com.a1ck/images/arrow-right.png"></img></div>
						 			-->
					 			
					 			
								<!-- /.row -->
					
					        </div>
								 <div id="alertBox">
									<div id="alertBox1">
											<div class='block marquee'> 
												<ul id="ticker"></ul>
											</div>
									</div>
								</div>
					        <!-- /#page-wrapper -->
					
					    </div>
					    <!-- /#wrapper -->
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
	<script src="assets/a1ck/js/userInfo.js"></script>
	
    <script src="assets/a1ck/js/a1ck-js1.js"></script>

</body>

</html>
