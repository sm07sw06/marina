
const socket = io();
{

	const PAGE_NAME1 = '2_1_1_';
	//출력값
	const LOG_OUT = "#anchorSector_log";
	//key값 설정(html 입력 id = '' 값 )
	const INPUT = ['sector_nm', 'sectorarea_nm', 'gpsx1', 'gpsx2', 'gpsy1', 'gpsy2', 'sector_desc', 'marina_id', 'sector_id', 'sectorarea_cd'];
	var num = 0, clickMemberData = new Object();

	//입력값 초기화
	function Default_InPut(data) {
		for (var i = 0; i < data.length; i++) {
			try {
				document.getElementById(data[i]).value = "";
			} catch (error) {
				//console.log(error)
			}
		}
	}

	//조회(조회)
	function search_button1() {
		const search = document.getElementById('t_search1').value;

		//출력값 초기화
		num = 0;
		$(LOG_OUT).empty();

		//data전송
		socket.emit(PAGE_NAME1 + 'search_data', search);

		//입력값 초기화
		Default_InPut(INPUT);
		var selectBox = document.getElementById('sectorarea_cd').children[0]
		selectBox.innerHTML = '선택'
	}

	//조회값 출력
	socket.on(PAGE_NAME1 + 'search', function (data) {
		// 검색어 초기화
		document.getElementById('t_search1').value = "";

		// 출력값 구성 잡기
		$(LOG_OUT).append($("<li class=search_log1 id=search1" + num + ">"));
		for (var key in data) {
			if (key != INPUT[6] && key != INPUT[7] && key != INPUT[8] && key != INPUT[9])
				$('#search1' + num).append($('<span>').text(data[key]));
		}

		//해당 회원 클릭시
		var target = document.querySelectorAll(".search_log1");
		target[num].addEventListener("click", function (res) {

			//출력 내용
			for (var i = 0; i < INPUT.length; i++) {
				try {
					clickMemberData[INPUT[i]] = String(data[INPUT[i]]);
					document.getElementById(INPUT[i]).value = clickMemberData[INPUT[i]];
				} catch (error) {
					//console.log(error)
				}

			}

			var selectBox = document.getElementById('sectorarea_cd').children[0]
			selectBox.innerHTML = data['sectorarea_cd']

			if (clickMemberData['sectorarea_cd'] == 'A') {
				selectBox.innerHTML = 'A구역'
			} else if (clickMemberData['sectorarea_cd'] == 'B') {
				selectBox.innerHTML = 'B구역'
			} else if (clickMemberData['sectorarea_cd'] == 'C') {
				selectBox.innerHTML = 'C구역'
			} else {
				selectBox.innerHTML = '출입구'
			}

			// 데이터 전송
			socket.emit(PAGE_NAME1 + 'save_data', { click: true, new: false });

		});

		num++;

	})



	//신규 회원 저장(신규)
	function new_button1() {
		// 데이터 전송
		socket.emit(PAGE_NAME1 + 'save_data', { click: false, new: true });

		//입력값 초기화
		Default_InPut(INPUT);
		var selectBox = document.getElementById('sectorarea_cd').children[0]
		selectBox.innerHTML = '선택'
	}

	// count된 ID 출력
	socket.on(PAGE_NAME1 + 'search_count', function (data) {
		document.getElementById('sector_id').value = data.max + 1;

	});


	//수정(저장)
	function save_button1() {
		var sendData = new Object();

		//데이터 Json으로 저장
		for (var i = 0; i < INPUT.length; i++) {
			try {
				sendData[INPUT[i]] = document.getElementById(INPUT[i]).value;
			} catch (error) {
				//console.log(error)
			}
		}

		var selectBox = document.getElementById('sectorarea_cd').children[0]
		sendData['sectorarea_cd'] = selectBox.innerHTML;

		if (sendData['sectorarea_cd'] == 'A구역') {
			sendData['sectorarea_cd'] = 'A'
		} else if (sendData['sectorarea_cd'] == 'B구역') {
			sendData['sectorarea_cd'] = 'B'
		} else if (sendData['sectorarea_cd'] == 'C구역') {
			sendData['sectorarea_cd'] = 'C'
		} else {
			sendData['sectorarea_cd'] = 'Z'
		}

		// 데이터 전송
		socket.emit(PAGE_NAME1 + 'update_data', { search: clickMemberData, save: sendData });

		// 입력값 초기화
		Default_InPut(INPUT);
		var selectBox = document.getElementById('sectorarea_cd').children[0]
		selectBox.innerHTML = '선택'

		//출력값 초기화
		num = 0;
		$(LOG_OUT).empty();

		// 신규 예외처리
		if (sendData.sector_id == '') {
			alert('신규저장은 신규버튼 클릭후 저장!!')
		}

	}


	//삭제(삭제)
	function delete_button1() {
		var sendData = new Object();

		//데이터 Json으로 저장
		for (var i = 0; i < INPUT.length; i++) {
			try {
				sendData[INPUT[i]] = document.getElementById(INPUT[i]).value;
			} catch (error) {
				//console.log(error)
			}
		}

		var selectBox = document.getElementById('sectorarea_cd').children[0]
		sendData['sectorarea_cd'] = selectBox.innerHTML;

		if (sendData['sectorarea_cd'] == 'A구역') {
			sendData['sectorarea_cd'] = 'A'
		} else if (sendData['sectorarea_cd'] == 'B구역') {
			sendData['sectorarea_cd'] = 'B'
		} else if (sendData['sectorarea_cd'] == 'C구역') {
			sendData['sectorarea_cd'] = 'C'
		} else {
			sendData['sectorarea_cd'] = 'Z'
		}

		// 데이터 전송
		socket.emit(PAGE_NAME1 + 'delete_data', sendData);

		//출력값 초기화
		num = 0;
		$(LOG_OUT).empty();

		// 입력값 초기화
		Default_InPut(INPUT);
		var selectBox = document.getElementById('sectorarea_cd').children[0]
		selectBox.innerHTML = '선택'


	}
}




