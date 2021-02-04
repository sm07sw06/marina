<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" language="java" %>

	
				<!-- histoty Modal-->
				<div class="modal-header">
				    <h5 class="modal-title" id="userSearch">보트 찾기</h5>
				    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
				        <span aria-hidden="true">×</span>
				    </button>
				</div>

				<div class="modal-body">
						<!--  search form start -->
						<div class="col-md-12">
									<input type="text" id="C_BOAT_NM"  name="C_BOAT_NM"   placeholder=" Search" >&nbsp;&nbsp;
									<button onclick="return false;" id="btnQuery"  class="btn btn-sm btn-primary">조회</button>
						</div>
						<!--  search form end --> 
<!-- 
                          <div class="col-sm-3">
                                <div class="input-group ">
                                    <input type="text" class="form-control" id="C_BOAT_NM"  name="C_BOAT_NM"  placeholder="이름또는 ID를 입력하세요." >
                                    <div class="input-group-addon">
                                        <a href="javascript:;" onclick="jQuery('#modal-6').modal('show', {backdrop: 'static'});"><i class="entypo-list"></i></a>
                                    </div>                                      
                                    <input type="hidden" id="C_BOAT_ID"  name="C_BOAT_ID"   >
                                </div>
                            </div>                              
 -->
			
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


