$(function(){
    var $score = $('#score');
    var $height = $('#height');
    var $vol = $('#vol');
    var $door = $('#door');
    var $bg = $('#bg');
    var $touchPanel = $('#touch-panel');
    // distance that user gain in single move
    var score = 0;
    var scoring = 0;
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
                    scoring = primaryTouch.y - py;
                    primaryTouch.y = py;
                }else{
                    log('moving touch\' id is not matched to primaryTouch, need reset');
                    primaryTouch = {x:touch.pageX, y: touch.pageY, id: touch.identifier};
                }
            }
        };
        
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
        var touches = e.changedTouches;
        var len = touches.length;
        // get the very first one
        if(len > 0){
            var touch = touches[0];
            if(primaryTouch && primaryTouch.id == touch.identifier){
                log('Matched Touch is ended');
                primaryTouch = null;
                scoring = 0;
            }
        } 
    });
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    var debounce = 0;
    var volocity = 0;
    var deltaVol = -2;
    var doorOpenHeight = 200;
    var resistence = 10;
    var updateDoorPos = function(){
        requestAnimationFrame(updateDoorPos);
        if(doorOpenHeight < 0){
            doorOpenHeight = 0;
            volocity = - Math.floor(0.1*(volocity));
        }else{
            if(scoring == 0){
                volocity = volocity + deltaVol;
                doorOpenHeight = doorOpenHeight + volocity + scoring;
            }else{
                doorOpenHeight = doorOpenHeight + scoring;
            }
        }
        var style = 'touch-action: none; -webkit-transform: translateY(-'+ doorOpenHeight +'px); transform: translateY(-' + doorOpenHeight + 'px);';
        //$score.text('score=' + score);
        $door.attr('style', style);
        if(debounce < 10){
            debounce++;
        }else{
            $score.text('Score ' + Math.floor(scoring));
            $height.text('Height ' + Math.floor(doorOpenHeight));
            $vol.text('Volocity ' + Math.floor(volocity));
            debounce = 0;
        }
    };
    updateDoorPos();
});

function log(msg){
    console.log(msg);
}