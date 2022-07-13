//스크롤시 헤더 배경 흰색
$(function(){
    // 스크롤 시 header fade-in
    $(document).on('scroll', function(){
        if($(window).scrollTop() > 10){
            $("header").removeClass("deactive");
            $("header").addClass("active");
        }else{
            $("header").removeClass("active");
            $("header").addClass("deactive");
        }
    })

});