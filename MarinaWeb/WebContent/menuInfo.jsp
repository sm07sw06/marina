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
                        <span class="title">기초정보관리</span>
                    </a>
                    <ul>
                        <li class="has-sub">
                            <a href="#">
                                <i class="entypo-users"></i>
                                <span class="title">회원관리</span>
                            </a>
                            <ul>
                                <li >
                                    <a href="noAuth.jsp" id="menu00033" >
                                        <i class="entypo-user"></i>
                                        <span class="title">회원기초정보관리</span>
                                    </a>
                                </li>
                                <li >
                                    <a href="noAuth.jsp" id="menu00034" >
                                        <i class="entypo-user"></i>
                                        <span class="title">출입내역 조회</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="has-sub">
                            <a href="#">
                                <i class="entypo-users"></i>
                                <span class="title">보트정보 관리</span>
                            </a>
                            <ul>
                                <li >
                                    <a href="noAuth.jsp" id="menu00035" >
                                        <i class="entypo-user"></i>
                                        <span class="title">보트기초정보관리</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="has-sub">
                            <a href="#">
                                <i class="entypo-users"></i>
                                <span class="title">장치 관리</span>
                            </a>
                            <ul>
                                <li >
                                    <a href="noAuth.jsp" id="menu00005" >
                                        <i class="entypo-user"></i>
                                        <span class="title">보트단말기관리</span>
                                    </a>
                                </li>
                                <li >
                                    <a href="noAuth.jsp" id="menu00006" >
                                        <i class="entypo-user"></i>
                                        <span class="title">중계기관리</span>
                                    </a>
                                </li>
                                <li >
                                    <a href="noAuth.jsp" id="menu00007" >
                                        <i class="entypo-user"></i>
                                        <span class="title">정박센서장치관리</span>
                                    </a>
                                </li>
                                <li >
                                    <a href="noAuth.jsp" id="menu00008" >
                                        <i class="entypo-user"></i>
                                        <span class="title">충돌방지장치관리</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                    </ul>   
                </li>

                <li class="has-sub">
                    <a href="#">
                        <i class="entypo-users"></i>
                        <span class="title">계류지 관리 </span>
                    </a>
                    <ul>
                        <li class="has-sub">
                            <a href="#">
                                <i class="entypo-users"></i>
                                <span class="title">계류지관리</span>
                            </a>
                            <ul>
                                <li >
                                    <a href="noAuth.jsp" id="menu00009" >
                                        <i class="entypo-user"></i>
                                        <span class="title">계류지 구역관리</span>
                                    </a>
                                </li>
                                <li >
                                    <a href="noAuth.jsp" id="menu00010" >
                                        <i class="entypo-user"></i>
                                        <span class="title">계류지 정보관리</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="has-sub">
                            <a href="#">
                                <i class="entypo-users"></i>
                                <span class="title">계류지 정박 상태 확인</span>
                            </a>
                            <ul>
                                <li >
                                    <a href="noAuth.jsp" id="menu00011" >
                                        <i class="entypo-user"></i>
                                        <span class="title">계류지별 정박 상태</span>
                                    </a>
                                </li>
                                <li >
                                    <a href="noAuth.jsp" id="menu00012" >
                                        <i class="entypo-user"></i>
                                        <span class="title">보트별 정박 상태</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>   
                </li>
                
                <li class="has-sub">
                    <a href="#">
                        <i class="entypo-users"></i>
                        <span class="title">선박 입출항 관리 </span>
                    </a>
                    <ul>
                        <li >
                            <a href="noAuth.jsp" id="menu00013" >
                                <i class="entypo-user"></i>
                                <span class="title">보트 입출항 내역</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00014" >
                                <i class="entypo-user"></i>
                                <span class="title">미확인 보트 입항 내역</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00015" >
                                <i class="entypo-user"></i>
                                <span class="title">입출항 CCTV 확인</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00017" >
                                <i class="entypo-user"></i>
                                <span class="title">구조요청 내역 확인</span>
                            </a>
                        </li>
                    </ul>   
                </li>

                <li class="has-sub">
                    <a href="#">
                        <i class="entypo-users"></i>
                        <span class="title">대쉬보드</span>
                    </a>
                    <ul>
                        <li >
                            <a href="noAuth.jsp" id="menu00018" >
                                <i class="entypo-user"></i>
                                <span class="title">마리나항 전체 정박현황 관제</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00019" >
                                <i class="entypo-user"></i>
                                <span class="title">마리나항 구역별 정박현황 관제</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00020" >
                                <i class="entypo-user"></i>
                                <span class="title">불법정박 보트 경고/알람</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00021" >
                                <i class="entypo-user"></i>
                                <span class="title">근거리 운항 보트 표시</span>
                            </a>
                        </li>
                    </ul>   
                </li>

                <li class="has-sub">
                    <a href="#">
                        <i class="entypo-users"></i>
                        <span class="title">보고서</span>
                    </a>
                    <ul>
                        <li >
                            <a href="noAuth.jsp" id="menu00022" >
                                <i class="entypo-user"></i>
                                <span class="title">기간별 정박 현황</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00023" >
                                <i class="entypo-user"></i>
                                <span class="title">기간별 미등록 보트 정박 현황</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00024" >
                                <i class="entypo-user"></i>
                                <span class="title">기간별 회원 사용 현황</span>
                            </a>
                        </li>
                    </ul>   
                </li>
                
                <li class="has-sub">
                    <a href="#">
                        <i class="entypo-users"></i>
                        <span class="title">환경설정</span>
                    </a>
                    <ul>
                        <li >
                            <a href="noAuth.jsp" id="menu00030" >
                                <i class="entypo-user"></i>
                                <span class="title">사용자그룹 등록</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00029" >
                                <i class="entypo-user"></i>
                                <span class="title">사용자 권한관리</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00032" >
                                <i class="entypo-user"></i>
                                <span class="title">코드관리</span>
                            </a>
                        </li>
                        <li >
                            <a href="noAuth.jsp" id="menu00031" >
                                <i class="entypo-user"></i>
                                <span class="title">메뉴관리</span>
                            </a>
                        </li>
                    </ul>   
                </li>

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

