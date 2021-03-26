
const socket = io();

const PAGE_NAME = '1_2_';
//출력값
const LOG_OUT = "#boat_log";
//key값 설정(html 입력 id = '' 값 )
const INPUT = ['boat_id', 'boat_nm', 'user_cd', 'boat_status', 'boat_desc', 'user_nm', 'user_id'];
var num = 0, clickMemberData = new Object(), sendData = new Object;

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
function search_button() {
    const search = document.getElementById('t_search').value;

    //출력값 초기화
    num = 0;
    $(LOG_OUT).empty();

    //data전송
    socket.emit(PAGE_NAME + 'search_data', search);


    //입력값 초기화
    Default_InPut(INPUT);
    var selectBox = document.getElementById('boat_status').children[0]
    selectBox.innerHTML = '선택'
}

// count된 ID 출력
socket.on(PAGE_NAME + 'search_count', function (data) {
    document.getElementById('boat_id').value = data.max + 1;

});

//조회값 출력
socket.on(PAGE_NAME + 'search', function (data) {
    // 검색어 초기화
    document.getElementById('t_search').value = "";

    // 출력값 구성 잡기
    $(LOG_OUT).append($("<li class=search_log id=search" + num + ">"));
    for (var key in data) {
        if (key != INPUT[2] && key != INPUT[4] && key != INPUT[6])
            $('#search' + num).append($('<span>').text(data[key]));
    }

    //해당 회원 클릭시
    var target = document.querySelectorAll(".search_log");
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

        var selectBox = document.getElementById('boat_status').children[0]
        selectBox.innerHTML = data['boat_status']

        if (clickMemberData['boat_status'] == '정박') {
            clickMemberData['boat_status'] = '1'
        } else if (clickMemberData['boat_status'] == '출항') {
            clickMemberData['boat_status'] = '0'
        } else {
            clickMemberData['boat_status'] = '9'
        }


        // 데이터 전송
        socket.emit(PAGE_NAME + 'save_data', { click: true, new: false });

    });

    num++;

})



//모달
{
    const USER = ['marina_id', 'user_id', 'user_cd', 'user_nm', 'telephone'];
    let cBoxChecked = false;
    function user_search_button(data) {
        socket.emit(PAGE_NAME + 'user_search', data);

        //출력값 초기화
        num = 0;
        $('#user_board').empty();

    }


    //모달 조회값 출력(회원코드)
    socket.on(PAGE_NAME + 'user', function (data) {
        // 출력값 구성 잡기
        $('#user_board').append($("<li class='search_user_log clearfix' id=user" + num + ">"));
        $('#user' + num).append($("<span><input type='checkbox' name='user_cbox' onclick='NoMultiChkBot(this)' value=" + num + "/></span>"));

        for (var key in data) {
            if (key == USER[1] || key == USER[3] || key == USER[4]) {
                $('#user' + num).append($('<span id="target" value=' + num + '>').text(data[key]));
            }
        }

        //해당 클릭시
        var target = document.querySelectorAll(".search_user_log");
        var cbox = document.getElementsByName("user_cbox");

        target[num].addEventListener("click", function (res) {
            if (cBoxChecked) {
                //출력 내용
                for (var i = 0; i < USER.length; i++) {

                    try {
                        sendData[USER[i]] = String(data[USER[i]]);
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
        var obj = document.getElementsByName("user_cbox");
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

    function user_OK_button() {
        document.getElementById('user_nm').value = sendData['user_nm'];

        //출력값 초기화
        num = 0;
        $('#user_board').empty();
    }



}



//신규 회원 저장(신규)
function new_button() {
    // 데이터 전송
    socket.emit(PAGE_NAME + 'save_data', { click: false, new: true });

    //입력값 초기화
    Default_InPut(INPUT);
    var selectBox = document.getElementById('boat_status').children[0]
    selectBox.innerHTML = '선택'
}


//수정(저장)
function save_button() {
    // var sendData = new Object();

    //데이터 Json으로 저장
    for (var i = 0; i < INPUT.length; i++) {
        try {
            sendData[INPUT[i]] = document.getElementById(INPUT[i]).value;
        } catch (error) {
            //console.log(error)
        }
    }

    if (!sendData['user_id']) {
        sendData['user_id'] = clickMemberData['user_id']
    }


    var selectBox = document.getElementById('boat_status').children[0]
    sendData['boat_status'] = selectBox.innerHTML;

    if (sendData['boat_status'] == '정박') {
        sendData['boat_status'] = '1'
    } else if (sendData['boat_status'] == '출항') {
        sendData['boat_status'] = '0'
    } else {
        sendData['boat_status'] = '9'
    }

    // 데이터 전송
    socket.emit(PAGE_NAME + 'update_data', { search: clickMemberData, save: sendData });

    // 입력값 초기화
    Default_InPut(INPUT);
    var selectBox = document.getElementById('boat_status').children[0]
    selectBox.innerHTML = '선택'

    //출력값 초기화
    num = 0;
    $(LOG_OUT).empty();

    // 신규 예외처리
    if (sendData.boat_id == '') {
        alert('신규저장은 신규버튼 클릭후 저장!!')
    }
}


//삭제(삭제)
function delete_button() {
    // var sendData = new Object();

    //데이터 Json으로 저장
    for (var i = 0; i < INPUT.length; i++) {
        try {
            sendData[INPUT[i]] = document.getElementById(INPUT[i]).value;

        } catch (error) {
            //console.log(error)
        }
    }
    sendData['user_id'] = clickMemberData['user_id']

    var selectBox = document.getElementById('boat_status').children[0]
    sendData['boat_status'] = selectBox.innerHTML;

    if (sendData['boat_status'] == '정박') {
        sendData['boat_status'] = '1'
    } else if (sendData['boat_status'] == '출항') {
        sendData['boat_status'] = '0'
    } else {
        sendData['boat_status'] = '9'
    }

    // 데이터 전송
    socket.emit(PAGE_NAME + 'delete_data', sendData);

    //출력값 초기화
    num = 0;
    $(LOG_OUT).empty();

    // 입력값 초기화
    Default_InPut(INPUT);
    var selectBox = document.getElementById('boat_status').children[0]
    selectBox.innerHTML = '선택'

}