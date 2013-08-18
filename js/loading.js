;(function($){

  var overlay_style = {
    "display": "none",
    "z-index": 9999,
    "background": "rgba(0, 0, 0, 0.5)",
    "position": "absolute"
  };

  var spinner_style = {
    "position": "absolute",
    "top": "50%",
    "left": "50%"
  };

  var overlay = null;
  var update = $.noop;

  $.loading = {

    isShowing: function(){
      return !(overlay == null);
    },

    show: function(options) {

      if (this.isShowing())
        this.hide({fadeOut: 0});

      options = $.extend({
        root: window,
        style: overlay_style,
        spinner: new Spinner(),
        fadeIn: 700,
        callback: $.noop
      }, options);

      $root = $(options.root);

      overlay = $("<div><div class=\"spinner\"></div></div>");
      overlay.css(overlay_style);
      overlay.find(".spinner").css(spinner_style).append( $(options.spinner.spin().el) );
      
      that = this;
      update = function(){

        var position = { top: 0, left: 0};
        try {
          position = $root.offset();
        } catch (e) {}

        if (that.isShowing()) {
          overlay.css({
            "top": position.top + $root.scrollTop(),
            "left": position.left + $root.scrollLeft(),
            "width": $root.width(),
            "height": $root.height()
          });
        }

      };

      $(window).on("resize", update).trigger("resize");
      $root.on("scroll", update);
      
      $("body").append(overlay);

      overlay.fadeIn(options.fadeIn, function(){
        options.callback();
      });

      return this;
    },

    hide: function(options) {
      options = $.extend({
        fadeOut: 700,
        callback: $.noop
      }, options);

      if (!this.isShowing()) 
        return this;

      overlay.fadeOut(options.fadeOut, function(){
        overlay.remove();
        overlay = null;
        options.callback();
      });
      

      return this;
    }
  };

  
})(jQuery);