$(document).ready(function() {
	
//	getServer('1');

	var oTable =  $('#uTable').DataTable({
		language: {
			"decimal":        "",
			"emptyTable":     "데이타가 없습니다.",
			"info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
			"infoEmpty":      "전체 0 건",
			"infoFiltered":   "(총 _MAX_ 개)",
			"infoPostFix":    "",
			"thousands":      ",",
			"lengthMenu":     "페이지당 줄수 _MENU_",
			"loadingRecords": "조회중...",
			"processing":     "처리중...",
			"search":         "검색:",
			"zeroRecords":    "검색 결과가 없습니다.",
			"paginate": {
				"first":      "처음",
				"last":       "마지막",
				"next":       "다음",
				"previous":   "이전"
			},
			"aria": {
				"sortAscending":  ": 오름차순 정렬",
				"sortDescending": ": 내림차순 정렬"
			}
		},			
		searching: false
	});
	
	function position_cm(obj) {
		var windowWidth  = $(window).width();
		var windowHeight = $(window).height();
		var $obj = $(obj);
		var objWidth  = $obj.width();
		var objHeight = $obj.height();
		$obj.css({
			'left':(windowWidth/2) - (objWidth/2),
			'top':(windowHeight/2) - (objHeight/2)
		})
	}
	
	//position_cm($('#jspcontents'));
	
	function getServer(sData){
		var selectTag = "";
		var obj = new Object();
		
		obj.server_id = '*';
		
		$.ajax({
			url: "GetServerList",
			dataType:"json", 
			type: "get",
			data: {param:JSON.stringify(obj)},
			success: function(json){
				console.log(json);
				console.log(json.data.length); 
				console.log(json.data);
				
				selectTag = "";
				for (var idx = 0; idx < json.data.length; idx++) {
					selectTag +='<option value="'+ json.data[idx].SERVER_ID + '"';
					if(sData == json.data[idx].SERVER_ID) 
						selectTag +=' selected' 
					selectTag += '>' + json.data[idx].SERVER_NM +'</option>';
				}
				$("#C_SERVER_ID").append(selectTag);
				console.log(selectTag);
			}
		}); 
	}

	function getJson(object,codeclass, data){
		var allData = { "class": codeclass, "code":"*" };
		$.ajax({
			url: "GetCodeList",
			data: allData, 
			dataType: "json",
			success: function(json){
				makeSelect(object,json.data, data);
			}
		}); 
	}

	function makeSelect(selectTagId, codelist, data ){
		
		var selectTag= "";
		
		$("#" + selectTagId ).html("");
		
		for (var idx = 0; idx < codelist.length; idx++) {
			selectTag +='<option value="'+ codelist[idx]._CODE_ + '"';
			if(data == codelist[idx]._CODE_) 
				selectTag +=' selected' 
			selectTag += '>' + codelist[idx]._NAME_ +'</option>';
		}
		
		console.log(selectTag);
		
		$("#" + selectTagId).append(selectTag); 
	}
	
	function refreshRisk()  
	{
		var obj = new Object();
		
		obj.gb       = 'A';
		obj.table_id = '*';
		obj.table_nm =  $('#C_TABLE_NM').val();
		
//		if(obj.table_nm == "")
//			obj.table_nm = "*";
		
		$('#CRUD').val("U")
		
		oTable = $('#uTable').DataTable({
 			dom: 'Brtip',
 			select: true,
			processing: true,
			serverSide: false,
			searching: false,
			destroy: true,
			pagingType: "full_numbers",
			pageLength: 16,
			ajax: {
		        url:"GetTableList",
				dataType:"json", 
				type: "get",
				data : {param:JSON.stringify(obj)}
			},
			language: {
				"decimal":        "",
			    "emptyTable":     "데이타가 없습니다.",
			    "info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
			    "infoEmpty":      "전체 0 건",
			    "infoFiltered":   "(총 _MAX_ 개)",
			    "infoPostFix":    "",
			    "thousands":      ",",
			    "lengthMenu":     "페이지당 줄수 _MENU_",
			    "loadingRecords": "조회중...",
			    "processing":     "처리중...",
			    "search":         "검색:",
			    "zeroRecords":    "검색 결과가 없습니다.",
			    "paginate": {
			        "first":      "처음",
			        "last":       "마지막",
			        "next":       "다음",
			        "previous":   "이전"
			    },
			    "aria": {
			        "sortAscending":  ": 오름차순 정렬",
			        "sortDescending": ": 내림차순 정렬"
			    }
	        },			
            columns : [
                {"data":"TABLE_ID"},			 
                {"data":"TABLE_CD"},			 
                {"data":"TABLE_NM"},			 
                {"data":"SAVE_PREQ_CD"},		 
                {"data":"SAVE_PREQ"},		 
                {"data":"DESCRIPTION"},		 
                {"data":"USE_YN"}
     	    ]
	        ,columnDefs: [
     	        { targets: [0,3,4,5,6], visible: false}
     	    ]		     		  
		});		
		$('#F_TABLE_ID'    ).attr("readonly", true); //설정
	 }
   
    $('#uTable tbody').on( 'click', 'tr', function () {
    	
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
        	oTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        var sData = oTable.rows('.selected').data()[0];
        
        loadInfo(sData.TABLE_ID,sData.TABLE_CD  ,sData.TABLE_NM,sData.SAVE_PREQ_CD,sData.SAVE_PREQ,sData.DESCRIPTION,sData.USE_YN);

    } );
    
    
    $('#btnQuery').click(function (e) {
		refreshRisk();
	});
	
	$('#btnCancel').click(function (e) {
		$('#searchVal').val("");
		$("#searchVal").focus();
	});

	$('#btnAdd').click(function (e) {
		$('#F_TABLE_ID'   ).val("");
		$('#F_TABLE_CD'   ).val("");
		$('#F_TABLE_NM'   ).val("");
		$('#F_SAVE_PREQ'  ).val("");
		$('#F_DESCRIPTION').val("");
		$('input[name="F_USE_YN"]').val(["Y"]);
		$('#F_SAVE_PREQ_CD').val("");
		$('#CRUD'         ).val("C");
		$('#F_TABLE_ID'   ).attr("readonly", false); //설정
	});
	
	$('#btnDelete').click(function (e) {
		var formData = new FormData();
		
		var obj = new Object();
		obj.table_id   = $("input#F_TABLE_ID").val();
		obj.crud        = "D";
		
		console.log('F_TABLE_ID:'+ obj.table_id);
		console.log('sCrud:'+ obj.crud);

		$("#SetTableForm").ajaxForm({
			url : 'SetTable',
			dataType:'json',
			type: 'post',
			data : {param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				//$('#btl02', parent.document).click();
				//$('#iframItemRange').reload();
				refreshRisk();
				$('#F_TABLE_ID'   ).val("");
				$('#F_TABLE_CD'   ).val("");
				$('#F_TABLE_NM'   ).val("");
				$('#F_SAVE_PREQ'  ).val("");
				$('#F_DESCRIPTION').val("");
				$('#F_USE_YN'     ).val("");
				getJson("F_SAVE_PREQ_CD","SAVE_PREQ_CD",json_data.data[0].SAVE_PREQ_CD);
				$('#CRUD'         ).val("C");
				$('#F_TABLE_ID'   ).attr("readonly", false); //설정		
			},
			error : function(data, status){
		    	if (data != null){
		    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 서버에서 전달
		    			// data 오브젝트에 error의 값이 2일 때의 이벤트 처리
		    			alert("이미 등록되어 있는 아이디 입니다.");
		    		} else {
		    			alert("Error");
		    		}
		    	}
			}
		});	
		$("#SetTableForm").submit() ;
	});
	
	$('#btnSave').click(function (e) {
		var formData = new FormData();

		var obj = new Object();
		obj.table_id     = $("input#F_TABLE_ID").val();
		obj.table_cd     = $("input#F_TABLE_CD").val();
		obj.table_nm     = $("input#F_TABLE_NM").val();
		obj.save_preq_cd = $("select#F_SAVE_PREQ_CD").val();
		obj.save_preq    = $("input#F_SAVE_PREQ").val();
		obj.description  = $("textarea#F_DESCRIPTION").val();
		obj.use_yn       = $('input[name="F_USE_YN"]:checked').val()
		obj.crud         = $("input#CRUD").val();
		
		console.log('sCrud:'+ obj.crud);
		console.log('F_TABLE_ID:'+ obj.table_id); 
		console.log('F_TABLE_CD:'+ obj.table_cd); 
		console.log('F_TABLE_NM:'+ obj.table_nm); 
		console.log('F_SAVE_PREQ_CD:'+ obj.save_preq_cd); 
		console.log('F_SAVE_PREQ:'+ obj.save_preq); 
		console.log('F_DESCRIPTION:'+ obj.description); 
		console.log('F_USE_YN:'+ obj.use_yn); 
		console.log('CRUD:'+ obj.crud); 
		
		if(obj.work_nm == ''){
			alert("[알림] 업무명을 입력하세요.");
			$("input#F_WORK_NM").focus();
		    return;
		}

		$("#SetTableForm").ajaxForm({
			url : 'SetTable',
			dataType:'json',
			type: 'post',
			data:{param:JSON.stringify(obj)},
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				//$('#btl02', parent.document).click();
				//$('#iframItemRange').reload();
				refreshRisk();
			},
			error : function(data, status){
		    	if (data != null){
		    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 서버에서 전달
		    			// data 오브젝트에 error의 값이 2일 때의 이벤트 처리
		    			alert("이미 등록되어 있는 아이디 입니다.");
		    		} else {
		    			alert("Error");
		    		}
		    	}
			}
		});	
		$("#SetTableForm").submit() ;
	});
	
	oTable.on( 'xhr', function () {
		   // var json = oTable2.ajax.json();
		   // oTable2.row(':eq(0)', { page: 'current' }).select();
		    console.log( oTable.row(0).data());
//			var rows =  oTable.rows().data();
//			console.log(rows[0]);
		    //console.log( oTable2.rows( ':eq(0)' ).data());
		    //oTable2.row('.selected').remove().draw( false );
	} );
	
	function loadInfo(table_id, table_cd, table_nm, save_preq_cd, save_preq, description, use_yn) {
		
		console.log(table_id +':'+ table_cd +':'+  table_nm +':'+  save_preq_cd +':'+  save_preq +':'+  description +':'+  use_yn);
		
		var obj = new Object();
		obj.gb          = 'C';
		obj.table_id    = table_id;
		obj.table_nm    = "*";
		
        $('#F_TABLE_ID'   ).val(table_id);
        $('#F_TABLE_CD'   ).val(table_cd);
        $('#F_TABLE_NM'   ).val(table_nm);
        getJson("F_SAVE_PREQ_CD","SAVE_PREQ_CD",save_preq_cd);
        $('#F_SAVE_PREQ'  ).val(save_preq);
        $('#F_DESCRIPTION').val(description);
        $('input[name="F_USE_YN"]').val([use_yn]);
        $('#F_TABLE_ID'   ).attr("readonly", true ); //설정								
        
		var oTable2 = $('#uTable2').DataTable({
 			dom: 'Brtip',
 			select: true,
//			processing: true,
			serverSide: false,
			searching: false,
 			destroy: true,
			pagingType: "full_numbers",
			pageLength: 16,
			ajax: {
		        url:"GetTableList",
				dataType:"json", 
				type: "get",
				data : {param:JSON.stringify(obj)}
			},
			language: {
				"decimal":        "",
			    "emptyTable":     "데이타가 없습니다.",
			    "info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
			    "infoEmpty":      "전체 0 건",
			    "infoFiltered":   "(총 _MAX_ 개)",
			    "infoPostFix":    "",
			    "thousands":      ",",
			    "lengthMenu":     "페이지당 줄수 _MENU_",
			    "loadingRecords": "조회중...",
			    "processing":     "처리중...",
			    "search":         "검색:",
			    "zeroRecords":    "검색 결과가 없습니다.",
			    "paginate": {
			        "first":      "처음",
			        "last":       "마지막",
			        "next":       "다음",
			        "previous":   "이전"
			    },
			    "aria": {
			        "sortAscending":  ": 오름차순 정렬",
			        "sortDescending": ": 내림차순 정렬"
			    }
	        },			
            columns : [
                {"data":"ATTR_CD"},			 
                {"data":"ATTR_NM"},			 
                {"data":"ATTR_TYPE_CD"},			 
                {"data":"ATTR_TYPE_NM"},			 
                {"data":"ATTR_NULL_YN"},
                {"data":"ATTR_SIZE"},		  
                {"data":"DECIMAL_SIZE"}		 
     	    ]
	        ,columnDefs: [
     	        { targets: [2], visible: false}
     	    ]

		});	
		
 		$('#uTable2 tbody').on( 'click', 'tr', function () {
 	        if ( $(this).hasClass('selected') ) {
 	            $(this).removeClass('selected');
 	        }
 	        else {
 	        	oTable2.$('tr.selected').removeClass('selected');
 	            $(this).addClass('selected');
 	        }
 	        var sData2 = oTable2.rows('.selected').data()[0];
 	       console.log(sData2);
	
			//console.log(oTable2.row('.selected').data().ATTR_CD + ':' + oTable2.row('.selected').data().ATTR_NM);
			
	        $('#F_ATTR_CD'   ).val(sData2.ATTR_CD);
 	        $('#F_ATTR_NM'   ).val(sData2.ATTR_NM);
	        getJson("F_ATTR_TYPE_CD","ATTR_TYPE_CD",sData2.ATTR_TYPE_CD);
	        $('#F_ATTR_SIZE'  ).val(sData2.ATTR_SIZE);
	        $('#F_DECIMAL_SIZE'  ).val(sData2.DECIMAL_SIZE);
	        $('input[name="F_USE_YN"]').val([sData2.USE_YN]);
	        console.log([sData2.USE_YN]);
	        $('input[name="F_ATTR_NULL_YN"]').val([sData2.ATTR_NULL_YN]);
	        $('#F_ATTR_CD'   ).attr("readonly", true ); //설정		
	        $('#CRUD2'   ).val("AU");
		}); 

		$('#btnAttrAdd').on( 'click', function () {
//			 oTable2.rows.add([{'ATTR_CD':'AAA','ATTR_NM':'바바바','ATTR_TYPE_CD':'01','ATTR_TYPE_NM':'VARCHAR','ATTR_SIZE':'5','DECIMAL_SIZE':'0','ATTR_NULL_YN':'Y'}]).draw();
			$('#F_ATTR_CD'   ).val("");
			$('#F_ATTR_NM'   ).val("");
			getJson("F_ATTR_TYPE_CD","ATTR_TYPE_CD","01");
			$('#F_ATTR_SIZE'  ).val("");
			$('#F_DECIMAL_SIZE'  ).val("0");
			$('input[name="F_USE_YN"]').val("Y");
			$('input[name="F_ATTR_NULL_YN"]').val("Y");
		    $('#F_ATTR_CD'   ).attr("readonly", false ); //설정
	        $('#CRUD2'   ).val("AC");
		 });

			/*oTable2.on( 'xhr', function () {
			   // var json = oTable2.ajax.json();
			   // oTable2.row(':eq(0)', { page: 'current' }).select();
			    //console.log( oTable2.row(1).data());
				var rows =  oTable2.rows().data();
				console.log(rows[0]);
			    //console.log( oTable2.rows( ':eq(0)' ).data());
			    //oTable2.row('.selected').remove().draw( false );
			} );*/

		$('#btnAttrSave').click(function (e) {
			var formData = new FormData();

			var obj = new Object();
			obj.table_id     = $("input#F_TABLE_ID").val();
			obj.attr_cd      = $("input#F_ATTR_CD").val();
			obj.attr_nm      = $("input#F_ATTR_NM").val();
			obj.attr_size    = $("input#F_ATTR_SIZE").val();
			obj.decimal_size = $("input#F_DECIMAL_SIZE").val();
			obj.attr_type_cd = $("select#F_ATTR_TYPE_CD").val();
			obj.attr_use_yn  = $('input[name="F_USE_YN"]:checked').val()
			obj.attr_null_yn = $('input[name="F_ATTR_NULL_YN"]:checked').val()
			obj.crud         = $("input#CRUD2").val();
			
			console.log('sCrud:'+ obj.crud2);
			console.log('F_TABLE_ID:'+ obj.table_id); 
			console.log('F_ATTR_CD:'+ obj.attr_cd); 
			console.log('F_ATTR_NM:'+ obj.attr_nm); 
			console.log('F_ATTR_SIZE:'+ obj.attr_size); 
			console.log('F_DECIMAL_SIZE:'+ obj.decimal_size); 
			console.log('F_ATTR_TYPE_CD:'+ obj.attr_type_cd); 
			console.log('F_USE_YN:'+ obj.attr_use_yn); 
			console.log('F_ATTR_NULL_YN:'+ obj.attr_null_yn); 
			
			if(obj.table_id == ''){
				alert("[알림] 테이블을 먼저 선택하세요");
				$("input#F_ATTR_CD").focus();
			    return;
			}

			if(obj.attr_nm == ''){
				alert("[알림] 컬럼명을 입력하세요.");
				$("input#F_ATTR_NM").focus();
			    return;
			}

			if(Number(obj.attr_size) <= 0){
				alert("[알림] 길이가 너무 작습니다.");
				$("input#F_ATTR_SIZE").focus();
			    return;
			}

			if(Number(obj.attr_size) > 999){
				alert("[알림] 길이가 너무 큽니다.");
				$("input#F_ATTR_SIZE").focus();
			    return;
			}

			if(Number(obj.decimal_size) < 0){
				alert("[알림] 소수자리가 너무 작습니다.");
				$("input#F_DECIMAL_SIZE").focus();
			    return;
			}

			if(Number(obj.decimal_size) > 999){
				alert("[알림] 소수자리가 너무 큽니다.");
				$("input#F_DECIMAL_SIZE").focus();
			    return;
			}


			$("#SetATTRForm").ajaxForm({
				url : 'SetTable',
				dataType:'json',
				type: 'post',
				data:{param:JSON.stringify(obj)},
				success: function(json_data) {
					alert("정상적으로 처리 되었습니다.");
					//$('#btl02', parent.document).click();
					//$('#iframItemRange').reload();
					refreshRisk();
				},
				error : function(data, status){
			    	if (data != null){
			    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 서버에서 전달
			    			// data 오브젝트에 error의 값이 2일 때의 이벤트 처리
			    			alert("이미 등록되어 있는 아이디 입니다.");
			    		} else {
			    			alert("Error");
			    		}
			    	}
				}
			});	
			$("#SetATTRForm").submit() ;
		});
		

		$('#btnAttrDel').click(function (e) {
			var formData = new FormData();

			var obj = new Object();
			obj.table_id     = $("input#F_TABLE_ID").val();
			obj.attr_cd      = $("input#F_ATTR_CD").val();
			obj.crud         = "AD";
			
			console.log('sCrud:'+ obj.crud);
			console.log('F_TABLE_ID:'+ obj.table_id); 
			console.log('F_ATTR_CD:'+ obj.attr_cd); 
			
			if(obj.table_id == ''){
				alert("[알림] 테이블을 먼저 선택하세요");
				$("input#F_ATTR_CD").focus();
			    return;
			}

			$("#SetATTRForm").ajaxForm({
				url : 'SetTable',
				dataType:'json',
				type: 'post',
				data:{param:JSON.stringify(obj)},
				success: function(json_data) {
					alert("정상적으로 처리 되었습니다.");
					//$('#btl02', parent.document).click();
					//$('#iframItemRange').reload();
					refreshRisk();
				},
				error : function(data, status){
			    	if (data != null){
			    		if (data.error == 2) { // 임의 값 JSON 형식의 {“error”:2} 값을 서버에서 전달
			    			// data 오브젝트에 error의 값이 2일 때의 이벤트 처리
			    			alert("이미 등록되어 있는 아이디 입니다.");
			    		} else {
			    			alert("Error");
			    		}
			    	}
				}
			});	
			$("#SetATTRForm").submit() ;
		});
	};	
	
	refreshRisk();
	
	$("#searchVal").focus();

});
