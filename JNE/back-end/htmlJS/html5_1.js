
		const socket = io();
		const PAGE_NAME = '5_1_';
		const INPUT = ['startDay', 'endDay'];
		const LOG_OUT = "#anchorReport_log";

		var num = 0, sendData = Object();

		//입력값 초기화
		function Default_InPut(data) {
			for (var i = 0; i < data.length; i++)
				document.getElementById(data[i]).value = "";
		}



		//출입내역 조회
		function search() {
			const sendData = new Object();

			//데이터 Json으로 저장
			for (var i = 0; i < INPUT.length; i++)
				sendData[INPUT[i]] = (document.getElementById(INPUT[i]).value).replace(/\-/g, "");

			// 데이터 전송
			socket.emit(PAGE_NAME + 'search_data', sendData);

			//입력값 초기화
			// Default_InPut(INPUT);

			// 출력값 초기화
			$(LOG_OUT).empty();
			num = 0;

		}


		//출입내역 조회값 출력
		socket.on(PAGE_NAME + 'search', function (data) {

			$(LOG_OUT).append($("<li id=search_inout" + num + ">"));

			for (var key in data)
				if (key == 'enter_dt' || key == 'leave_dt' || key == 'boat_id' || key == 'boat_nm' || key == 'anchor_nm')
					$('#search_inout' + num).append($('<span>').text(data[key]));

			num++;
		})

