$(document).ready(function() {
	
	console.log("sessionsabun:"+sessionsabun);
	console.log("sessionapprowait:"+sessionapprowait);
			
	
	var oTable =  $('#uTable').DataTable({
		dom: 'Brtip',
		language: {
			"decimal":        "",
		    "emptyTable":     "데이타가 없습니다.",
//		    "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
		    "info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
		    "infoEmpty":      "전체 0 건",
//		    "infoEmpty":      "Showing 0 to 0 of 0 entries",
		    "infoFiltered":   "(filtered from _MAX_ total entries)",
		    "infoPostFix":    "",
		    "thousands":      ",",
		    "lengthMenu":     "Show _MENU_ entries",
		    "loadingRecords": "Loading...",
		    "processing":     "Processing...",
		    "search":         "Search:",
		    "zeroRecords":    "해당 데이터가 없습니다.",
		    "paginate": {
		        "first":      "처음",
		        "last":       "마지막",
		        "next":       "다음",
		        "previous":   "이전"
		    },
		    "aria": {
		        "sortAscending":  ": activate to sort column ascending",
		        "sortDescending": ": activate to sort column descending"
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
	
	function getJson(object, data){
		$.ajax({
			url: "GetCodeList",
			data: { "class":"STATUS", "code":"*" }, 
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
//			selectTag +='<option value="'+ codelist[idx]._CODE_ +'"' +  '>' + codelist[idx]._NAME_ +'</option>';
			selectTag +='<option value="'+ codelist[idx]._CODE_ + '"';
			if(data == codelist[idx]._CODE_) 
				selectTag +=' selected' 
			selectTag += '>' + codelist[idx]._NAME_ +'</option>';
		}
		$("#" + selectTagId).append(selectTag); 
	}
	
	function loadAttach()  
	{
		var obj = new Object();
		
		obj.sabun = sessionsabun;

		console.log("sabun:"+obj.sabun);
		
		oTable = $('#uTable').DataTable({
 			sDom: 'ti',
 			select: true,
			processing: true,
			ordering: false,
			serverSide: false,
			searching: false,
			destroy: true,
			pagingType: "full_numbers",
			pageLength: 16,
			ajax: {
		        url:"GetEmpAttachList",
				dataType:"json", 
				type: "get",
				data : {param:JSON.stringify(obj)}
			},
			language: {
				"decimal":        "",
			    "emptyTable":     "데이타가 없습니다.",
//			    "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
			    "info":           "_START_ ~ _END_ ( 전체 _TOTAL_ 건 )",
			    "infoEmpty":      "전체 0 건",
//			    "infoEmpty":      "Showing 0 to 0 of 0 entries",
			    "infoFiltered":   "(filtered from _MAX_ total entries)",
			    "infoPostFix":    "",
			    "thousands":      ",",
			    "lengthMenu":     "Show _MENU_ entries",
			    "loadingRecords": "Loading...",
			    "processing":     "Processing...",
			    "search":         "Search:",
			    "zeroRecords":    "해당 데이터가 없습니다.",
			    "paginate": {
			        "first":      "처음",
			        "last":       "마지막",
			        "next":       "다음",
			        "previous":   "이전"
			    },
			    "aria": {
			        "sortAscending":  ": activate to sort column ascending",
			        "sortDescending": ": activate to sort column descending"
			    }
	        },			
            columns : [
                {"data":"idx" , "bSortable": false},			 
                {"data":"sabun" },		 	 
                {"data":"fileName"},
                {"data":"desc"}
     	    ],
     	    columnDefs: [
     	        { targets: [1], visible: false}
     	    ]	     	    
		});
		/***
		// Highlighted rows
		oTable.find( "tbody input[type=checkbox]" ).each(function(i, el) {
			var $this = $(el),
				$p = $this.closest('tr');
			
			$( el ).on( 'change', function() {
				var is_checked = $this.is(':checked');
				
				$p[is_checked ? 'addClass' : 'removeClass']( 'highlight' );
			} );
		} );
		 ***/
	 }

	function loadInfo(sabun) {
		
		var obj = new Object();
		obj.sabun = sabun;
		obj.name = "";
		
		$.ajax({
			url: 'GetEmpList',    
			data: {param:JSON.stringify(obj)},
			dataType:"json",
			success: function(json_data) {
	
		        if(json_data.result == 'OK') {
		        	
		        	console.log(json_data.data[0].picture);
	
			        $('#f_sabun').val(json_data.data[0].sabun);
			        $('#f_name' ).val(json_data.data[0].name);
			        $('#f_orgNm' ).val(json_data.data[0].orgNm);
			        $('#f_faceId' ).val(json_data.data[0].faceId);
			        $('#f_retireYmd' ).val(json_data.data[0].retireYmd);
			        $('#f_email' ).val(json_data.data[0].email);
			        $('#f_mobile' ).val(json_data.data[0].mobile);
			        $('#f_faceId' ).val(json_data.data[0].faceId);
			        $('#f_picture' ).val(json_data.data[0].picture);
			        getJson("f_status",json_data.data[0].status);
			        
			        if ( json_data.data[0].picture == ' ' || json_data.data[0].picture == 'null' ) { 
			        	//console.log('111111');
			        	$('#f_picture').attr('src', "images/" + "200x150.png");
			        	$('.fileinput .fileinput-preview img').attr('src', "images/" + "200x150.png");
			        } else {
			        	//console.log('222222');
			        	$('#f_picture').attr('src', "userImages/" + json_data.data[0].picture);
			        	$('.fileinput .fileinput-preview img').attr('src', "userImages/" + json_data.data[0].picture);
			        }
	
				} else {
					console.log(json_data.result); 
				}
			}
		});	
	};	
   
    $('#uTable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
        	oTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        //console.log( oTable.rows('.selected').data()[0].name);
        
        var sData = oTable.rows('.selected').data()[0];
        
        loadInfo(sData.sabun);
        /***
        $('#f_sabun').val(sData.sabun);
        $('#f_name' ).val(sData.name);
        $('#f_orgNm' ).val(sData.orgNm);
        $('#f_faceId' ).val(sData.faceId);
        $('#f_retireYmd' ).val(sData.retireYmd);
        $('#f_email' ).val(sData.email);
        $('#f_mobile' ).val(sData.mobile);
        getJson("f_status",sData.status);
        ***/
    } );
    
	$('#btnQuery').click(function (e) {
		loadAttach();
	});
	
	$('#btnAdd').click(function (e) {
		$('#f_secondApro').val("");
		$('#f_lastApro'  ).val("");

		$('#f_name'      ).val("");
		$('#f_orgNm'     ).val("");
		$('#f_status'    ).val("");
		$('#f_email'     ).val("");
		$('#f_mobile'    ).val("");
		$('#f_office'    ).val("");
		$('#f_from'      ).val("");
		$('#f_to'        ).val("");
		$('#post_content').val("");
	});
	
	var orgHtml = '<br><div class="fileinput fileinput-new" data-provides="fileinput"><span class="btn btn-info btn-file"><span class="fileinput-new">파일선택</span><span class="fileinput-exists">변경</span><input type="file" name="f_attach1" id="f_attach1"></span><span class="fileinput-filename"></span><a href="#" class="close fileinput-exists" data-dismiss="fileinput" style="float: none">&times;</a></div>';
	
	$('#btnAttAdd').click(function (e) {
		newHtml = $('#aaabbb').html() + orgHtml;
		$("#aaabbb").html(newHtml);
		
		//console.log(newHtml);
	});
		
	$('#btnSave').click(function (e) {
		var formData = new FormData();
		$("#SetEmpForm").ajaxForm({
			url : 'SetEmp',
			enctype : "multipart/form-data",
			dataType:'json',
			success: function(json_data) {
				alert("정상적으로 처리 되었습니다.");
				//$('#btl02', parent.document).click();
				//$('#iframItemRange').reload();
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
		$("#SetEmpForm").submit() ;

	});
	
	
	$("#searchVal").focus();
	
});
