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
				
				    <div id="wrapper0" data-role="page" data-fullscreen="true">
				
				        <div id="wrapper2">
				
							<!-- div id="img000"><p id='img000_img'></P></div>  --> 
						
							<!--  상단항목  -->
							<div id="img201a"><img id='img201a_img' src="/com.a1ck/images/virus.gif"></img></div>
							<div id="img202a"><img id='img202a_img' src="/com.a1ck/images/defense.gif"></img></div>
							<div id="img203a"><img id='img203a_img' src="/com.a1ck/images/badsw.gif"></img></div>
							<div id="img204a"><img id='img204a_img' src="/com.a1ck/images/privacyi.gif"></img></div>
							<div id="img205a"><img id='img205a_img' src="/com.a1ck/images/control.gif"></img></div>
				
							<!--  상단보안등급  -->
							<div id="img281">
								<p   id='img282_img'>1</P> 
								<div id="img282">
									<div><img id='img281_img' src="/com.a1ck/images/arrow_down2.gif"></img></div>
									<p   id='img283_img'>-0</P>
								</div>
							</div>			
							<div id="img284">
								<div id="img285">
									<p   id='img285_img'>1</P> 
									<p   id='img286_img'>-0</P>
								</div>
								<div><img id='img284_img' src="/com.a1ck/images/arrow_down2.gif"></img></div>
							</div>			
							<div id="img287">
								<div id="img288">
									<p   id='img288_img'>1</P> 
									<p   id='img289_img'>-0</P>
								</div>
								<div><img id='img287_img' src="/com.a1ck/images/arrow_down2.gif"></img></div>
							</div>			
							<div id="img291">
								<div id="img292">
									<p   id='img292_img'>1</P> 
									<p   id='img293_img'>-0</P>
								</div>
								<div><img id='img291_img' src="/com.a1ck/images/arrow_down2.gif"></img></div>
							</div>				
							<div id="img294">
								<div id="img295">
									<p   id='img295_img'>1</P> 
									<p   id='img296_img'>-0</P>
								</div>
								<div><img id='img294_img' src="/com.a1ck/images/arrow_down2.gif"></img></div>
							</div>			
							<div id="img297">
								<div id="img298">
									<p   id='img298_img'>1</P> 
									<p   id='img299_img'>-0</P>
								</div>
								<div><img id='img297_img' src="/com.a1ck/images/arrow_down2.gif"></img></div>
							</div>			
							
							<!--  중단본부구분  -->
							<div id="img211a"><img id='img211a_img' src="/com.a1ck/images/office_main.jpg"></img></div>
							<div id="img212a"><img id='img212a_img' src="/com.a1ck/images/office_taean.jpg"></img></div>
							<div id="img213a"><img id='img213a_img' src="/com.a1ck/images/office_pyungtack.jpg"></img></div>
							<div id="img214a"><img id='img214a_img' src="/com.a1ck/images/office_kunsan.jpg"></img></div>
							<div id="img215a"><img id='img215a_img' src="/com.a1ck/images/office_inchun.jpg"></img></div>
							<div id="img216a"><img id='img216a_img' src="/com.a1ck/images/office_taeandev.jpg"></img></div>
							
							<!--  중단위험지수  -->
							<div id="img261">
								<div id="img262">
									<p   id='img262_img'>1</P> 
									<p   id='img263_img'>-0</P>
								</div>
								<div><img id='img261_img' src="/com.a1ck/images/arrow_down.gif"></img></div>
							</div>	
							<div id="img264">
								<div id="img265">
									<p   id='img265_img'>1</P> 
									<p   id='img266_img'>-0</P>
								</div>
								<div><img id='img264_img' src="/com.a1ck/images/arrow_down.gif"></img></div>
							</div>	
							<div id="img267">
								<div id="img268">
									<p   id='img268_img'>1</P> 
									<p   id='img269_img'>-0</P>
								</div>
								<div><img id='img267_img' src="/com.a1ck/images/arrow_down.gif"></img></div>
							</div>				
							<div id="img271">
								<div id="img272">
									<p   id='img272_img'>1</P> 
									<p   id='img273_img'>-0</P>
								</div>
								<div><img id='img271_img' src="/com.a1ck/images/arrow_down.gif"></img></div>
							</div>	
							<div id="img274">
								<div id="img275">
									<p   id='img275_img'>1</P> 
									<p   id='img276_img'>-0</P>
								</div>
								<div><img id='img274_img' src="/com.a1ck/images/arrow_down.gif"></img></div>
							</div>	
							<div id="img277">
								<div id="img278">
									<p   id='img278_img'>1</P> 
									<p   id='img279_img'>-0</P>
								</div>
								<div><img id='img277_img' src="/com.a1ck/images/arrow_down.gif"></img></div>
							</div>				
				
				
							
				            <!-- 항목 -->
							<div id="img201"><img id='img201_img' src="/com.a1ck/images/virus.gif"></img></div>
							<div id="img202"><img id='img202_img' src="/com.a1ck/images/defense.gif"></img></div>
							<div id="img203"><img id='img203_img' src="/com.a1ck/images/badsw.gif"></img></div>
							<div id="img204"><img id='img204_img' src="/com.a1ck/images/privacyi.gif"></img></div>
							<div id="img205"><img id='img205_img' src="/com.a1ck/images/control.gif"></img></div> 
				
							<!--  배터리  -->
							<div id="img210"><img id='img210_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img211"><img id='img211_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img212"><img id='img212_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img213"><img id='img213_img' src="/com.a1ck/images/battery0.gif"></img></div> 
							<div id="img214"><img id='img214_img' src="/com.a1ck/images/battery0.gif"></img></div>
							
							<div id="img215"><img id='img215_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img216"><img id='img216_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img217"><img id='img217_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img218"><img id='img218_img' src="/com.a1ck/images/battery0.gif"></img></div> 
							<div id="img219"><img id='img219_img' src="/com.a1ck/images/battery0.gif"></img></div>
							
							<div id="img220"><img id='img220_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img221"><img id='img221_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img222"><img id='img222_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img223"><img id='img223_img' src="/com.a1ck/images/battery0.gif"></img></div> 
							<div id="img224"><img id='img224_img' src="/com.a1ck/images/battery0.gif"></img></div>
							
							<div id="img225"><img id='img225_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img226"><img id='img226_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img227"><img id='img227_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img228"><img id='img228_img' src="/com.a1ck/images/battery0.gif"></img></div> 
							<div id="img229"><img id='img229_img' src="/com.a1ck/images/battery0.gif"></img></div>
				
							<div id="img230"><img id='img230_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img231"><img id='img231_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img232"><img id='img232_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img233"><img id='img233_img' src="/com.a1ck/images/battery0.gif"></img></div> 
							<div id="img234"><img id='img234_img' src="/com.a1ck/images/battery0.gif"></img></div>
							
							<div id="img235"><img id='img235_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img236"><img id='img236_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img237"><img id='img237_img' src="/com.a1ck/images/battery0.gif"></img></div>
							<div id="img238"><img id='img238_img' src="/com.a1ck/images/battery0.gif"></img></div> 
							<div id="img239"><img id='img239_img' src="/com.a1ck/images/battery0.gif"></img></div>
							
							<!--  하단레벨  -->
							<div id="img241"><img id='img241_img' src="/com.a1ck/images/gauge1.jpg"></img></div>
							<div id="img242"><img id='img242_img' src="/com.a1ck/images/leveltext.gif"></img></div>
							<div id="img243"><p   id='img243_img'>1</P></div>	
							<div id="img244"><img id='img244_img' src="/com.a1ck/images/gauge1.jpg"></img></div>
							<div id="img245"><img id='img245_img' src="/com.a1ck/images/leveltext.gif"></img></div>
							<div id="img246"><p   id='img246_img'>1</P></div>	
							<div id="img247"><img id='img247_img' src="/com.a1ck/images/gauge1.jpg"></img></div>
							<div id="img248"><img id='img248_img' src="/com.a1ck/images/leveltext.gif"></img></div>
							<div id="img249"><p   id='img249_img'>1</P></div>	
							
							<div id="img251"><img id='img251_img' src="/com.a1ck/images/gauge1.jpg"></img></div>
							<div id="img252"><img id='img252_img' src="/com.a1ck/images/leveltext.gif"></img></div>
							<div id="img253"><p   id='img253_img'>1</P></div>	
							<div id="img254"><img id='img254_img' src="/com.a1ck/images/gauge1.jpg"></img></div>
							<div id="img255"><img id='img255_img' src="/com.a1ck/images/leveltext.gif"></img></div>
							<div id="img256"><p   id='img256_img'>1</P></div>	
							<div id="img257"><img id='img257_img' src="/com.a1ck/images/gauge1.jpg"></img></div>
							<div id="img258"><img id='img258_img' src="/com.a1ck/images/leveltext.gif"></img></div>
							<div id="img259"><p   id='img259_img'>1</P></div>	
							
							
							<!--  
							<div id="index1_imgprev"><img id='imgprev_img' src="/com.a1ck/images/arrow-left.png"></img></div>
							<div id="index1_imgnext"><img id='imgnext_img' src="/com.a1ck/images/arrow-right.png"></img></div>
				 			-->
							
							
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
	
    <script src="assets/a1ck/js/a1ck-js2.js"></script>


</body>

</html>
