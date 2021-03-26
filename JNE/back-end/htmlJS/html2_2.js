
const socket = io();


{
    const PAGE_NAME1 = '2_2_1_';
    const LOG_OUT = "#anchorStatus_log";

    var num = 0, sendData = Object();

    //입력값 초기화
    function Default_InPut(data) {
        for (var i = 0; i < data.length; i++)
            document.getElementById(data[i]).value = "";
    }



    //출입내역 조회
    function search_button1() {
        const search = document.getElementById('t_search1').value;

        // 데이터 전송
        socket.emit(PAGE_NAME1 + 'search_data', search);

        //입력값 초기화
        // Default_InPut(INPUT);

        // 출력값 초기화
        $(LOG_OUT).empty();
        num = 0;

    }


    //출입내역 조회값 출력
    socket.on(PAGE_NAME1 + 'search', function (data) {
        // 검색어 초기화
        document.getElementById('t_search1').value = "";

        $(LOG_OUT).append($("<li id=search_inout" + num + ">"));

        for (var key in data)
            if (key == 'anchor_nm' || key == 'sectorarea_nm' || key == 'sector_nm' || key == 'boat_nm' || key == 'anchor_status_nm')
                $('#search_inout' + num).append($('<span>').text(data[key]));

        num++;
    })

}

{
    const PAGE_NAME2 = '2_2_2_';
    const LOG_OUT = "#boatStatus_log";

    var num = 0, sendData = { detail_cd: [], detail_nm: [] };

    //입력값 초기화
    function Default_InPut(data) {
        for (var i = 0; i < data.length; i++)
            document.getElementById(data[i]).value = "";
    }



    //출입내역 조회값 출력
    socket.on(PAGE_NAME2 + 'searchlist', function (data) {
        var detail_cd = Object.values(sendData.detail_cd);
        var detail_nm = Object.values(sendData.detail_nm);

        detail_cd.push(data.detail_cd);
        sendData.detail_cd = detail_cd;

        detail_nm.push(data.detail_nm);
        sendData.detail_nm = detail_nm;

        //console.log(sendData)

        $('#DBnmae').append('<option>' + data.detail_nm + '</option>');
    })

    //출입내역 조회
    function search_button2() {
        var selectBox = document.getElementById('selectBox').children[0].innerHTML;

        for (let index = 0; index < sendData.detail_nm.length; index++) {
            if (sendData.detail_nm[index] == selectBox) {
                // 데이터 전송
                socket.emit(PAGE_NAME2 + 'search_data', sendData.detail_cd[index]);
            }
        }

        //입력값 초기화
        // Default_InPut(INPUT);

        // 출력값 초기화
        $(LOG_OUT).empty();
        num = 0;

    }


    //출입내역 조회값 출력
    socket.on(PAGE_NAME2 + 'search', function (data) {

        $(LOG_OUT).append($("<li id=search_inout2" + num + ">"));

        for (var key in data)
            if (key == 'sectorarea_nm' || key == 'anchor_nm' || key == 'sector_nm' || key == 'anchor_status_nm' || key == 'boat_nm')
                $('#search_inout2' + num).append($('<span>').text(data[key]));

        num++;
    })

}

