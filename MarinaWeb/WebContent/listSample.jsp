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

<title>융합보안플랫폼 | Blank Page</title>

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
<link rel="stylesheet" href="assets/css/neon-core.css">
<link rel="stylesheet" href="assets/css/neon-theme.css">
<link rel="stylesheet" href="assets/css/neon-forms.css">
<!-- 
	<link rel="stylesheet" href="//jqueryui.com/jquery-wp-content/themes/jqueryui.com/style.css">
	<link rel="stylesheet" href="assets/css/custom.css">
	<link rel="stylesheet" href="assets/css/datepicker.css" >
 -->
<!-- link rel="stylesheet" href="assets/css/skins/facebook.css" -->

<script src="assets/js/jquery-1.12.4.js"></script>
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

<body class="page-body" data-url="http://neon.dev">


	<!-- header start -->
	<%@ include file="headerInfo.jsp" %>
	<!-- header end-->

	<div class="main-content">
				
		<div class="row">
			<ol class="breadcrumb bc-3" >
				<li><a href="index.html"><i class="fa-home"></i>Home</a></li>
				<li><a href="tables-main.html">Tables</a></li>
				<li class="active"><strong>Data Tables</strong></li>
			</ol>
	
			<h3>Exporting Table Data</h3>
			
			<br />
			
			<script type="text/javascript">
			
			$(document).ready( function( ) {
				
			
				var editor;
				
				var $table4 = jQuery( "#table-4" );
				
				var oPostData = {'sabun':'*','name':'김동'};				    
			 
			    var _table_ = $table4.dataTable( {
					dom: 'Bfrtip',
					searching: false,
					buttons: [ 
						'excelHtml5',
						'csvHtml5',
						'pdfHtml5'
					],
			        sServerMethod: "GET",
			        //aoAjaxData:oPostData,
			        sAjaxSource: 'GetPacsiiAuthList',	// 사용자 서블릿명을 기입(web.xml에 등록)
		            columns : [
		                {"data":"sabun" },			 
		                {"data":"name"},			 
		                {"data":"systemNm" },		 
		                {"data":"authNm" },			 
		                {"data":"statusNm" },		 
		                {"data":"status" },			 
		                {"data":null},				 
		                {"data":null},
		                {"data":null},
		                {"data":null}
		     	    ],
		     	    columnDefs: [
		     	        { targets: [2, 4], visible: false},
		     	        { targets:[-4], "defaultContent" : '<div style="text-align:center"><button style="width:50%; margin-top: 5px;"  class="btn btn-danger"> delete </button></div>'},
		     	        { targets:[-3], "defaultContent" : '<div style="text-align:center"><input id="929b005c-012e-463d-b236-2ac3f94f4501" type="checkbox"  style="border-radius: 4px;width: 20px;height: 20px;font-size: 12px;"></div>'},
		     	        { targets:[-2], "defaultContent" : '<div class="input-group date"><input type="text" name="geboortedatum" class="datepicker hasDatepicker" id="a111111" class="form-control"></div>'},
		     	        { targets:[-1], "defaultContent" : '<div class="input-group date"><input type="text" class="datetimepicker1 form-control" /></div>'}
		     	    ]
			        ,
		     		fnServerParams: function ( aoData ) {	// 서블릿으로 전달될 parameter 값들을 정의 
		     			aoData.push({'sabun':'*','name':'김동'});
		     		}
				} );
			    
			    
			    
			} );		
			</script>

	<div class="input-group date" >
		<input type="text" name="geboortedatum" class="datepicker" class="form-control">
	</div>

			<table class="table table-bordered datatable" id="table-4">
				<thead>
					<tr>
						<th name="sabun"  >사번</th>
						<th name="name"   >이름</th>
						<th name="systemNm" align="center" >시스템명</th>
						<th name="authNm" align="center" >역활명</th>
						<th name="statusNm" align="center" >선택</th>
						<th name="status" align="center" >선택</th>
						<th name="sdate" align="center">유효시작일</th>
						<th name="edate" align="center">유효종료일</th>
						<th name="edate" align="center" width="200px">AAA</th>
						<th name="edate" align="center" width="200px">BBB</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
 
				<tfoot>
					<tr>
						<th name="sabun"  >사번</th>
						<th name="name"   >이름</th>
						<th name="systemNm" align="center" >시스템명</th>
						<th name="authNm" align="center" >역활명</th>
						<th name="statusNm" align="center" >선택</th>
						<th name="status" align="center" >선택</th>
						<th name="sdate" align="center">유효시작일</th>
						<th name="edate" align="center">유효종료일</th>
						<th name="edate" align="center" width="200px">AAA</th>
						<th name="edate" align="center" width="200px">BBB</th>

					</tr>
				</tfoot>
			 
			</table>

<hr size="15" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade>  
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 
<hr size="5" noshade> 

		
			<!-- lets do some work here... -->

			<!-- Footer start-->
			<%@ include file="footerInfo.jsp" %>
			<!-- Footer end-->
		</div>
	</div>


	<!-- Imported styles on this page -->
	<link rel="stylesheet" href="assets/js/datatables/datatables.css">
	<link rel="stylesheet" href="assets/js/select2/select2-bootstrap.css">
	<link rel="stylesheet" href="assets/js/select2/select2.css">
	<!-- 
	 -->
	
	<!-- Bottom scripts (common) -->
	<script src="assets/js/gsap/TweenMax.min.js"></script>
	<script src="assets/js/joinable.js"></script>
	<script src="assets/js/resizeable.js"></script>
	<script src="assets/js/neon-api.js"></script>
 
	<!-- Imported scripts on this page -->
	<script src="assets/js/jquery.dataTables.min.js"></script>
	<script src="assets/js/select2/select2.min.js"></script>
	<script src="assets/js/neon-chat.js"></script>
	<!-- 
	<script src="assets/js/datatables/datatables.js"></script>
	 -->
	
	<!-- JavaScripts initializations and stuff -->
	<script src="assets/js/neon-custom.js"></script>

	<!-- Demo Settings -->
	<script src="assets/js/neon-demo.js"></script>

	<script type="text/javascript">
				$(document).ready(function() {
				    var options={
				            format: 'yyyy/mm/dd',
				            todayHighlight: true,
				            autoclose: true,
				        };
				    $('#datep1icker').datepicker(options);				    
				});
	</script>
</body>
</html>