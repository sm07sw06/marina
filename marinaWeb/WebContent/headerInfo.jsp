<%@ page contentType="text/html;charset=utf-8"%>
<%
String userid    = (String)session.getAttribute("userid"   );
String username  = (String)session.getAttribute("username" );
String picture   = (String)session.getAttribute("picture"  );
String orgNm     = (String)session.getAttribute("orgNm"    );
String approwait = (String)session.getAttribute("approwait"); 
String sessionsabun = (String)session.getAttribute("sessionsabun");
if (userid == ""||userid == null) { %>
<script>
window.location.href = "/marinaWeb/login.jsp";
</script>
<% } %>

<div class = "head-content">        
    <!-- Profile Info and Notifications -->
    <div class="col-md-6 col-sm-8 clearfix">
        <ul class="user-info pull-left pull-none-xsm">
            <!-- Profile Info -->
            <li class="profile-info dropdown"><!-- add class "pull-right" if you want to place this from right -->
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true" aria-expanded="true">
                    <% if (picture == ""||picture == null) { %><img src="assets/images/thumb-1.png" alt="" class="img-circle" width="44" height="44" /> <%} else { %>
                    <img src="userImages/<%=picture%>" alt="" class="img-circle" width="44"  height="44" /> <% }%>
                    <%=username%>&nbsp;/&nbsp;<!-- %=orgNm% --> 
                </a>
                <ul class="dropdown-menu">
                    <!-- Reverse Caret -->
                    <li class="caret"></li>
                    <!-- Profile sub-links -->
                    <li>
                        <a href="extra-timeline.html">
                            <i class="entypo-user"></i>
                            Edit Profile
                        </a>
                    </li>
                    <li>
                        <a href="mailbox.html">
                            <i class="entypo-mail"></i>
                            Inbox
                        </a>
                    </li>
                    <li>
                        <a href="extra-calendar.html">
                            <i class="entypo-calendar"></i>
                            Calendar
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="entypo-clipboard"></i>
                            Tasks
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="user-info pull-left pull-right-xs pull-none-xsm">
            <!-- Message Notifications syaty -->
            <li class="notifications dropdown">
                <!-- a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i class="entypo-mail"></i>
                    <span class="badge badge-secondary">< %=approwait %></span>
                </a -->
                <ul class="dropdown-menu">
                    <li>
                        <form class="top-dropdown-search">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Search anything..." name="s" />
                            </div>
                        </form>
                        <ul class="dropdown-menu-list scroller">
                            <li class="active">
                                <a href="#">
                                    <span class="image pull-right">
                                    <img src="assets/images/thumb-1@2x.png" width="44" alt="" class="img-circle" />
                                    </span>
                                    <span class="line">
                                    <strong>Luc Chartier</strong>
                                    - yesterday
                                    </span>
                                    <span class="line desc small">
                                    This ain’t our first item, it is the best of the rest.
                                    </span>
                                </a>
                            </li>
                            <li class="active">
                                <a href="#">
                                    <span class="image pull-right">
                                    <img src="assets/images/thumb-2@2x.png" width="44" alt="" class="img-circle" />
                                    </span>
                                    <span class="line">
                                    <strong>Salma Nyberg</strong>
                                    - 2 days ago
                                    </span>
                                    <span class="line desc small">
                                    Oh he decisively impression attachment friendship so if everything. 
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class="image pull-right">
                                    <img src="assets/images/thumb-3@2x.png" width="44" alt="" class="img-circle" />
                                    </span>
                                    <span class="line">
                                    Hayden Cartwright
                                    - a week ago
                                    </span>
                                    <span class="line desc small">
                                    Whose her enjoy chief new young. Felicity if ye required likewise so doubtful.
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class="image pull-right">
                                    <img src="assets/images/thumb-4@2x.png" width="44" alt="" class="img-circle" />
                                    </span>
                                    <span class="line">
                                    Sandra Eberhardt
                                    - 16 days ago
                                    </span>
                                    <span class="line desc small">
                                    On so attention necessary at by provision otherwise existence direction.
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="external">
                        <a href="mailbox.html">All Messages</a>
                    </li>
                </ul>
            </li>
            <!-- Message Notifications end -->      
            <!-- Task Notifications -->
            <li class="notifications dropdown">
                <!-- a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i class="entypo-list"></i>
                    <span class="badge badge-warning">< %=approwait% ></span>
                </a -->
                <ul class="dropdown-menu">
                    <li class="top">
                        <p>You have 6 pending tasks</p>
                    </li>
                    <li>
                        <ul class="dropdown-menu-list scroller">
                            <li>
                                <a href="#">
                                    <span class="task">
                                    <span class="desc">Procurement</span>
                                    <span class="percent">27%</span>
                                    </span>
                                    <span class="progress">
                                    <span style="width: 27%;" class="progress-bar progress-bar-success">
                                    <span class="sr-only">27% Complete</span>
                                    </span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class="task">
                                    <span class="desc">App Development</span>
                                    <span class="percent">83%</span>
                                    </span>
                                    <span class="progress progress-striped">
                                    <span style="width: 83%;" class="progress-bar progress-bar-danger">
                                    <span class="sr-only">83% Complete</span>
                                    </span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class="task">
                                    <span class="desc">HTML Slicing</span>
                                    <span class="percent">91%</span>
                                    </span>
                                    <span class="progress">
                                    <span style="width: 91%;" class="progress-bar progress-bar-success">
                                    <span class="sr-only">91% Complete</span>
                                    </span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class="task">
                                    <span class="desc">Database Repair</span>
                                    <span class="percent">12%</span>
                                    </span>
                                    <span class="progress progress-striped">
                                    <span style="width: 12%;" class="progress-bar progress-bar-warning">
                                    <span class="sr-only">12% Complete</span>
                                    </span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class="task">
                                    <span class="desc">Backup Create Progress</span>
                                    <span class="percent">54%</span>
                                    </span>
                                    <span class="progress progress-striped">
                                    <span style="width: 54%;" class="progress-bar progress-bar-info">
                                    <span class="sr-only">54% Complete</span>
                                    </span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span class="task">
                                    <span class="desc">Upgrade Progress</span>
                                    <span class="percent">17%</span>
                                    </span>
                                    <span class="progress progress-striped">
                                    <span style="width: 17%;" class="progress-bar progress-bar-important">
                                    <span class="sr-only">17% Complete</span>
                                    </span>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="external">
                        <a href="#">See all tasks</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>

    <!-- Raw Links -->
    <div class="col-md-6 col-sm-4 clearfix hidden-xs">
        <ul class="list-inline links-list pull-right">
            <li class="sep"></li>
            <li>
                <a href="login.jsp">
                    로그아웃 <i class="entypo-logout right"></i>
                </a>
            </li>
        </ul>
    </div>

    <hr />

    <script type="text/javascript">
        jQuery(document).ready(function($)
        {
            // Sample Toastr Notification
            /***
            setTimeout(function()
            {
                var opts = {
                    "closeButton": true,
                    "debug": false,
                    "positionClass": rtl() || public_vars.$pageContainer.hasClass('right-sidebar') ? "toast-top-left" : "toast-top-right",
                    "toastClass": "black",
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                };
                toastr.success("You have been awarded with 1 year free subscription. Enjoy it!", "Account Subcription Updated", opts);
            }, 3000);
            ***/
        });
    </script>
</div> <!--  head-content -->
