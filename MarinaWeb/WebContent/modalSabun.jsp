<!DOCTYPE html>
<%@ page contentType="text/html;charset=utf-8"%>
<html lang="en">

<link rel="stylesheet" href="assets/dynatree/dist/skin/ui.dynatree.css">
	
<script type="text/javascript">
function showUserSearchModal0()
{
	jQuery('#userSearch').modal('show', {backdrop: 'static'});
	sPocus = 0;
}
function showUserSearchModal1()
{
	jQuery('#userSearch').modal('show', {backdrop: 'static'});
	sPocus = 1;
}
function showUserSearchModal2()
{
	jQuery('#userSearch').modal('show', {backdrop: 'static'});
	sPocus = 2;
}
</script>
	
	<!-- userSearch (Ajax Modal)-->
	<div class="modal fade"  data-backdrop="static" id="userSearch">
		<div class="modal-dialog" style="width:40%">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title">사용자 찾기</h4>
				</div>
				<div class="modal-body">
						<!--  search form start -->
						<div class=" search_cond">
							<form class="search-form"> 
								<div >
									<input type="radio" name="optionsRadios" id="optionsRadios1" value="1" >사번
									<input type="radio" name="optionsRadios" id="optionsRadios2" value="2" checked>이름
									<input type="text" id="searchVal"  name="searchVal"  class="control" placeholder=" Search" >
									<button onclick="return false;" id="btnQuery"   class="btn btn-sm btn-primary">조회</button>
								</div>
							</form>
						</div>
						<!--  search form end --> 
			
							<!-- main-sub-content start-->
							<div class="main-sub-content" >
								<div class="row">
									<div class="panel panel-primary" data-collapsed="0">
										<!-- div class="panel-heading"> 
											<div class="panel-title">
												조직도
											</div> 
											<div class="panel-options"> 
												<a href="#" data-rel="collapse"><i class="entypo-down-open"></i></a> 
												<a href="#" data-rel="reload"><i class="entypo-arrows-ccw"></i></a> 
											</div> 
										</div -->
										<div class="panel-body no-padding" style="padding: 5px 0;"> 
											<div class="sabun_panel">
												<div class="sabun_panel_left" id="dynatreeSabun"></div>
												<div class="sabun_panel_right list-group2" id="sabun_list"></div>
											</div>
										</div> 
										
										<!-- div class="panel-body border-top"></div -->
									</div>
								</div> 
							</div>
							<!-- main-sub-content end-->
					
				</div> <!--  modal-body  -->
				<div class="modal-footer">
					<button type="button" name="close" class="btn btn-default" data-dismiss="modal">Close</button>
					<!--  button type="button" class="btn btn-info">Save changes</button -->
				</div>				
			</div>
		</div>
	</div>

