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

function geoFindMe() {

  const status = document.querySelector('#status');
  const mapLink = document.querySelector('#map-link');

  mapLink.href = '';
  mapLink.textContent = '';

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = '';
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }

}


/*모달*/
function fnModuleInfo2(){
	$('#MoaModal .modal-content').load("modalSector.jsp");
	$('#MoaModal').modal();
}
function fnModuleInfo3(){
	$('#MoaModal .modal-content').load("modalBoat.jsp");
	$('#MoaModal').modal();
}

</script>
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
				<li><a href="#">계류지관리</a></li>
				<li><a href="#">계류지관리</a></li>
				<li class="active"><strong>계류지 정보관리</strong></li>
			</ol>
	
			<div class='myTitleBox'>계류지 정보관리</div>
				<!--  search form start -->
				<div class=" search_cond col-lg-12">
					<form class="search-form"> 
						<div class="col-lg-12">
                            <div class="col-sm-3">
                                <div class="input-group ">
                                    <input type="text" class="form-control" id="C_BOAT_NM"  name="C_BOAT_NM"  placeholder="이름또는 ID를 입력하세요." >
                                    <div class="input-group-addon">
                                        <a href="javascript:;" onclick="jQuery('#modal-6').modal('show', {backdrop: 'static'});"><i class="entypo-list"></i></a>
                                    </div>                                      
                                    <input type="hidden" id="C_BOAT_ID"  name="C_BOAT_ID"   >
                                </div>
                            </div>                              
							<div class="col-sm-8" >
								<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-default">조회</button>&nbsp;&nbsp;
								<button onclick="return false;" id="btnAdd"     class="btn btn-sm btn-primary">신규</button>&nbsp;&nbsp;
								<button onclick="return false;" id="btnDelete"  class="btn btn-sm btn-red">삭제</button>&nbsp;&nbsp;
								<button onclick="return false;" id="btnSave"    class="btn btn-sm btn-blue">저장</button>
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
					<div id="detail-area" class="col-lg-4 container-fluid" >	  
					 
						<div class="panel panel-primary" data-collapsed="0">
							<!-- panel head -->
							<div class="panel-heading">
								<div class="panel-title">계류지정보 상세</div>
								<div class="panel-options">
									<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
								</div>
							</div>
							
							<!-- panel body -->
							<div class="panel-body">
								<form role="form" method="post" name="SetAnchorForm" id="SetAnchorForm"  class="form-horizontal validate" action="" >
							
									<input type="hidden" class="form-control" id="CRUD" name="CRUD"  value="C">
									<input type="hidden" class="form-control" id="ROWID" name="ROWID"  >
							
									<div class="form-group">
										<label for="f_name" class="col-sm-3 control-label">계류지ID</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_ANCHOR_ID" readonly>
										</div>
									</div>
																	
									<div class="form-group">
										<label for="f_orgNm" class="col-sm-3 control-label">계류지명</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="F_ANCHOR_NM"   >
										</div>
									</div>

                                    <div class="form-group">
                                        <label for="f_name" class="col-sm-3 control-label">구역명</label>
                                        <div class="col-sm-8">
                                            <input type="hidden" class="form-control" id="F_SECTOR_ID" readonly>
                                            <div class="input-group ">
	                                            <input type="text" class="form-control" id="F_SECTOR_NM"  readonly >
		                                        <!-- 
		                                        <div class="input-group-addon">
		                                            <a href="javascript:;" onclick="jQuery('#modal-6').modal('show', {backdrop: 'static'});"><i class="entypo-archive"></i></a>
		                                        </div>
		                                        -->  
												<div class="input-group-addon">
		                                            <a onclick="fnModuleInfo2()"><i class="entypo-archive"></i></a>
		                                        </div>                                      
		                                                                            
		                                    </div>
                                        </div>
                                    </div>
									
                                    <div class="form-group">
                                        <label for="f_orgNm" class="col-sm-3  control-label">정박상태</label>
                                        <div class="col-sm-8">                              
                                            <div >
                                                <select class="form-control" id="F_BOAT_STATUS" name="F_BOAT_STATUS" >
                                                <%=codeClass.getComboBoxByCodeList("BOAT_STATUS", "", true) %>
                                                </select>                                                       
                                            </div>                                                  
                                        </div>
                                    </div>
	
                                    <div class="form-group">
                                        <label for="f_name" class="col-sm-3 control-label">보트명</label>
                                        <div class="col-sm-8">
                                            <input type="hidden" class="form-control" id="F_BOAT_ID" readonly>
                                            <div class="input-group ">
	                                            <input type="text" class="form-control" id="F_BOAT_NM"  readonly >
		                                        <div class="input-group-addon">
		                                            <a onclick="fnModuleInfo3()"><i class="entypo-archive"></i></a>
		                                        </div>                                      
		                                    </div>
                                        </div>
                                    </div>

	
								</form>
							</div> <!-- panel-body  -->
						</div> <!--  id="pannel"  -->
					</div> <!--  id="detail-area"  -->
					<!--  right info end -->




