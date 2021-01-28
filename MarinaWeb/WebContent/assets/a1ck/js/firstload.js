$(document).ready(function() {
	
	function refreshAllData()  
	{

		var obj = new Object();
	
		var cur_license =""; 
		var all_license =""; 
		var all_job_count =""; 
		var scan_success_count ="";  
		var scan_error_count ="";
		var load_success_count ="";
		var load_error_count ="";
		
		var strDom = "";
		
		$.ajax({
			
			url: 'GetFirstPage',    
			data: {param:JSON.stringify(obj)},
			dataType:"json",
			type:"post",
			success: function(json_data) {
				
		        if(json_data.result == 'OK') {
		        		   
		        	console.log('json_data.rows[0].FILTER_STAT_CD:'+  json_data.rows[0].cur_license);
		        	
		    		
		    		
		        	var cur_license = json_data.rows[0].cur_license;		        	
		        	var all_license = json_data.rows[0].all_license;
		        	var all_job_count      =json_data.rows[0].all_job_count       ; 
		        	var scan_success_count =json_data.rows[0].scan_success_count     ;  
		        	var scan_error_count   =json_data.rows[0].scan_error_count;
		        	var load_success_count =json_data.rows[0].load_success_count  ;
		        	var load_error_count   =json_data.rows[0].load_error_count;
		    		        	
		        	
		        	
		        	newHtml = "<div class='icon'><i class='entypo-users'></i></div><div class='num' data-start='0' data-end='";
		    		newHtml = newHtml + "0' data-postfix='' data-duration='1500' data-delay='0'>"
		    		newHtml = newHtml + cur_license +"TB/"+all_license+"TB";
		    		newHtml = newHtml + "</div><h5>MarinaWeb License</h5><p>Current License Size</p>";		    		
		    		$("#cur_license").html(newHtml);
		    		
		    		
		        	newHtml = "<div class='icon'><i class='entypo-users'></i></div><div class='num' data-start='0' data-end='";
		    		newHtml = newHtml + "0' data-postfix='' data-duration='1500' data-delay='0'>"
		    		newHtml = newHtml + all_job_count ;
		    		newHtml = newHtml + "</div><h5>Today All Job</h5><p>today all job count</p>";		    		
		    		$("#all_job").html(newHtml);
		    		
		    		
		        	newHtml = "<div class='icon'><i class='entypo-users'></i></div><div class='num' data-start='0' data-end='";
		    		newHtml = newHtml + "0' data-postfix='' data-duration='1500' data-delay='0'>"
		    		newHtml = newHtml + scan_success_count;
		    		newHtml = newHtml + "</div><h5>Today Scan Success Job</h5><p>success job Count</p>";		    		
		    		$("#scan_success").html(newHtml);
		    	
		        	newHtml = "<div class='icon'><i class='entypo-users'></i></div><div class='num' data-start='0' data-end='";
		    		newHtml = newHtml + "0' data-postfix='' data-duration='1500' data-delay='0'>"
		    		newHtml = newHtml + scan_error_count;
		    		newHtml = newHtml + "</div><h5>Today Scan Success Job</h5><p>fail job Count</p>";		    		
		    		$("#scan_fail").html(newHtml);
		    		
		        	newHtml = "<div class='icon'><i class='entypo-users'></i></div><div class='num' data-start='0' data-end='";
		    		newHtml = newHtml + "0' data-postfix='' data-duration='1500' data-delay='0'>"
		    		newHtml = newHtml + load_success_count;
		    		newHtml = newHtml + "</div><h5>Today Load Success Job</h5><p>success job Count</p>";		    		
		    		$("#load_success").html(newHtml);
		    	
		        	newHtml = "<div class='icon'><i class='entypo-users'></i></div><div class='num' data-start='0' data-end='";
		    		newHtml = newHtml + "0' data-postfix='' data-duration='1500' data-delay='0'>"
		    		newHtml = newHtml + load_error_count;
		    		newHtml = newHtml + "</div><h5>Today Load Success Job</h5><p>fail job Count</p>";		    		
		    		$("#load_fail").html(newHtml);		    		
	
				} else {
					//console.log(json_data.result); 
					alert(json_data.result);
				}
				
			}
			
		});	
		
		
		
		
		
		
		
	}; 	
		
	
	/** 실행 모듈 **/		
	refreshAllData() ;

	setInterval( refreshAllData , 5 * 1000);  //30초
	//setInterval( refreshRisk , 1 * 60 * 60 * 1000);  //1시간
	
});
