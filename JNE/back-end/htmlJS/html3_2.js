
		var socket = io();
		const PAGE_NAME = '3_2_';

		var num = 0;

		function search() {
			const startDay = document.getElementById('startDay').value;
			const endDay = document.getElementById('endDay').value;
			$("#unrecognizedBoat_log1").empty();
			$("#unrecognizedBoat_log2").empty();
			num = 0;
			socket.emit(PAGE_NAME + 'search_data', { startDay: startDay, endDay: endDay });
		}

		socket.on(PAGE_NAME + 'search', function (data) {
			if (num % 2) {
				$("#unrecognizedBoat_log2").append($("<li id=search2" + num + ">"));
				for (var key in data) {
					if (key == 'send_time' || key == 'anchor_nm') {
						//console.log(key + " : " + data[key]);
						$('#search2' + num).append($('<span>').text(data[key]));
					}
				}
			} else {
				$("#unrecognizedBoat_log1").append($("<li id=search1" + num + ">"));
				for (var key in data) {
					if (key == 'send_time' || key == 'anchor_nm') {
						//console.log(key + " : " + data[key]);
						$('#search1' + num).append($('<span>').text(data[key]));
					}
				}
				
			}

			num++;
		})
