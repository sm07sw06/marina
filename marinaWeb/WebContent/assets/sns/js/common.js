$(document).ready(function(){  
	tabs();   
	info_tabs(); 
	info_tabs2();
	calender();
	selectBox();
	message_tabs();
});
 
 
 

 
/* ================== 검색영역 tabs ======================= */
function tabs(){
	$("#tab_content .tabs_cont").hide();  
    $("#tabs li:first").attr("id","current");  
    $("#tab_content .tabs_cont:first").fadeIn();  
    $('#tabs li a').click(function(e) {
        e.preventDefault();
        if ($(this).attr("id") == "current"){ 
         return       
        }
        else{             
        $("#tab_content .tabs_cont").hide();  
        $("#tabs li").attr("id","");  
        $(this).parent().attr("id","current");  
        $( $(this).attr('href')).fadeIn();  
        }
    });
} 

/* ==================   컨텐츠  tab ======================= */ 
function info_tabs(){
	$("#item_content .infos_cont").hide(); 
    $("#infos li:first").attr("id","current");  
    $("#item_content .infos_cont:first").fadeIn();  
    $('#infos li a').click(function(e) {
        e.preventDefault();
        if ($(this).attr("id") == "current"){ 
         return       
        }
        else{             
        $("#item_content .infos_cont").hide(); 
        $("#infos li").attr("id","");  
        $(this).parent().attr("id","current");  
        $( $(this).attr('href')).fadeIn();  
        }
    });
} 
function info_tabs2(){
	$("#item_content2 .infos_cont").hide(); 
    $("#infos2 li:first").attr("id","current");  
    $("#item_content2 .infos_cont:first").fadeIn();  
    $('#infos2 li a').click(function(e) {
        e.preventDefault();
        if ($(this).attr("id") == "current"){ 
         return       
        }
        else{             
        $("#item_content2 .infos_cont").hide(); 
        $("#infos2 li").attr("id","");  
        $(this).parent().attr("id","current");  
        $( $(this).attr('href')).fadeIn();  
        }
    });
}



/* ==================   메시지  tab ======================= */ 
function message_tabs(){
	$("#message_content .message_cont").hide();  
    $("#message li:first").attr("id","current");  
    $("#message_content .message_cont:first").fadeIn();  
    $('#m_tab li a').click(function(e) {
        e.preventDefault();
        if ($(this).attr("id") == "current"){ 
         return       
        }
        else{             
        $("#message_content .message_cont").hide();  
        $("m_tab li").attr("id","");  
        $(this).parent().attr("id","current");  
        $( $(this).attr('href')).fadeIn();  
        }
    });
    // 다음 탭 보기
    $('.grid_btn .btn_left,.grid_btn .btn_right').click(function(){
    	var currentPage = $(this).siblings('.pager_wrap').children('strong').text();
    	if(currentPage == '1'){
    		$(this).parents('.grid_wrap').find('.grid_conts .tabs_cont01').hide();
    		$(this).parents('.grid_wrap').find('.grid_conts .tabs_cont02').show();
    		$(this).siblings('.pager_wrap').html('<span>1</span><span> / </span><strong>2</strong>');
    		
    		$(this).parents('.message_cont').find('.item_tab').find('ul').find('li').eq(1).find('a').trigger('click');
    		
    	}else if(currentPage == '2'){
    		$(this).parents('.grid_wrap').find('.grid_conts .tabs_cont02').hide();
    		$(this).parents('.grid_wrap').find('.grid_conts .tabs_cont01').show();
    		$(this).siblings('.pager_wrap').html('<strong>1</strong><span> / </span><span>2</span>');
    		
    		$(this).parents('.message_cont').find('.item_tab').find('ul').find('li').eq(0).find('a').trigger('click');
    	}
    	
    })
} 





/* ============================ 달력 ============================ */
function calender(){
	$.datepicker.regional['ko'] = {
		closeText: '닫기',
		prevText: '이전',
		nextText: '다음',
		currentText: '오늘',
		monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		dayNames: ['S','M','T','W','T','F','S'],
		dayNamesShort: ['S','M','T','W','T','F','S'],
		dayNamesMin: ['S','M','T','W','T','F','S'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '.',
		showOtherMonths: true,
		constrainInput: false
	};

	$.datepicker.setDefaults($.datepicker.regional['ko']);
	$( ".datepicker" ).datepicker({});
	$( ".datepicker2" ).datepicker({});
	$( ".datepicker3" ).datepicker({});
	$( ".datepicker4" ).datepicker({});
}



/* 셀렉트박스  */
function selectBox(){
	$.fn.ulSelect = function(){
		var ul = $(this);

		if (!ul.hasClass('zg-ul-select')) {
			ul.addClass('zg-ul-select');
		}
		// arrow
		var arrow = '';
		$('li:first-of-type', this).addClass('active').append(arrow);
		$(this).on('click', 'li', function(event){
		
		// Remove div#selected if it exists
		if ($('#selected--zg-ul-select').length) {
			$('#selected--zg-ul-select').remove();
		}
		ul.before('<div id="selected--zg-ul-select">');
		var selected = $('#selected--zg-ul-select');
		$('li #ul-arrow', ul).remove();
		ul.toggleClass('active'); 
		ul.children().removeClass('active'); 
		$(this).toggleClass('active');

		var selectedText = $(this).text();
			if (ul.hasClass('active')) {
				selected.text(selectedText).addClass('active').append(arrow);
			}
			else {
				selected.text('').removeClass('active'); 
				$('li.active', ul).append(arrow);
			}
		}); 
		//  
		$(document).on('click', function(event){
			if($('ul.zg-ul-select').length) {
			 if(!$('ul.zg-ul-select').has(event.target).length == 0) {
			  return;
			}
			else {
				$('ul.zg-ul-select').removeClass('active');
				$('#selected--zg-ul-select').removeClass('active').text('');
				$('#ul-arrow').remove();
				$('ul.zg-ul-select li.active').append(arrow);
			} 
		}
		});
	  }

	// Run
	$('#be-select').ulSelect();
	//# sourceURL=pen.js
}