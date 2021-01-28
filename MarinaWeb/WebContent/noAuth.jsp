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

	<link rel="stylesheet" href="assets/js/daterangepicker/daterangepicker-bs3.css">
	 
<!-- 
<link rel="stylesheet" href="//jqueryui.com/jquery-wp-content/themes/jqueryui.com/style.css">
 -->
<!-- link rel="stylesheet" href="assets/css/skins/facebook.css" -->

<script src="assets/js/jquery-1.12.4.js"></script>
<script src="assets/js/jquery.form.js"></script>
<!-- script src="assets/jquery-ui-1.12.1.custom/jquery-ui.js"></script-->
<script src="assets/a1ck/js/jquery-ui-ko.js"></script>
<!-- 
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="assets/js/jquery-1.11.3.min.js"></script>
<script src="assets/js/jquery-ui/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
 -->
	 
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
						
			<div class="page-error-404">
				<div class="error-symbol">
					<i class="entypo-attention"></i>
				</div>
				<div class="error-text">
					<p>화면에 대한 권한이 없습니다.</p>
				</div>
				<!--  div class="error-text">
					Search Pages:
					<br />
					<br />
					<div class="input-group minimal">
						<div class="input-group-addon">
							<i class="entypo-search"></i>
						</div>
						<input type="text" class="form-control" placeholder="Search anything..." />
					</div>
				</div -->
			</div>
			

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
	<script src="assets/a1ck/js/bootstrap-datepicker_a1ck.js"></script>

		
	<!-- JavaScripts initializations and stuff -->
	<script src="assets/js/neon-custom.js"></script>

	<!-- Demo Settings -->
	<!-- script src="assets/js/neon-demo.js"></script -->
<script>
	var sessionsabun = "<%=userid%>";
	var sessionapprowait = "<%=approwait%>";	
</script>
	<script src="assets/a1ck/js/userInfo.js"></script>
	<script src="assets/dynatree/dist/jquery.dynatree.js"></script>
	<script src="assets/a1ck/js/modalSabun.js"></script>
	<script src="assets/a1ck/js/modalDept.js"></script>  

</body>
</html>

