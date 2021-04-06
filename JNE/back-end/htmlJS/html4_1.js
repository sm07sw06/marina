const socket = io();
const PAGE_NAME1 = '4_1_';

var sum=0;

socket.emit(PAGE_NAME1+'updateData')

setInterval(function() {
    socket.emit(PAGE_NAME1+'updateData')
},10000)


//업데이트 초기화
socket.on(PAGE_NAME1 + 'updateDefault', function () {
    $('#warning_boat').empty();
    // $('#inOut_boat').empty();
    sum=0;
})

//관할마리나항만
socket.on(PAGE_NAME1 + 'marina', function (data) {
    $('#marina_log').append($("<li>").append($("<a href='javascript:void(0)'>").text(data.marina_nm)));
})

//위험 보트
socket.on(PAGE_NAME1 + 'warning_boat', function (data) {
    var latitude = Number(data.latitude).toFixed(2)
    var longitude = Number(data.longitude).toFixed(2)
    var warning = '<h2>재난요청</h2>'+'&nbsp<h3>경도 / 위도 : '
    warning+='' + latitude + ' / ' + longitude

    $('#warning_boat').append(warning);
    $('#warning_boat').append($("<span>").text(data.boat_nm));
})


//위험 보트
socket.on(PAGE_NAME1 + 'inOut_boat', function (data) {

    document.getElementById('inOut_boat').innerHTML=data.boat_nm;
    // $('#inOut_boat').text(data.boat_nm);
    

})

//전체 현황
socket.on(PAGE_NAME1 + 'total', function (data) {
    sum += Number(data.cnt);

    $('#total').text(sum);

    if(data.sectorarea_cd=='A'){
        document.getElementById('areaA').innerHTML=data.cnt;
    }else if(data.sectorarea_cd=='B'){
        document.getElementById('areaB').innerHTML=data.cnt;
    }else if(data.sectorarea_cd=='C'){
        document.getElementById('areaC').innerHTML=data.cnt;
    }else if(data.sectorarea_cd=='D'){
        document.getElementById('areaD').innerHTML=data.cnt;
    }else{
        document.getElementById('areaEND').innerHTML=data.cnt;
    }

})
