
		const PAGE_NAME = '3_4_';
		var socket = io();
		const LOG_OUT = '#sos_log';

		var num = 0;
		
		function search() {
			const cctvName = document.getElementById('cctvName').value;

			const startDay = (document.getElementById('startDay').value).replace(/\-/g, "");
			const endDay = (document.getElementById('endDay').value).replace(/\-/g, "");
			$(LOG_OUT).empty();
			num=0;
			socket.emit(PAGE_NAME+'search_gubun_data', {cctvName:cctvName,startDay:startDay,endDay:endDay});
		}

		socket.on(PAGE_NAME+'search_inout_gubun', function (data) {
			$(LOG_OUT).append($("<li id=search" + num + ">"));
			for (var key in data) {
				if (key == 'send_time' || key == 'boat_id' || key == 'boat_nm' || key == 'grade' || key == 'latitude' || key == 'longitude') {
					//console.log(key + " : " + data[key]);
					$('#search' + num).append($('<span>').text(data[key]));
				}
			}
			num++;
		})
