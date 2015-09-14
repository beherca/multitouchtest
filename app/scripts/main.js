$(function(){
    var $score = $('#score');
    $('#door').on('touchmove', function($e){
        var e = $e.originalEvent;
        e.preventDefault();
        var touches = e.touches;
        var i = 0;
        var len = touches.length;
        var infos = [];
        for (i; i < len; i++) {
            infos.push('x['+ i +']=' + touches[i].pageX + ' y['+ i +']=' + touches[i].pageY);
        };
        $score.text(infos.join(' '));
    });
});