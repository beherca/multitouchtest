$(function(){
    var $score = $('#score');
    var $door = $('#door');
    var $bg = $('#bg');
    var $touchPanel = $('#touch-panel');
    // the score that user get 
    var score = 0;
    // primary effective touch, which should be the first touch point, we have multi point active and dont want to miss count them 
    var primaryTouch = null;// {x: 0, y: 0, id: 0};
    // threshold to varify whether there is a switch of touch point
    var threshold = 10;

    $touchPanel.on('touchmove', function($e){
        var e = $e.originalEvent;
        e.preventDefault();
        var touches = e.touches;
        var i = 0;
        var len = touches.length;
        var infos = [];
        for (i; i < len; i++) {
            var touch = touches[i];
            var py = touch.pageY;
            var px = touch.pageX;
            var id = touch.identifier;
            if(i == 0){
                log('this is the first touch in moving touches array');
                if(primaryTouch && id == primaryTouch.id){
                    log('moving touch\' id is matched to primaryTouch');
                    score += primaryTouch.y - py;
                    primaryTouch.y = py;
                }else{
                    log('moving touch\' id is not matched to primaryTouch, need reset');
                    primaryTouch = {x:touch.pageX, y: touch.pageY, id: touch.identifier};
                }
            }
            infos.push(['x['+ i +']=', px, 'y['+ i +'] =', py, 'score = ', score].join(' '));
        };
        $score.text(infos.join(' '));
        $door.attr('style', 'touch-action: none; -webkit-transform: translateY(-'+ score/5 +'px); transform: translateY(-' + score/5 + 'px);');
    }).on('touchstart', function($e){
        log('start touch');
        var e = $e.originalEvent;
        e.preventDefault();
        var touches = e.touches;
        var len = touches.length;
        if(len > 0){
            var touch = touches[0];
            if(!primaryTouch || primaryTouch.id != touch.identifier){
                log('Initialize primary touch');
                primaryTouch = {x:touch.pageX, y: touch.pageY, id: touch.identifier};
            }
        } 
    }).on('touchend', function($e){
        log('end touch');
        var e = $e.originalEvent;
        e.preventDefault();
        var touches = e.touches;
        var len = touches.length;
        // get the very first one
        if(len > 0){
            var touch = touches[0];
            
            if(primaryTouch && primaryTouch.id == touch.identifier){
                log('Matched Touch is ended');
                primaryTouch = null;
            }
        } 
    });
});

function log(msg){
    console.log(msg);
}