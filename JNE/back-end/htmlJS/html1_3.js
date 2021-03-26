
const socket = io();
var num = 0;

//입력값 초기화
function Default_InPut(data) {
    for (var i = 0; i < data.length; i++) {
        try {
            document.getElementById(data[i]).value = "";
            document.getElementsByClassName(data[i])[0].value = "";
        } catch (error) {
            //console.log(error)
        }
    }
}

//장치 관리 tb_boat_device
{
    //key값 설정(html 입력 id = '' 값 )
    const INPUT1 = ["boat_id", "boat_nm", "machine_id"], PAGE_NAME1 = '1_3_1_';
    let clickBoatData = new Object();

    //회원관리 조회(조회)
    function search_button1() {
        const search = document.getElementById('t_search').value;
        var selectDBnmae = $('.selectbox select').val();

        //출력값 초기화
        num = 0;
        $("#boat_log").empty();

        //data전송
        socket.emit(PAGE_NAME1 + 'search_data', { searchData: search, DBname: selectDBnmae });

        //입력값 초기화
        Default_InPut(INPUT1);
    }

    //회원관리 조회값 출력
    socket.on(PAGE_NAME1 + 'search', function (data) {
        var selectDBnmae = $('.selectbox select').val();

        // 검색어 초기화
        document.getElementById('t_search').value = "";

        // 출력값 구성 잡기
        $("#boat_log").append($("<li class=search_boat id=search" + num + ">"));
        for (var key in data)
            if (key == 'boat_id' || key == 'boat_nm' || key == 'sector_id' || key == 'anchor_id' || key == 'machine_id')
                $('#search' + num).append($('<span>').text(data[key]));

        //해당 회원 클릭시
        var target = document.querySelectorAll(".search_boat");
        target[num].addEventListener("click", function (res) {
            var path = res.path[1].children

            //출력 내용
            for (var i = 0; i < INPUT1.length; i++) {
                try {
                    clickBoatData[INPUT1[i]] = String(data[INPUT1[i]])
                    document.getElementById(INPUT1[i]).value = clickBoatData[INPUT1[i]];
                } catch (error) {
                    //console.log(error)
                }

            }
            socket.emit(PAGE_NAME1 + 'save_data', false);

        });
        num++;
    })


    //신규 장치 관리 저장(신규)
    // function new_button1() {
    // 	// 데이터 전송
    // 	socket.emit(PAGE_NAME1 + 'save_data', true);

    // 	//입력값 초기화
    // 	Default_InPut(INPUT1);
    // }



    //회원관리 수정(저장)
    function save_button1() {
        var selectDBnmae = $('.selectbox select').val();
        var sendData = new Object();

        //데이터 Json으로 저장
        for (var i = 0; i < INPUT1.length; i++) {
            try {
                sendData[INPUT1[i]] = document.getElementById(INPUT1[i]).value;
            } catch (error) {
                //console.log(error)
            }
        }

        sendData.boat_id = clickBoatData.boat_id

        // 데이터 전송
        socket.emit(PAGE_NAME1 + 'update_data', { search: clickBoatData, save: sendData });

        // 입력값 초기화
        Default_InPut(INPUT1);

        //출력값 초기화
        num = 0;
        $("#boat_log").empty();

    }




    //회원관리 삭제(삭제)
    function delete_button1() {
        // var selectDBnmae = document.getElementById("DBnmae option:selected").val();
        var sendData = new Object();

        //데이터 Json으로 저장
        for (var i = 0; i < INPUT1.length; i++) {
            try {
                sendData[INPUT1[i]] = document.getElementById(INPUT1[i]).value;
            } catch (error) {
                //console.log(error)
            }
        }

        sendData.boat_id = clickBoatData.boat_id

        // 데이터 전송
        socket.emit(PAGE_NAME1 + 'delete_data', sendData);

        // 입력값 초기화
        Default_InPut(INPUT1);

        //출력값 초기화
        num = 0;
        $("#boat_log").empty();

    }

}


