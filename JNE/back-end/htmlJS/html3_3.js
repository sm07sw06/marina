
		const PAGE_NAME = '3_3_';
		var socket = io();
		const LOG_OUT = '#user_log';

		var num = 0;

		function search() {
			image.src = '';

			const cctvName = document.getElementById('cctvName').value;

			const startDay = (document.getElementById('startDay').value).replace(/\-/g, "");
			const endDay = (document.getElementById('endDay').value).replace(/\-/g, "");
			$(LOG_OUT).empty();
			num = 0;
			socket.emit(PAGE_NAME + 'search_gubun_data', { cctvName: cctvName, startDay: startDay, endDay: endDay });
		}

		socket.on(PAGE_NAME + 'search_inout_gubun', function (data) {
			$(LOG_OUT).append($("<li class='search_cctv' id=search" + num + ">"));
				
			for (var key in data) {
				if (key == 'send_time' || key == 'cctv_cd' || key == 'boatinout_nm') {
					$('#search' + num).append($('<span>').text(data[key]));
				}
			}

			//해당 회원 클릭시
			var target = document.querySelectorAll(".search_cctv");
			target[num].addEventListener("click", function (res) {

				// 이미지 출력
				image.src = data.photo_base64;

			});

			num++;
		})

