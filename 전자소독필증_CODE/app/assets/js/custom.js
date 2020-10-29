$(document).ready(function(){
    // mylist tab menu
    $(".mylist-tab-menu li").on("click",function(e){
        e.preventDefault();
        var tg = $(this).children("a").attr("href");
        if($(this).hasClass("on")){
            return false;
        }else{
            $(".mylist-tab-menu li").removeClass("on");
            $(this).addClass("on");
            $(".mylist-wrap").css({"display":"none"});
            $(tg).fadeIn();
        }
    });
    // delete popup open
    $('.btn-delete').on('click',function(e){
        e.preventDefault();
        $('.popup-wrap.delete').fadeIn();
    });
    // popup close
    $('.btn-popup-close').on('click',function(e){
        e.preventDefault();
        $(this).parent().parent().parent('.popup-wrap').hide();
    });

    // datepicker
    $("#datePickerFrom,#datePickerFrom").datepicker({
        dateFormat: 'yy-mm-dd' 
        ,showMonthAfterYear:true      
        ,buttonImageOnly: true            
        ,yearSuffix: "년" 
        ,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] 
        ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] 
        ,dayNamesMin: ['일','월','화','수','목','금','토'] 
        ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일']        
    });                    
    
    $('#datepicker').datepicker('setDate', 'today'); 
    // choice
    $('.choice li').on('click',function(){
        $('.choice li').removeClass('on');
        $(this).addClass('on');
    });
    $('.agree-box ul li .agree-top').on('click',function(){
        $(this).siblings('.agree-inner').slideToggle();
    });
});