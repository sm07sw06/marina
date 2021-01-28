$(document).ready(function() {
	
	
	var $ = jQuery,
	$events_log = $("#events_log");

	var obj = new Object();
	obj.sabun = "1";
	
	$('#dynatreeSabun').dynatree({
		fx: { height: "toggle", duration: 50 },
	    autoCollapse: true,
	    minExpandLevel: 3,
		initAjax: {
	        url: "GetDeptList",
			dataType:"json", 
			type: "get",
			data : {param:JSON.stringify(obj)}
        },
        onActivate: function(node) {
	    	$("#echoActive").text(node.data.title);	    	
	    	console.log(node.data.key);
	    	loadInfo("*",node.data.key);
	    },
	      onDeactivate: function(node) {
	        $("#echoActive").text("-");
	    }
	});
	
	function loadInfo(name,orgcd) {
		
		var obj = new Object();
		obj.name  = name ;
		obj.sabun = "*"  ;
		obj.orgcd = orgcd; 
		
//		console.log("name:"+name);
//		console.log("orgcd:"+orgcd);
		
		$.ajax({
			url: 'GetEmpList',    
			data: {param:JSON.stringify(obj)},
			dataType:"json",
			success: function(json_data) {
		        if(json_data.result == 'OK') {
//		        	console.log(json_data.data[0].name);
			        var html ="";
				    $.each(json_data.data, function(i,n) {
				        html +="<div class='list-group2-item' id='sabun_list_item" + i + "'><p class='list-group2-item-text'>" + n.name + "(" + n.sabun + ")" + "</p></div>" ;
					});
				    $("#sabun_list").html(html);		    
//				    console.log(html); 
				} else {
					console.log(json_data.result); 
				}
			}
		})
	};	
	
    $('#sabun_list').on( 'dblclick', 'p',  function () {

    	if(sPocus == 0) {
    		$('#searchVal' ).val($(this).text());
    	} else if (sPocus == 1) {
    		$('#f_secondApro' ).val($(this).text());
    	} else if (sPocus == 2) {
    		$('#f_lastApro' ).val($(this).text());
    	}
    	
    	$("button[name='close']").click();
    	
    } );
    
    
	
});
