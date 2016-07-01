$(document).ready(function(){

    var x = 5;
    var size_li = $("#listLast5 li").size();
    $('#listLast5 li:lt('+size_li+')').hide();
    $('#listLast5 li:lt('+x+')').show();

    $('#showFiveButton').click(function(){
      x = (x+5 <= size_li) ? x+5 : size_li;
      $('#listLast5 li:lt('+x+')').show();

    });
});
