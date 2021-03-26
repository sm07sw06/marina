(function($,window,document,undefined){

    var winH = 0;

    function resizeFn(){
        winH = $(window).innerHeight();

            $('#header').css({ height:winH });

    }
    setTimeout(resizeFn,100);
    
    $(window).resize(function(){
        resizeFn();
    });



    $('.mainBtn').on({
        click:	function(){
            $('.sub').stop().slideUp(0);
            $(this).next().stop().slideDown(400);

            $('.mainBtn').removeClass('active');
            $(this).addClass('active');
        }
    });
    
    $('.subBtn').on({
        click:	function(){
            $('.subBtn').removeClass('subActive');
            $(this).addClass('subActive');
        }
    });

})(jQuery,window,document);//header.js