//장치 관리 tb_anchor_lidar
{
    //key값 설정(html 입력 id = '' 값 )
    const INPUT2 = ["marina_id", "anchor_nm", "machine_id", "left_right", "anchor_id"], PAGE_NAME2 = '1_3_2_';
    let clickAnchorData = new Object();

    //회원관리 조회(조회)
    function search_button2() {
        const search = document.getElementById('t_search2').value;

        //출력값 초기화
        num = 0;
        $("#anchor_log").empty();

        //data전송
        socket.emit(PAGE_NAME2 + 'search_data', search);

        //입력값 초기화
        Default_InPut(INPUT2);
        var selectBox = document.getElementById('left_right').children[0]
        selectBox.innerHTML = '선택'
    }

    //조회값 출력
    socket.on(PAGE_NAME2 + 'search', function (data) {

        // 검색어 초기화
        document.getElementById('t_search2').value = "";

        // 출력값 구성 잡기
        $("#anchor_log").append($("<li class=anchor_lidar id=search2" + num + ">"));
        for (var key in data)
            if (key == 'marina_id' || key == 'anchor_nm' || key == 'machine_id')
                $('#search2' + num).append($('<span>').text(data[key]));

        //해당 회원 클릭시
        var target = document.querySelectorAll(".anchor_lidar");
        target[num].addEventListener("click", function (res) {
            var path = res.path[1].children

            //출력 내용
            for (var i = 0; i < INPUT2.length; i++) {
                try {
                    clickAnchorData[INPUT2[i]] = String(data[INPUT2[i]])
                    document.getElementsByClassName(INPUT2[i])[0].value = clickAnchorData[INPUT2[i]];
                } catch (error) {
                    //console.log(error)
                }

            }

            var selectBox = document.getElementById('left_right').children[0]
            clickAnchorData['left_right'] = data['left_right'];

            if (clickAnchorData['left_right'] == '0') {
                selectBox.innerHTML = "좌"
            } else if (clickAnchorData['left_right'] == '1') {
                selectBox.innerHTML = '우'
            } else {
                selectBox.innerHTML = '선택'
            }

            socket.emit(PAGE_NAME2 + 'save_data', false);


        });
        num++;
    })


    //신규 장치 관리 저장(신규)
    function new_button2() {
        // 데이터 전송
        socket.emit(PAGE_NAME2 + 'save_data', true);

        //입력값 초기화
        Default_InPut(INPUT2);
        var selectBox = document.getElementById('left_right').children[0]
        selectBox.innerHTML = '선택'
    }



    //회원관리 수정(저장)
    function save_button2() {
        var sendData = new Object();

        //데이터 Json으로 저장
        for (var i = 0; i < INPUT2.length; i++) {
            try {
                sendData[INPUT2[i]] = document.getElementsByClassName(INPUT2[i])[0].value;
            } catch (error) {
                //console.log(error)
            }
        }

        sendData.marina_id = clickAnchorData.marina_id

        sendData['left_right'] = document.getElementById('left_right').children[0].innerHTML;
        sendData.anchor_id = clickAnchorData['anchor_id'];

        if (sendData['left_right'] == '좌') {
            sendData['left_right'] = '0'
        } else if (sendData['left_right'] == '우') {
            sendData['left_right'] = '1'
        } else {
            sendData['left_right'] = 'null'
            alert('좌우 구분 선택 필수')
        }

        // 데이터 전송
        socket.emit(PAGE_NAME2 + 'update_data', { search: clickAnchorData, save: sendData });

        // 입력값 초기화
        Default_InPut(INPUT2);

        //출력값 초기화
        num = 0;
        $("#anchor_log").empty();
        var selectBox = document.getElementById('left_right').children[0]
        selectBox.innerHTML = '선택'

    }




    //회원관리 삭제(삭제)
    function delete_button2() {
        var sendData = new Object();
        //데이터 Json으로 저장
        for (var i = 0; i < INPUT2.length; i++) {
            try {
                sendData[INPUT2[i]] = document.getElementsByClassName(INPUT2[i])[0].value;
            } catch (error) {
                //console.log(error)
            }
        }

        sendData.marina_id = clickAnchorData.marina_id

        sendData['left_right'] = document.getElementById('left_right').children[0].innerHTML;
        sendData.anchor_id = clickAnchorData['anchor_id'];

        if (sendData['left_right'] == '좌') {
            sendData['left_right'] = '0'
        } else if (sendData['left_right'] == '우') {
            sendData['left_right'] = '1'
        } else {
            sendData['left_right'] = 'null'
        }

        // 데이터 전송
        socket.emit(PAGE_NAME2 + 'delete_data', sendData);

        //출력값 초기화
        num = 0;
        $("#anchor_log").empty();
        Default_InPut(INPUT2);
        var selectBox = document.getElementById('left_right').children[0]
        selectBox.innerHTML = '선택'

    }

}
