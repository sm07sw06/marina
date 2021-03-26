(function($,window,document,undefined){

    var marina = {

        init: function(){
            var that = this;
                that.modalFn();
                that.timeFn();
                that.slideFn();
                that.selectBoxFn();
        },
		modalFn : function(){

			//구역명, 보트명 모달 아이콘 클릭 시 모달창 띄우기
			$('.sector_modalOpenBtn').on({
				click:	function(){
					$('#modal_sector').css({ display:'block' });

					//출력값 초기화
					num = 0;
					$('#sector_board').empty();
				}
			});

			$('.boat_modalOpenBtn').on({
				click:	function(){
					$('#modal_boat').css({ display:'block' });

					//출력값 초기화
					num = 0;
					$('#sector_board').empty();
				}
			});

			$('.user_modalOpenBtn').on({
				click:	function(){
					$('#modal_user').css({ display:'block' });

					//출력값 초기화
					num = 0;
					$('#sector_board').empty();
				}
			});


			//닫기버튼 클릭 시 모달창 닫기
			$('.modalCloseBtn').on({
				click:	function(){
					$('.modal').stop().hide();
				}
			});
			

			//모달 자신을 클릭 시 모달창 닫기
			$('.modal').on({
				click:	function(event){
					
					if( event.target == event.currentTarget ){
						$('.modal').stop().hide();
					}
					
				}
			});

			//적용 버튼 클릭 시 모달창 닫기
			$('.applyBtn').on({
				click:	function(){
					$('.modal').stop().hide();
				}
			});

		},
        timeFn : function(){

			function timerFn(){

				var toDay = new Date();

                var nowYear = toDay.getFullYear();
				var nowMonth = addZeros(toDay.getMonth()+1,2);
				var nowDate = addZeros(toDay.getDate(),2);
				var nowDay = toDay.getDay();
				var nowYoil; 
				
				var amPm = 'AM';
				var nowHours = addZeros(toDay.getHours(),2);
				var nowMinutes = addZeros(toDay.getMinutes(),2);
				var nowSeconds = addZeros(toDay.getSeconds(),2);

					if(nowHours >= 12){
						amPm = 'PM';
						nowHours = addZeros(nowHours - 12,2);
					}
		
					switch(nowDay){
						case 0:
							nowYoil = '일';
							break;
						case 1:
							nowYoil = '월';
							break;
						case 2:
							nowYoil = '화';
							break;
						case 3:
							nowYoil = '수';
							break;
						case 4:
							nowYoil = '목';
							break;
						case 5:
							nowYoil = '금';
							break;
						case 6:
							nowYoil = '토';
					}

					function addZeros(num, digit) {
						var zero = '';
						num = num.toString();
						if (num.length < digit) {
						  for (i = 0; i < digit - num.length; i++) {
							zero += '0';
						  }
						}
						return zero + num;
				  }
				  
				  
				  $('#time').text( nowYear + '.' + nowMonth + '.' + nowDate );
				  $('#date').text( nowHours + ' : ' + nowMinutes + ' : ' + nowSeconds );
				  
				}//타이머 함수
		
			setInterval(timerFn,10);

		},
		slideFn : function(){

			var cnt = 0;

			function slideFn(){
				$('.cctvSlide_wrap').stop().animate({ left:-(250*cnt) }, 600, function(){
					if( cnt > 2 ){ cnt = 0 }
					if( cnt < 0 ){ cnt = 2 }
					$('.cctvSlide_wrap').stop().animate({ left:-(250*cnt) }, 0);
				});
			}
			
			//다음카운트 함수
			function nextCountFn(){
				cnt++;
				slideFn();
			}
			
			//next버튼 클릭 이벤트
			$('.nextBtn').on({
				click: function(){
					if( !$('.cctvSlide_wrap').is(':animated') ){
						nextCountFn();
					}
				}
			});
			
			//이전카운트 함수
			function prevCountFn(){
				cnt--;
				slideFn();
			}
			
			//prev버튼 클릭 이벤트
			$('.preBtn').on({
				click: function(){
					if( !$('.cctvSlide_wrap').is(':animated') ){
						prevCountFn();
					}
				}
			});
		},
		selectBoxFn : function(){

			$('.selectBtn').on({
				click:  function(){
					$(this).next().slideToggle(100);
					$(this).toggleClass('selectOn');
				}
			});

		}

    }
    marina.init();

})(jQuery,window,document);//marina.js