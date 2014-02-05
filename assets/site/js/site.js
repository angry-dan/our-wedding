!function(){
  var controller = $.superscrollorama();


  controller.addTween(
    '#home h1',
    TweenMax.to($('#home h1'), 0.5, {css:{top:-1000}}),
    1000
  );



  $('.panel').each(function(i,el) {
    controller.pin($(el), 1000, {
      onPin: function() {
        $(el).css('height','100%');
      },
      onUnpin: function() {
        $(el).css('height','');
      }
    });
  });


  var scrollDuration = 600;



//  $('.fullscreen').css('height','100%');
//  controller.addTween('#home', TweenMax.from( $('#home'), .5, {css:{opacity: 0}}), scrollDuration);

//$('#home').css({position:'absolute','height':'100%'});
//  // pin element, use onPin and onUnpin to adjust the height of the element
//  controller.pin($('#examples-pin'), pinDur, {
//    anim:pinAnimations,
//    onPin: function() {
//      $('#examples-pin').css('height','100%');
//    },
//    onUnpin: function() {
//      $('#examples-pin').css('height','600px');
//    }
//  });

}();
