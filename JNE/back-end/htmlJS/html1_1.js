const socket = io();
//key값 설정(html 입력 id = '' 값 )
const params = ['user_id', 'user_cd', 'user_nm', 'telephone', 'email'];
var num = 0, image, clickMemberData = new Object();

//입력값 초기화
function Default_InPut(data) {
    for (var i = 0; i < data.length; i++)
        document.getElementById(data[i]).value = "";
}

//이미지값 출력
function setThumbnail(event) {
    var reader = new FileReader();

    //이미지 초기화(사진 겹침 방지)
    $("div#image_container").empty();

    //파일 이미지 찾기
    reader.onload = function (event) {
        var img = document.createElement("img");
        img.setAttribute("src", event.target.result);
        document.querySelector("div#image_container").appendChild(img);

    };

    // 이미지 출력
    reader.readAsDataURL(event.target.files[0]);
    image = event.target.files[0];
}


//회원관리 조회(조회)
function search_button() {
    const search = document.getElementById('t_search').value;

    //출력값 초기화
    num = 0;
    $("#user_log").empty();

    //data전송
    socket.emit('search_data', search);


    //입력값 초기화
    Default_InPut(params);
}

//회원관리 조회값 출력
socket.on('search', function (data) {
    // 검색어 초기화
    document.getElementById('t_search').value = "";

    // 출력값 구성 잡기
    $("#user_log").append($("<li class=search_members id=search" + num + ">"));
    for (var key in data)
        if (key == 'user_cd' || key == 'user_nm' || key == 'telephone' || key == 'email')
            $('#search' + num).append($('<span>').text(data[key]));

    /**/
    //해당 회원 클릭시
    var target = document.querySelectorAll(".search_members");
    target[num].addEventListener("click", function (res) {
        // var path = res.path[6].children[4].children[0].children

        //출력 내용
        for (var i = 0; i < params.length; i++) {
            clickMemberData[params[i]] = data[params[i]];
            document.getElementById(params[i]).value = data[params[i]];
        }

        //data 전송(이미지 출력을 위한)
        socket.emit('click_members_search', clickMemberData);

        // 데이터 전송
        socket.emit(PAGE_NAME1 + 'save_data', { click: true, new: false });
    });

    num++;

    //이미지 초기화(사진 겹침 방지)
    $("div#image_container").empty();


})

//해당클릭 회원 사진 출력
socket.on('click_members', function (data) {
    var img = document.createElement("img");
    image = data.picture;

    //이미지 초기화(사진 겹침 방지)
    $("div#image_container").empty();

    // 이미지 출력
    img.setAttribute("src", image);
    document.querySelector("div#image_container").appendChild(img);

})



//신규 회원 저장(신규)
function new_button() {
    // 데이터 전송
    socket.emit('save_data', { click: false, new: true });

    //입력값 초기화
    Default_InPut(params);

    //이미지 초기화(사진 겹침 방지)
    $("div#image_container").empty();


    /* 신규만 눌럿을 적용한 스크립트
    var sendData = new Object();

    //데이터 Json으로 저장
    for (var i = 0; i < params.length; i++)
        sendData[params[i]] = document.getElementById(params[i]).value;

    // 데이터 전송
    socket.emit('save_data', sendData);

    //입력값 초기화
    Default_InPut(params);

    // ajax 데이터 보낼 내용 가공
    var data = new FormData();
    data.append('image_Data_Param', JSON.stringify(sendData));
    data.append('image_Data_Param', image);

    //이미지 값 전송
    $.ajax({
        url: '/img/post',
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data)
        }
    });

    //이미지 초기화(사진 겹침 방지)
    data.delete('image_Data_Param');
    $("div#image_container").empty();

    //출력값 초기화
    num = 0;
    $("#user_log").empty();
    */

}

// count된 ID 출력
socket.on('search_count', function (data) {
    document.getElementById('user_id').value = data.max + 1;

});

//회원관리 수정(저장)
function save_button() {
    var sendData = new Object();

    //데이터 Json으로 저장
    for (var i = 0; i < params.length; i++)
        sendData[params[i]] = document.getElementById(params[i]).value;

    // 데이터 전송
    socket.emit('update_data', { search: clickMemberData, change: sendData });

    // 입력값 초기화
    Default_InPut(params);

    // ajax 데이터 보낼 내용 가공
    var data = new FormData();
    data.append('image_Data_Param', image);
    data.append('image_Data_Param', JSON.stringify(sendData));

    //이미지 값 전송
    $.ajax({
        url: '/img/post',
        type: 'POST',
        data: data,
        processData: false,
        contentType: false
    });

    //이미지 초기화(사진 겹침 방지)
    data.delete('image_Data_Param');
    $("div#image_container").empty();

    //출력값 초기화
    num = 0;
    $("#user_log").empty();


    // 신규 예외처리
    if (sendData.user_id == '') {
        alert('신규저장은 신규버튼 클릭후 저장!!')
    }

}


//회원관리 삭제(삭제)
function delete_button() {
    var sendData = new Object();

    //데이터 Json으로 저장
    for (var i = 0; i < params.length; i++)
        sendData[params[i]] = document.getElementById(params[i]).value;

    // 데이터 전송
    socket.emit('delete_data', sendData);

    //입력값 초기화
    Default_InPut(params);

    //출력값 초기화
    num = 0;
    $("#user_log").empty();

    //이미지 초기화(사진 겹침 방지)
    $("div#image_container").empty();
}


//출입내역 조회
function search() {
    const sendData = new Object();
    const params = ['startDay', 'endDay', 'userName']

    //데이터 Json으로 저장
    for (var i = 0; i < params.length; i++)
        sendData[params[i]] = (document.getElementById(params[i]).value).replace(/\-/g, "");

    // 데이터 전송
    socket.emit('search_inout_data', sendData);

    //입력값 초기화
    // Default_InPut(params);

    // 출력값 초기화
    $(".outBoard_wrap ul #user_log").empty();
    num = 0;

}


//출입내역 조회값 출력
socket.on('search_inout', function (data) {

    $(".outBoard_wrap ul #user_log").append($("<li id=search_inout" + num + ">"));

    for (var key in data)
        if (key == 'reg_date' || key == 'dvc_nm' || key == 'user_nm' || key == 'status')
            $('#search_inout' + num).append($('<span>').text(data[key]));

    num++;
})

