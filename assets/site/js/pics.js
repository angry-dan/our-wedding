!function(){
  jQuery(function($){

    var loading = $('<div id="home"><h1>Just a sec…</h1></div>');
    $('main').append(loading);

    getPhotos(function(photos) {
      // Messy, but performance wise very fast.
      var markup = '';
      photos.forEach(function(photo) {
        var thumbnail = getPhotoUrl(photo, MODE_THUMBNAIL);
        var full = getPhotoUrl(photo, MODE_LARGE);
        markup += '<img src="' + thumbnail + '" data-large="' + full + '" width="' + photo.width_s + '" height="' + photo.height_s + '"/>';
      });
      loading.remove();
      // Maybe we should put the images out in batches?
      $('main').prepend(markup);
    });

    $('main').on('click', 'img', function(event) {

      var $img = $(this);

      if ($img.hasClass('large')) {
        $img
          .removeClass('large')
          .css('transform', '');
          $('#underlay, #controls').removeClass('on');
        return;
      }

      selectImage($img);

    });

    $(window).resize(function() {
      var $img = $('main img.large');
      if ($img.length) {
        selectImage($img);
      }
    });

    function selectImage($img) {

      $('#underlay, #controls').addClass('on');

      var scale = 6,
        winPadding = 40;

      var
        h = $img.height(),
        w = $img.width(),
        imgLeft = $img.offset().left,
        imgTop = $img.offset().top,
        imgCenter = imgLeft + ($img.width() / 2),
        docCenter = $(document).width() / 2,
        winHeight = $(window).height() - winPadding,
        winWidth = $(window).width() - winPadding,
        scrollTop = $(window).scrollTop();

      scale = Math.min(scale, winHeight / h, winWidth / w);

      $img
        .load(function(){
          // Preload the next image.
          var $next_img = $(this).next();
          $next_img.attr('src', $next_img.data('large'))
        })
        .attr('src', $img.data('large'))
        .addClass('large')
        .css({'height': h + 'px', 'width': w + 'px'})
        .css('transform', "scale("+scale+") translate("+(docCenter - imgCenter)/scale+"px, 0px)");

      // Avoid animating the scroll position when it isn't required.
      var bottomIsBelowFold = scrollTop + winHeight < imgTop + (h * scale) + winPadding,
        topIsAboveFold = scrollTop > imgTop + (winPadding / 2);

      if (bottomIsBelowFold || topIsAboveFold ) {
        $('html, body').stop().animate({
          'scrollTop': imgTop - (winPadding / 2)
        });
      }

      $('main img.large').not($img)
        .removeClass('large')
        .css('transform', '');
    }

    $('body').click(function(event){
      if ($(event.target).is('main, body')) {
        $('main img.large')
          .removeClass('large')
          .css('transform', '');
        $('#underlay, #controls').removeClass('on');
      }
    });

    $('#go-next').click(function() {
      $('main img.large').next('img').click();
    });

    $('#go-prev').click(function() {
      $('main img.large').prev('img').click();
    });

    // One is once per item, not once per selector.
    var messageShown = false;
    $('#go-prev, #go-next').one('click', function() {
      if (!messageShown ) {
        $('#keyboardInfo').addClass('on');
        setTimeout(function(){
          $('#keyboardInfo').removeClass('on');
        },5000)
      }
      messageShown = true;
    });

    $(document).keydown(function(e) {
      switch(e.which) {
        case 37: // left
          $('main img.large').prev('img').click();
          break;

        case 39: // right
          $('main img.large').next('img').click();
          break;

        case 27: //esc
          $('main img.large').click();
          break;

        default: return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $('#go-fullscreen').click(function(){
      toggleFullScreen();
    });

    $('#go-slideshow').click(function(){

      var i = $(this).data('interval');
      if (!i) {
        if (!$('main img.large').length) {
          $('main img:first').click();
        }

        i = setInterval(function(){
          var current = $('main img.large');
          // Escape, clickout will cancel the slideshow.
          if (!current.length) {
            $('#go-slideshow').click();
            return;
          }
          current = current.next('img');
          if (!current.length) {
            current = $('main img:first')
          }
          current.click();
        }, 3000);

        $(this)
          .data('interval', i)
          .find('.glyphicon')
            .addClass('glyphicon-pause')
            .removeClass('glyphicon-play');
      }
      else {
        clearInterval(i);
        $(this)
          .removeData('interval')
          .find('.glyphicon')
            .removeClass('glyphicon-pause')
            .addClass('glyphicon-play');
      }

    });

    $('button').tooltip();

  });

  /*
    Full list:
   s	small square 75x75
   q	large square 150x150
   t	thumbnail, 100 on longest side
   m	small, 240 on longest side
   n	small, 320 on longest side
   -	medium, 500 on longest side
   z	medium 640, 640 on longest side
   c	medium 800, 800 on longest side†
   b	large, 1024 on longest side*
   o	original image, either a jpg, gif or png, depending on source format
   */
  var MODE_THUMBNAIL = 'm',
      MODE_LARGE = 'b';
      MODE_ORIGINAL = 'o';

  function getPhotoUrl(photo, mode) {
    /*
     https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
     or
     https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
     or
     https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
     */
    var base = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id;
    if (!mode) {
      return base + '_' + photo.secret + '.jpg';
    }
    if (mode === MODE_ORIGINAL) {
      return base + '_' + photo.originalsecret + '_o.' + photo.originalformat;
    }
    return base + '_' + photo.secret + '_' + mode + '.jpg';
  }

  function getPhotos(callback) {
    jQuery.getJSON('assets/site/js/photos.json', function(data_pages) {
      var photos = [];
      data_pages.forEach(function(page){
        Array.prototype.push.apply(photos, page.photoset.photo);
      })
      callback(photos);
    });
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

}();

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {
  Array.prototype.forEach=function(c,f){var d,a;if(null==this)throw new TypeError(" this is null or not defined");var b=Object(this),g=b.length>>>0;if("function"!==typeof c)throw new TypeError(c+" is not a function");1<arguments.length&&(d=f);for(a=0;a<g;){var e;a in b&&(e=b[a],c.call(d,e,a,b));a++}};
}
