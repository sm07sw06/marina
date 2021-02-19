var gridAppG1, gridRootG1;	// 데이터와 그리드를 포함하는 객체
var dataGridG1;	// 그리드
  	var gridDataG1;

console.log("11111111111");
  	// ----------------------- 그리드 설정 시작 -------------------------------------

  	// rMateGridH5에서 그리드 생성 준비가 완료될 경우 호출할 함수를 지정합니다.
  	var jsVarsG1 = "rMateOnLoadCallFunction=gridReadyHandlerG1";
  	//rMateGrid 관련 객체
  	var collectionG1;	// 그리드의 데이터 객체
  	var cntG1=0;
  	//var gridData = [];
  	var jsonObjG1 = new Object();

  	console.log("22222222222222");

  	// rMateDataGrid 를 생성합니다.
  	// 파라메터 (순서대로)
  	//  1. 그리드의 id ( 임의로 지정하십시오. )
  	//  2. 그리드가 위치할 div 의 id (즉, 그리드의 부모 div 의 id 입니다.)
  	//  3. 그리드 생성 시 필요한 환경 변수들의 묶음인 jsVarsG1
  	//  4. 그리드의 가로 사이즈 (생략 가능, 생략 시 100%)
  	//  5. 그리드의 세로 사이즈 (생략 가능, 생략 시 100%)
  	rMateGridH5.create("grid1G1", "gridHolderG1", jsVarsG1, "100%", "100%");

console.log("3333333333333");
  	
  	// 그리드의 속성인 rMateOnLoadCallFunction 으로 설정된 함수.
  	// rMate 그리드의 준비가 완료된 경우 이 함수가 호출됩니다.
  	// 이 함수를 통해 그리드에 레이아웃과 데이터를 삽입합니다.
  	// 파라메터 : id - rMateGridH5.create() 사용 시 사용자가 지정한 id 입니다.
  	function gridReadyHandlerG1(id) {
  		var gridDataG1 = [];
  		// rMateGrid 관련 객체
  		gridAppG1 = document.getElementById(id);	// 그리드를 포함하는 div 객체
  		gridRootG1 = gridAppG1.getRoot();	// 데이터와 그리드를 포함하는 객체

  		gridAppG1.setLayout(layoutStrG1);
  		gridAppG1.setData(gridDataG1);

  		var layoutCompleteHandlerG1 = function(event) {
  			dataGridG1 = gridRootG1.getDataGrid();	// 그리드 객체
  		}

 // 		refreshDataG1();
  		
  		gridRootG1.addEventListener("layoutComplete", layoutCompleteHandlerG1);
  		gridRootG1.addEventListener("dataComplete", dataCompleteHandlerG1);
  		gridRootG1.addEvent("dblclick", dblclickHandlerG1);
  		
  	}


  	//레이아웃 로드 완료 이벤트 핸들러 함수
  	function dblclickHandlerG1(event) {
  		if(dataGridG1.getSelectedIndex() >= 0 ) {
  			$('#F_BOAT_ID').val(dataGridG1.getSelectedItem().BOAT_ID);
  			$('#F_BOAT_NM').val(dataGridG1.getSelectedItem().BOAT_NM);
  			$('#F_USER_ID').val(dataGridG1.getSelectedItem().USER_ID);
  			$('#F_USER_NM').val(dataGridG1.getSelectedItem().USER_NM);
  			$('#F_BOAT_STATUS').val(dataGridG1.getSelectedItem().BOAT_STATUS);
  			$('#F_BOAT_DESC').val(dataGridG1.getSelectedItem().BOAT_DESC);
  			$('#CRUD').val("U");
  		}
  	}

  	function refreshDataG1()  
  	{
  		var gridDataG1 = [];
  		jsonObjG1 = {};

  		jsonObjG1.__boat_id = $('#C_BOAT_ID').val();
  		jsonObjG1.__boat_nm = $('#C_BOAT_NM').val();
  		jsonObjG1.__use_yn = $('input[name="C_USE_YN"]:checked').val();	
  		jsonObjG1.__rows    = '20';
  		jsonObjG1.__page    = '1';

  		$.ajax({
  		   	url:"GetBoatList",
  			data:{param:JSON.stringify(jsonObjG1)},
  			type:"post",
  		   	dataType:"json",
  			success: function(json_data) {
  		        if(json_data.result == 'OK') {
  			   		$.each(json_data.rows, function(index, value) {
  			   			gridDataG1.push(value);
  			   		});
  				} else {
  					console.log(json_data.result); 
  				}
  			}
  		});	
  		gridAppG1.clear();
  		gridAppG1.setLayout(layoutStr);
  		gridAppG1.setData(gridData);
  	}
  	

//	  	$('#btnQueryModal').click(function (e) {
//	  		alert("dddddddddd");
//	  		refreshDataG1();
//	  	});
  	

  	//----------------------- 그리드 설정 끝 -----------------------

	var layoutStrG1 =
		'<rMateGrid>\
			<NumberFormatter id="numfmt" useThousandsSeparator="true"/>\
			<DataGrid id="dg1" verticalAlign="middle" sortableColumns="true" textAlign="center">\
				<columns>\
					<DataGridColumn dataField="ID" id="colNo" itemRenderer="IndexNoItem" textAlign="center" width="40"/>\
					<DataGridColumn dataField="ANCHOR_ID"   		id="colAnchorId"   		headerText="계류지ID" width="100"  visible="false"   />\
					<DataGridColumn dataField="ANCHOR_NM" 			id="colAnchorNm" 		headerText="계류지" 	width="100"/>\
					<DataGridColumn dataField="SECTOR_ID"   		id="colScetorId"   		headerText="구역ID"  width="100"  visible="false"   />\
					<DataGridColumn dataField="SECTOR_NM" 			id="colScetorNm" 		headerText="구역명" 	width="100"/>\
					<DataGridColumn dataField="ANCHOR_STATUS"   	id="colAnchorStatus" 	headerText="정박상태" width="100" visible="false"   />\
					<DataGridColumn dataField="ANCHOR_STATUS_NM"   	id="colAnchorStatusNm" 	headerText="정박상태" width="100"/>\
					<DataGridColumn dataField="BOAT_ID"   			id="colBoatId" 			headerText="보트ID" 	width="100" visible="false"   />\
					<DataGridColumn dataField="BOAT_NM"   			id="colBoatNm" 			headerText="보트명" 	width="100"/>\
				</columns>\
				<dataProvider>\
					<PagingCollection rowsPerPage="18" source="{$gridData}"/>\
				</dataProvider>\
			</DataGrid>\
		</rMateGrid>';