<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Open modal for @getbootstrap</button>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">New message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="col-form-label">Recipient:</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Send message</button>
      </div>
    </div>
  </div>
</div>



																
				</div>
				<!-- main-sub-content end-->
			</div> <!-- myTitleBox -->
			
			
			<!-- Footer start-->
			<%@ include file="footerInfo.jsp" %>
			<!-- Footer end-->
		</div> <!--main-content -->
	</div>







	<!-- Moa Modal-->
	<div class="modal fade" id="MoaModal" tabindex="-1" role="dialog" aria-labelledby="userSearch" aria-hidden="true">
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
			</div>
		</div>
	</div>

    
    <div class="modal fade" id="modal-6"> <!-- Modal start-->
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">계류지찾기</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="field-1" class="control-label">Name</label>
                                <input type="text" class="form-control" id="field-1" placeholder="John">
                            </div>  
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="field-2" class="control-label">Surname</label>
                                <input type="text" class="form-control" id="field-2" placeholder="Doe">
                            </div>  
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="field-3" class="control-label">Address</label>
                                <input type="text" class="form-control" id="field-3" placeholder="Address">
                            </div>  
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="field-4" class="control-label">City</label>
                                <input type="text" class="form-control" id="field-4" placeholder="Boston">
                            </div>  
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="field-5" class="control-label">Country</label>
                                <input type="text" class="form-control" id="field-5" placeholder="United States">
                            </div>  
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="field-6" class="control-label">Zip</label>
                                <input type="text" class="form-control" id="field-6" placeholder="123456">
                            </div>  
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group no-margin">
                                <label for="field-7" class="control-label">Personal Info</label>
                                <textarea class="form-control autogrow" id="field-7" placeholder="Write something about yourself"></textarea>
                            </div>  
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-info">Save changes</button>
                </div>
            </div>
        </div>
    </div> 


    
    <div class="modal fade" id="modal-8">  
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">보트찾기</h4>
                </div>
                <div class="modal-body">
		                    <div class="row">
		                        <div class="col-md-7">
		                            <div class="form-group">
		                                <input type="text" class="form-control" id="C_BOAT_NM2"  name="C_BOAT_NM2"  placeholder="이름또는 ID를 입력하세요." >
		                            </div>  
		                        </div>
		                        <div class="col-md-5">
		                            <div class="form-group">
		                                <button onclick="return false;" id="btnQuery2"   class="btn btn-sm btn-default">조회</button>&nbsp;&nbsp;
	                                	<button onclick="return false;" id="btnSave2"    class="btn btn-sm btn-blue"   >적용</button>
		                            </div>  
		                        </div>
		                    </div>                
			              
			                <!-- main-sub-content start-->
			                <div class="main-sub-content" >
			                
			                    <!--  left list start -->
			                    <div class="col-lg-8">                                      
			                        <div class="panel panel-primary" data-collapsed="0">
			                            <!-- panel body -->
			                            <div class="content">
			                                <!-- 그리드가 삽입될 DIV -->
			                                <div id="gridHolderSub2" style="width:100%; height:600px;"></div>
			                                <div class="gridPagingSub2" id="gridPageNavigationDivSub2"></div>
			                            </div>
			                        </div>
			                    </div>
			                </div>		
								                	                                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div> <!-- Modal end-->    


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
	<script src="assets/a1ck/js/anchorInfo.js"></script>		

</body>
</html>