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

<title>스마트 마리나항만 불법계류 통합안전관리 시스템</title>

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

<script type="text/javascript" >


</script>
</head>


<body class="page-body" >

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
                <li><a href="#">기초정보관리</a></li>
                <li><a href="#">장치 관리</a></li>
                <li class="active"><strong>보트단말기관리</strong></li>
            </ol>
    
            <div class='myTitleBox'>보트단말기관리</div>
                <!--  search form start -->
                <div class=" search_cond col-lg-12">
                    <form class="search-form"> 
                        <div class="col-lg-12">
                            <div class="col-sm-8" >
                                <div class="col-sm-5">
                                    <div class="input-group ">
                                        <input type="text" class="form-control" id="C_MACHINE_ID"  name="C_MACHINE_ID"  placeholder="단말기No를 입력하세요." >
                                    </div>
                                </div>                              
                                <button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>&nbsp;&nbsp;
                                <button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">신규</button>&nbsp;&nbsp; 
                                <button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red"    >삭제</button>&nbsp;&nbsp;
                                <button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue"   >저장</button>
                            </div>
                            <!-- <button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red" >삭제</button> -->
                        </div>
                    </form>
                </div>
                <!--  search form end --> 

                <!-- main-sub-content start-->
                <div class="main-sub-content" >
                
                    <!--  left list start -->
                    <div class="col-lg-8">                                      
                        <div class="panel panel-primary" data-collapsed="0">
                            <!-- panel body -->
                            <div class="content">
                                <!-- 그리드가 삽입될 DIV -->
                                <div id="gridHolder" style="width:100%; height:600px;"></div>
                                <div class="gridPaging" id="gridPageNavigationDiv"></div>
                            </div>
                        </div>
                    </div>
                    <!--  left list end --> 
                                    
                    <!--  right info start -->
                    <div id="detail-area" class="col-lg-4 container-fluid" style="height:600px;">     
                     
                        <div class="panel panel-primary" data-collapsed="0">
                            <!-- panel head -->
                            <div class="panel-heading">
                                <div class="panel-title">보트단말기 상세</div>
                                <div class="panel-options">
                                    <a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
                                </div>
                            </div>
                            
                            <!-- panel body -->
                            <div class="panel-body">
                                <form role="form" method="post" name="SetBoatForm" id="SetBoatForm"  class="form-horizontal validate" action="" >
                            
                                    <input type="hidden" class="form-control" id="CRUD" name="CRUD"  value="C">
                                    <input type="hidden" class="form-control" id="ROWID" name="ROWID"  >
                                            <input type="hidden" class="form-control" id="F_MARINA_ID">
                            
                                    <div class="form-group">
                                        <label for="f_name" class="col-sm-3 control-label">단말기 No</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" id="F_MACHINE_ID">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="f_name" class="col-sm-3 control-label">보트명</label>
                                        <div class="col-sm-8">
                                            <input type="hidden" class="form-control" id="F_BOAT_ID" readonly>
                                            <div class="input-group ">
	                                            <input type="text" class="form-control" id="F_BOAT_NM"  readonly >
		                                        <div class="input-group-addon">
		                                            <a href="javascript:;" onclick="popupLayerGrid();"><i class="entypo-list-add"></i></a>
		                                        </div>                                      
		                                    </div>
                                        </div>
                                    </div>

                                </form>
                            </div> <!-- panel-body  -->
                        </div> <!--  panel  -->
                    </div> <!-- right info end -->
                </div> <!-- main-sub-content end-->
            </div> <!-- myTitleBox -->
            
            <!-- Footer start-->
            <%@ include file="footerInfo.jsp" %>
            <!-- Footer end-->
            
        </div> <!--main-content -->
    </div>


    
	<div id="question" style="display:none; background-color:#f7f7f7; font-size:16px; color:#353535; letter-spacing:-0.2px; border-radius:3px;">
		<div style="background-color:#213d64; font-size:15px; color:#ffffff; padding:8px; border-top-left-radius:3px; border-top-right-radius:3px;">보트 찾기</div>
		<div style="width:100%; height:360px;">
			<div id="question2" style="padding:10px; height:360px;"></div>
		</div>
		<div style="margin:10px">
			<input type="button" style="width:100px; border-style:none; padding:10px; color:#ffffff; font-size:12px; background-color:#9ba4b0;" id="closebtn" value="닫기" />
			<!-- button type="button" class="btn btn-info">닫기</button -->
		</div>
	</div>
	

    <!-- Bottom scripts (common) -->
    <script src="assets/js/gsap/TweenMax.min.js"></script>
    <script src="assets/js/jquery-ui/js/jquery-ui-1.10.3.minimal.min.js"></script>  
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
    <script src="assets/a1ck/js/deviceBoatAssign.js"></script>      

</body>
</html>