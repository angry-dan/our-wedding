!function(){

  if (!allowSkrollr()) {
    var s = skrollr.init({
      scale: 15
    });
    skrollr.menu.init(s, {
      scale: 15
    });
  }
  else {
    $(function(){
      // If we're not using skrollr the least we can do is fill the elements on
      // the page.
      var height = window.document.documentElement.clientHeight;
      $('section').css({
        'min-height': height
      });
    })
  }

  jQuery.fn.scope = function() {
    var scope = this;
    return function(selector) {
      return selector ? jQuery(selector, scope) : scope;
    }
  }

  jQuery(function($){
    $('body')
      .removeClass('no-js')
      .addClass('js');

    var $form = $('#rsvp form').scope();
    $form('.yes, .no').click(function(){
      $(this).next().prop("checked", true);
      $form('.respondees').slideDown();
      $form('.yes, .no').removeClass('btn-success btn-danger');
    });
    $form('.yes').click(function(){
      $(this).addClass('btn-success');
    });
    $form('.no').click(function(){
      $(this).addClass('btn-danger');
    });

    $form().ajaxForm({
      beforeSubmit: function() {
        $form('button[type=submit]').append(
          ' <span class="glyphicon glyphicon-refresh spin" style="transform: translate(-2px, 0px);"></span>'
        );
      },
      complete: function(data, status, form) {
        $('.glyphicon-refresh', form).remove();
        $(form).slideUp().after('<p class="text-success text-center lead">Thanks, all received!</p>');
        console.log(data);
      }
    });
  });

  function allowSkrollr() {
    return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera) || $('html').hasClass('lt-ie9');
  }


}();
