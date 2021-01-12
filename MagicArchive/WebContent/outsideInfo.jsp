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
						
			<ol class="breadcrumb bc-3" >
				<li><a href="index.jsp"><i class="fa-home"></i>Home</a></li>
				<li><a href="#">계정관리</a></li>
				<li><a href="#">통합ID관리</a></li>
				<li class="active"><strong>외부사용자관리</strong></li>
			</ol>
	
			<div class='myTitleBox'>외부사용자관리</div>
				<!--  search form start -->
				<div class=" search_cond col-lg-12">
					<form class="search-form"> 
						<div class="col-lg-8">
							<button onclick="return false;" id="btnAdd"      class="btn btn-sm btn-primary">신규</button>
							<button onclick="return false;" id="btnSave"     class="btn btn-sm btn-primary">저장</button>
							<button onclick="return false;" id="btnCancel"   class="btn btn-sm btn-danger" >취소</button>
							<button onclick="return false;" id="btnApproval" class="btn btn-sm btn-primary">결재</button>
						</div>
					</form>
				</div>
				<!--  search form end --> 

				<!-- main-sub-content start-->
				<div class="main-sub-content" >


					<form role="form" method="post" name="SetEmpForm" id="SetEmpForm"  class="form-horizontal validate" action="" enctype="multipart/form-data" >
						<!--  담당자정보 start -->
						<div id="detail-area" class="col-lg-6 container-fluid">	  
						 
							<div class="panel panel-primary" data-collapsed="0">
								<!-- panel head -->
								<div class="panel-heading">
									<div class="panel-title">담당자 정보</div>
									<div class="panel-options">
										<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
									</div>
								</div>
	
								
								<!-- panel body -->
								<div class="panel-body">
								
									<div class="form-group">
										<label for="f_sabun1" class="col-sm-3 control-label">사번</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="f_sabun1" name="f_sabun1" value="<%=userid%>" placeholder="사번" readonly>
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_name2" class="col-sm-3 control-label">이름</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="f_name2" name="f_name2" value="<%=username%>" placeholder="이름"  readonly>
										</div>
									</div>
																	
									<div class="form-group">
										<label for="f_orgNm3" class="col-sm-3 control-label">소속</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" id="f_orgNm3" name="f_orgNm3" value="<%=orgNm%>"placeholder="소속"  readonly>
										</div>
									</div>
	
									<div class="form-group">
										<label for="f_secondApro" class="col-sm-3 control-label">부서결재자</label>	
										<div class="col-sm-8">
											<div class="input-search">
												<input type="text" class="form-control input-search-box" onclick="showUserSearchModal1();" id="f_secondApro" name="f_secondApro"  placeholder="부서결재자" >
												<div class="input-search-icon">
													<i class="entypo-search"></i>
												</div>
											</div>
										</div>
									</div>

									<div class="form-group">
										<label for="f_lastApro" class="col-sm-3 control-label">최종결재자</label>	
										<div class="col-sm-8">
											<div class="input-search">
												<input type="text" class="form-control input-search-box" onclick="showUserSearchModal2();" id="f_lastApro" name="f_lastApro"  placeholder="최종결재자" >
												<div class="input-search-icon">
													<i class="entypo-search"></i>
												</div>
											</div>
										</div>
									</div>
								</div> <!-- panel-body  -->
							</div> <!--  id="pannel"  -->
						</div> <!--  id="detail-area"  -->
						<!--  담당자정보   end -->
						
						
										
						<!--  신청 대상자 정보 start -->
						<div id="detail-area" class="col-lg-6 container-fluid">	  
						 
							<div class="panel panel-primary" data-collapsed="0">
								<!-- panel head -->
								<div class="panel-heading">
									<div class="panel-title">신청 대상자 정보</div>
									<div class="panel-options">
										<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
									</div>
								</div>
								
								<!-- panel body -->
								<div class="panel-body">
									<form role="form" method="post" name="SetEmpForm" id="SetEmpForm"  class="form-horizontal validate" action="" enctype="multipart/form-data" >
								
										<input type="hidden" class="form-control" id="INOUT" name="INOUT"  value="OUT">
																	
										<div class="form-group">
											<label for="f_sabun" class="col-sm-3 control-label">사번</label>
											<div class="col-sm-8">
												<input type="text" class="form-control" id="f_sabun" name="f_sabun" placeholder="사번"  readonly> *자동채번
											</div>
										</div>
		
										<div class="form-group">
											<label for="f_name" class="col-sm-3 control-label">이름</label>
											<div class="col-sm-8">
												<input type="text" class="form-control" id="f_name" name="f_name" placeholder="이름"  >
											</div>
										</div>
																		
										<div class="form-group">
											<label for="f_orgNm" class="col-sm-3 control-label">소속</label>
											<div class="col-sm-8">
												<input type="text" class="form-control" id="f_orgNm" name="f_orgNm" onclick="showDeptSearchModal();" placeholder="소속"  >
												<input type="hidden" class="form-control" id="f_orgCd" name="f_orgCd" >
											</div>
										</div>
		
										<div class="form-group">
											<label for="f_status" class="col-sm-3 control-label">상태</label>
											<div class="col-sm-8" >
												<select class="form-control" id="f_status" >
													<option>상태를 선택하세요.</option>
													<option value="C" > 재직</option>
													<option value="H" > 휴직</option>
													<option value="T" > 퇴직</option>
												</select>
											</div>
										</div>
		
										<div class="form-group">
											<label for="f_email" class="col-sm-3 control-label">이메일</label>											
											<div class="col-sm-8">
												<input type="text" class="form-control" id="f_email" name="f_email"  placeholder="이메일" >
											</div>
										</div>
		
										<div class="form-group">
											<label for="f_mobile" class="col-sm-3 control-label">핸드폰</label>											
											<div class="col-sm-8">
												<input type="text" class="form-control" id="f_mobile" name="f_mobile" placeholder="핸드폰" >
											</div>
										</div>
		
										<div class="form-group">
											<label for="f_office" class="col-sm-3 control-label">사무실</label>											
											<div class="col-sm-8">
												<input type="text" class="form-control" id="f_office" name="f_office" placeholder="사무실" >
											</div>
										</div>
	
										<div class="form-group">
											<label for="f_from" class="col-sm-3 control-label">유효기간</label>
											<div class="col-sm-8">
												<div class="input-group">
													<input type="text" class="form-control datepicker" id="f_from" name="f_from"  data-format="yyyy/mm/dd">
													<div class="input-group-addon">
														<a href="#"><i class="entypo-calendar"></i></a>
													</div>
												</div>
										
												<div class="input-group">
													<input type="text" class="form-control datepicker" id="f_to" name="f_to"  data-format="yyyy/mm/dd">
													<div class="input-group-addon">
														<a href="#"><i class="entypo-calendar"></i></a>
													</div>
												</div>
											</div>
										</div>
	
										<div class="form-group">
											<label for="f_memo" class="col-sm-3 control-label">메모</label>											
											<div class="col-sm-8">
												<textarea class="form-control wysihtml5" rows="4" data-stylesheet-url="assets/css/wysihtml5-color.css" name="post_content" id="post_content"></textarea>
											</div>
										</div>
										
										<div class="form-group">
											<label for="f_memo" class="col-sm-3 control-label">첨부물</label>		
											<div class="col-sm-8">
												<!--  input type="file" class="form-control file2 inline btn btn-primary" multiple="1" data-label="<i class='glyphicon glyphicon-circle-arrow-up'></i> 첨부물선택" /-->
												<div id="aaabbb">
													<div class="fileinput fileinput-new" data-provides="fileinput">
														<span class="btn btn-info btn-file">
															<span class="fileinput-new">파일선택</span>
															<span class="fileinput-exists">변경</span>
															<input type="file" name="f_attach" id="f_attach" >
														</span>
														<span class="fileinput-filename"></span>
														<a href="#" class="close fileinput-exists" data-dismiss="fileinput" style="float: none">&times;</a>
													</div>
												</div>
												<!--  button onclick="return false;" id="btnAttAdd"  class="btn btn-primary">파일추가</button -->
											</div>
											
										</div>
									 
								</form>
								</div> <!-- panel-body  -->
							</div> <!--  id="pannel"  -->
						</div> <!--  id="detail-area"  -->
						<!--  신청 대상자 정보   end -->
						
						
						<!--  첨부물 list start -->
						<!-- 
						<div class="col-lg-4">										
							<div class="panel panel-primary" data-collapsed="0">
								<div class="panel-heading">
									<div class="panel-title">첨부물 목록</div>
									<div class="panel-options">
										<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a>
									</div>
								</div>
								<div class="panel-body">
									<table class="table table-bordered table-striped datatable" id="uTable">
										<thead>
											<tr>
												<th name="idx"     width="15px" class="sorting_asc" rowspan="1" colspan="1">
													<div class="checkbox checkbox-replace">
														<input type="checkbox" id="chk-1">
													</div>
												</th>
												<th name="sabun"      >사번</th>
												<th name="fileName"   >파일명</th>
												<th name="desc"       >설명</th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>
							<div class=" search_cond col-lg-12">
								<form class="search-form"> 
									<div class="col-lg-8">
										<input type="file" class="form-control file2 inline btn btn-primary" multiple="1" data-label="<i class='glyphicon glyphicon-circle-arrow-up'></i> 첨부물선택" />
										<button onclick="return false;" id="btnAttAdd"  class="btn btn-primary">추가</button>
										<button onclick="return false;" id="btnAttDel"  class="btn btn-primary">삭제</button>
									</div>
								</form>
							</div>
					
						</div>
						 -->
						<!--  첨부물 list end -->
					</form>					
					
				</div>
				<!-- main-sub-content end-->
			</div> <!-- myTitleBox -->
			
			
			<!-- modal start -->
			<%@ include file="modalSabun.jsp" %>
			<!-- modal end-->
			
			<!-- modal start -->
			<%@ include file="modalDept.jsp" %>
			<!-- modal end-->
			

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
	<script src="assets/a1ck/js/outsideInfo.js"></script>
	<script src="assets/dynatree/dist/jquery.dynatree.js"></script>
	<script src="assets/a1ck/js/modalSabun.js"></script>
	<script src="assets/a1ck/js/modalDept.js"></script>  

</body>
</html>

