<!DOCTYPE html>
<%@ page contentType="text/html;charset=utf-8"%>

	<!-- headerinfo start -->
	
	<div class="sidebar-menu fixed">
	
		<!-- sidebar start -->
		<div class="sidebar-menu-inner">

			<header class="logo-env">

				<!-- logo -->
				<div class="logo">
					<a href="index.jsp">
						<!--  img src="assets/images/logo@2x.png" width="120" alt="" / -->
						<h_2>마리나 &nbsp;항만</h_2>
					</a>
				</div>

				<!-- logo collapse icon -->
				<div class="sidebar-collapse">
					<a href="#" class="sidebar-collapse-icon"><!-- add class "with-animation" if you want sidebar to have animation during expanding/collapsing transition -->
						<i class="entypo-menu"></i>
					</a>
				</div>

								
				<!-- open/close menu icon (do not remove if you want to enable menu on mobile devices) -->
				<div class="sidebar-mobile-menu visible-xs">
					<a href="#" class="with-animation"><!-- add class "with-animation" to support animation -->
						<i class="entypo-menu"></i>
					</a>
				</div>

			</header>
			
									
			<ul id="main-menu" class="main-menu">
				<!-- add class "multiple-expanded" to allow multiple submenus to open -->
				<!-- class "auto-inherit-active-class" will automatically add "active" class for parent elements who are marked already with class "active" -->

				<li class="has-sub">
					<a href="#">
						<i class="entypo-users"></i>
						<span class="title">기초등록</span>
					</a>
					<ul>
						<li >
							<a href="noAuth.jsp" id="menu00001" >
								<i class="entypo-user"></i>
								<span class="title">서버 등록</span>
							</a>
						</li>
						<li >
							<a href="noAuth.jsp" id="menu00016" >
								<i class="entypo-user"></i>
								<span class="title">서버 등록(old)</span>
							</a>
						</li>
						<li>
							<!--  a href="userInfo.jsp" -->
							<a href="noAuth.jsp" id="menu00002" >
								<i class="entypo-user"></i>
								<span class="title">업무 등록</span>
							</a>
						</li>
						<li>
							<a href="noAuth.jsp" id="menu00003" >
								<i class="entypo-users"></i>
								<span class="title">Agent  등록</span>
							</a>
						</li>
						<li>
							<a href="noAuth.jsp" id="menu00004" >
								<i class="entypo-users"></i>
								<span class="title">데몬정보 등록</span>
							</a>
						</li>
						<li>
							<a href="noAuth.jsp" id="menu00005" >
								<i class="entypo-users"></i>
								<span class="title">테이블 등록</span>
							</a>
						</li>
						<li>
							<a href="noAuth.jsp" id="menu00015" >
								<i class="entypo-users"></i>
								<span class="title">코드관리</span>
							</a>
						</li>
						<li>
							<a href="noAuth.jsp" id="menu00017" >
								<i class="entypo-users"></i>
								<span class="title">코드관리2</span>
							</a>
						</li>
					</ul>	

				</li>
				
				<li class="has-sub">
					<a href="index.html">
						<i class="entypo-users"></i>
						<span class="title">사용자관리</span>
					</a>
					<ul>
						<li>
							<!--  a href="userInfo.jsp" -->
							<a href="noAuth.jsp" id="menu00006" >
								<i class="entypo-user"></i>
								<span class="title">사용자그룹 등록</span>
							</a>
						</li>
						<li >
							<a href="noAuth.jsp" id="menu00007" >
								<i class="entypo-user"></i>
								<span class="title">사용자 등록</span>
							</a>
						</li>
						<li >
							<a href="noAuth.jsp" id="menu00008" >
								<i class="entypo-user"></i>
								<span class="title">사용자 권한관리</span>
							</a>
						</li>
						<li >
							<a href="noAuth.jsp" id="menu00018" >
								<i class="entypo-user"></i>
								<span class="title">메뉴관리</span>
							</a>
						</li>
					</ul>	
				</li>
								
				
				<li class="has-sub">
					<a href="index.html">
						<i class="entypo-users"></i>
						<span class="title">작업관리</span>
					</a>
					<ul>
						<li>
							<!--  a href="userInfo.jsp" -->
							<a href="noAuth.jsp" id="menu00009" >
								<i class="entypo-user"></i>
								<span class="title">작업 등록</span>
							</a>
						</li>
						<li >
							<a href="noAuth.jsp" id="menu00010" >
								<i class="entypo-user"></i>
								<span class="title">작업 이력</span>
							</a>
						</li>
						<li >
							<a href="noAuth.jsp" id="menu00011" >
								<i class="entypo-user"></i>
								<span class="title">스케쥴관리</span>
							</a>
						</li>
					</ul>	

				</li>
				<!-- 
				<li class="has-sub">
					<a href="index.html">
						<i class="entypo-users"></i>
						<span class="title">모니터링</span>
					</a>
					<ul>
						<li>
							  a href="userInfo.jsp" 
							<a href="noAuth.jsp" id="menu00012" >
								<i class="entypo-user"></i>
								<span class="title">DBMS  모니터링</span>
							</a>
						</li>
						<li>
							  a href="userInfo.jsp" 
							<a href="noAuth.jsp" id="menu00013" >
								<i class="entypo-user"></i>
								<span class="title">작업 모니터링</span>
							</a>
						</li>
						<li >
							<a href="noAuth.jsp" id="menu00014" >
								<i class="entypo-user"></i>
								<span class="title">Agent  모니터링</span>
							</a>
						</li>
					</ul>	
				</li>
				-->
				
			</ul>
				
		</div>	
		<!-- sidebar end -->

	</div>					  
	<!-- headerinfo end-->
	
<script>
	var jsonObj = new Object();
	jsonObj.user_cd = '<%=session.getAttribute("userid") %>';
	
	$.ajax({
		url: 'GetMenuList',  
		dataType:"json", 
		data:{param:JSON.stringify(jsonObj)},
		success: function(json_data) { 
	
			if(json_data.result == 'OK') {
			    $.each(json_data.menuData, function(i,n) {
			    	refreshMenu($("#menu" + n.MENU_CD),n.MENU_URL);
				});
			}
		}
	});	
	
	function refreshMenu(menuid, menusrc) {
		var nIndex ;
		menuid.attr("href",menusrc);
	}
</script>

