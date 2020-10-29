$(document).ready(function(){
    // datepicker
  $("#datepickerStart, #datepickerEnd").datepicker({
    dateFormat: 'yy-mm-dd'
  });
  var winH = $(window).height();
  $('.lnb-menu').css({"min-height":winH-180});


  // datepicker
  $("#issuDt, #issuDt").datepicker({
    dateFormat: 'yy-mm-dd'
  })
  var winH = $(window).height();
  $('.lnb-menu').css({"min-height":winH-180});
});