{

	const PAGE_NAME2 = '2_1_2_';
	//출력값
	const LOG_OUT2 = "#anchorInfo_log";
	//key값 설정(html 입력 id = '' 값 )
	const INPUT2 = ['anchor_id', 'anchor_nm', 'sectorarea_nm', 'sector_nm', 'anchor_status_nm',
		'boat_nm', 'sector_id', 'boat_id', 'anchor_status'];
	var num = 0, clickData = new Object(), sendData = new Object();

	//입력값 초기화
	function Default_InPut2(data) {
		for (var i = 0; i < data.length; i++) {
			try {
				document.getElementById(data[i] + '2').value = "";
			} catch (error) {
				//console.log(error)
			}
		}
	}

	//조회(조회)
	function search_button2() {
		const search = document.getElementById('t_search2').value;

		//출력값 초기화
		num = 0;
		$(LOG_OUT2).empty();

		//data전송
		socket.emit(PAGE_NAME2 + 'search_data', search);

		//입력값 초기화
		Default_InPut2(INPUT2);
	}

	//조회값 출력
	socket.on(PAGE_NAME2 + 'search', function (data) {
		// 검색어 초기화
		document.getElementById('t_search2').value = "";

		// 출력값 구성 잡기
		$(LOG_OUT2).append($("<li class=search_log2 id=search2" + num + ">"));
		for (var key in data) {
			if (key == INPUT2[0] || key == INPUT2[1] || key == INPUT2[2]
				|| key == INPUT2[3] || key == INPUT2[4] || key == INPUT2[5]) {
				$('#search2' + num).append($('<span>').text(data[key]));
			}
		}

		//해당 회원 클릭시
		var target = document.querySelectorAll(".search_log2");
		target[num].addEventListener("click", function (res) {

			//출력 내용
			for (var i = 0; i < INPUT2.length; i++) {
				try {
					clickData[INPUT2[i]] = String(data[INPUT2[i]]);
					document.getElementById(INPUT2[i] + '2').value = clickData[INPUT2[i]];
				} catch (error) {
					//console.log(error)
				}

			}

			var selectBox = document.getElementById('anchor_status_nm2').children[0]
			selectBox.innerHTML = clickData['anchor_status_nm']


			// 데이터 전송
			socket.emit(PAGE_NAME2 + 'save_data', { click: true, new: false });

		});

		num++;

	})


	{
		const AREA = ['sector_id', 'sector_nm', 'sectorarea_nm'];
		let cBoxChecked = false;
		function area_search_button(data) {
			socket.emit(PAGE_NAME2 + 'area_search', data);

			//출력값 초기화
			num = 0;
			$('#sector_board').empty();

		}



		//모달 조회값 출력(구역명)
		socket.on(PAGE_NAME2 + 'area', function (data) {
			// 출력값 구성 잡기
			$('#sector_board').append($("<li class='search_area_log clearfix' id=area" + num + ">"));
			$('#area' + num).append($("<span><input type='checkbox' name='area_cbox' onclick='NoMultiChk(this)' value=" + num + "/></span>"));

			for (var key in data) {
				if (key == AREA[0] || key == AREA[1] || key == AREA[2]) {
					$('#area' + num).append($('<span id="target" value=' + num + '>').text(data[key]));
				}
			}

			//해당 클릭시
			var target = document.querySelectorAll(".search_area_log");
			var cbox = document.getElementsByName("area_cbox");

			target[num].addEventListener("click", function (res) {
				if (cBoxChecked) {
					//출력 내용
					for (var i = 0; i < AREA.length; i++) {

						try {
							sendData[AREA[i]] = String(data[AREA[i]]);
						} catch (error) {
							//console.log(error)
						}
					}
					cBoxChecked = false;

				}

			});

			num++;

		})

		//체크박스 하나만 선택
		function NoMultiChk(chk) {
			var obj = document.getElementsByName("area_cbox");
			for (var i = 0; i < obj.length; i++) {
				if (obj[i] != chk) {
					obj[i].checked = false;
					$(".modal_board > ul > li > ul > li").eq(i).css("background-color", "#fff");
				} else {
					cBoxChecked = true;
					$(".modal_board > ul > li > ul > li").eq(i).css("background-color", "#eee");
				}
			}
		}

		function area_OK_button() {
			document.getElementById('sector_nm2').value = sendData['sector_nm'];

			//출력값 초기화
			num = 0;
			$('#sector_board').empty();
		}

	}


	{
		const BOAT = ['boat_id', 'boat_nm', 'user_nm'];
		let cBoxChecked = false;
		function boat_search_button(data) {
			socket.emit(PAGE_NAME2 + 'boat_search', data);

			//출력값 초기화
			num = 0;
			$('#boat_board').empty();

		}


		//모달 조회값 출력(구역명)
		socket.on(PAGE_NAME2 + 'boat', function (data) {
			// 출력값 구성 잡기
			$('#boat_board').append($("<li class='search_boat_log clearfix' id=boat" + num + ">"));
			$('#boat' + num).append($("<span><input type='checkbox' name='boat_cbox' onclick='NoMultiChkBot(this)' value=" + num + "/></span>"));

			for (var key in data) {
				if (key == BOAT[0] || key == BOAT[1] || key == BOAT[2]) {
					$('#boat' + num).append($('<span id="target" value=' + num + '>').text(data[key]));
				}
			}

			//해당 클릭시
			var target = document.querySelectorAll(".search_boat_log");
			var cbox = document.getElementsByName("boat_cbox");

			target[num].addEventListener("click", function (res) {
				if (cBoxChecked) {
					//출력 내용
					for (var i = 0; i < BOAT.length; i++) {

						try {
							sendData[BOAT[i]] = String(data[BOAT[i]]);
						} catch (error) {
							//console.log(error)
						}
					}
					cBoxChecked = false;

				}

			});

			num++;

		})

		//체크박스 하나만 선택
		function NoMultiChkBot(chk) {
			var obj = document.getElementsByName("boat_cbox");
			for (var i = 0; i < obj.length; i++) {
				if (obj[i] != chk) {
					obj[i].checked = false;
					$(".modal_board > ul > li > ul > li").eq(i).css("background-color", "#fff");
				} else {
					cBoxChecked = true;
					$(".modal_board > ul > li > ul > li").eq(i).css("background-color", "#eee");
				}
			}
		}

		function boat_OK_button() {
			document.getElementById('boat_nm2').value = sendData['boat_nm'];

			//출력값 초기화
			num = 0;
			$('#boat_board').empty();
		}



	}


	//신규 회원 저장(신규)
	function new_button2() {
		// 데이터 전송
		socket.emit(PAGE_NAME2 + 'save_data', { click: false, new: true });

		//입력값 초기화
		Default_InPut2(INPUT2);
		var selectBox = document.getElementById('anchor_status_nm2').children[0]
		selectBox.innerHTML = '선택'
	}

	// count된 ID 출력
	socket.on(PAGE_NAME2 + 'search_count', function (data) {
		document.getElementById('anchor_id2').value = data.max + 1;

	});


	//수정(저장)
	function save_button2() {

		//데이터 Json으로 저장
		for (var i = 0; i < INPUT2.length; i++) {
			try {
				sendData[INPUT2[i]] = document.getElementById(INPUT2[i] + '2').value;
			} catch (error) {
				//console.log(error)
			}
		}

		if (!sendData.boat_id && sendData.boat_nm == clickData.boat_nm)
			sendData.boat_id = clickData.boat_id

		if (!sendData.sector_id && sendData.sector_nm == clickData.sector_nm)
			sendData.sector_id = clickData.sector_id


		var selectBox = document.getElementById('anchor_status_nm2').children[0]
		sendData['anchor_status_nm'] = selectBox.innerHTML

		if (sendData['anchor_status_nm'] == '정박') {
			sendData['anchor_status'] = 1;
		} else if (sendData['anchor_status_nm'] == '비정박') {
			sendData['anchor_status'] = 0;
		} else {
			alert('정박상태 선택')
		}

		// 데이터 전송
		socket.emit(PAGE_NAME2 + 'update_data', { search: clickData, save: sendData });

		// 입력값 초기화
		Default_InPut2(INPUT2);
		var selectBox = document.getElementById('anchor_status_nm2').children[0]
		selectBox.innerHTML = '선택'

		//출력값 초기화
		num = 0;
		$(LOG_OUT2).empty();

		// 신규 예외처리
		if (sendData.anchor_id == '') {
			alert('신규저장은 신규버튼 클릭후 저장!!')
		} else {
			alert('저장완료')
		}

	}


	//삭제(삭제)
	function delete_button2() {
		//데이터 Json으로 저장
		for (var i = 0; i < INPUT2.length; i++) {
			try {
				sendData[INPUT2[i]] = document.getElementById(INPUT2[i] + '2').value;
			} catch (error) {
				//console.log(error)
			}
		}

		var selectBox = document.getElementById('anchor_status_nm2').children[0]
		sendData['anchor_status_nm'] = selectBox.innerHTML

		if (sendData['anchor_status_nm'] == '정박') {
			sendData['anchor_status'] = 1;
		} else if (sendData['anchor_status_nm'] == '비정박') {
			sendData['anchor_status'] = 0;
		} else {
			alert('정박상태 선택')
		}

		// 데이터 전송
		socket.emit(PAGE_NAME2 + 'delete_data', sendData);

		//출력값 초기화
		num = 0;
		$(LOG_OUT2).empty();

		// 입력값 초기화
		Default_InPut2(INPUT2);
		var selectBox = document.getElementById('anchor_status_nm2').children[0]
		selectBox.innerHTML = '선택'

	}
}
