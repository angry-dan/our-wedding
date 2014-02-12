!function(){

  var s = skrollr.init();
  skrollr.menu.init(s);

  jQuery.fn.scope = function() {
    var scope = this;
    return function(selector) {
      return jQuery(selector, scope)
    }
  }

  jQuery(function($){
    $('body').addClass('js');

    updateMenu();

    var $form = $('#rsvp form').scope();
    $form('.yes, .no').click(function(){
      $(this).next().click();
      $form('.respondees').slideDown();
      $form('.yes, .no').removeClass('btn-success btn-danger');
    });
    $form('.yes').click(function(){
      $(this).addClass('btn-success');
    });
    $form('.no').click(function(){
      $(this).addClass('btn-danger');
    });
  });


  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }


}();

// https://gist.github.com/paulirish/1579671

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
      || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());
