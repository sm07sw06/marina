$(document).ready(function() {
	
	
	var $ = jQuery,
	$events_log = $("#events_log");

	var obj = new Object();
	obj.sabun = "1";
	
	$('#dynatreeDept').dynatree({
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
	    },
	    onDblClick: function(node) {
	    	$("#echoActive").text(node.data.title);	    	
	    	$('#f_orgCd' ).val(node.data.key);
	    	$('#f_orgNm' ).val(node.data.title);
	    	$("button[name='close']").click();
	    },
	    onDeactivate: function(node) {
	        $("#echoActive").text("-");
	    }
	});
	
	
    $('#sabun_list').on( 'dblclick', 'p',  function () {
    	
    	//alert("11111");

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
