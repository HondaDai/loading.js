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
      
      var that = this;
      update = function(){

        var position = { top: 0, left: 0};
        try {
          position = $root.offset() || $root.position();
        } catch (e) {}

        if (that.isShowing()) {
          overlay.css({
            "top": position.top + $root.scrollTop(),
            "left": position.left + $root.scrollLeft(),
            "width": $root.outerWidth(),
            "height": $root.outerHeight()
          });
        }
      };

      $(window).on("resize", update).trigger("resize");
      $root.on("scroll", update);
      
      $("body").append(overlay);

      overlay.fadeIn(options.fadeIn);
      setTimeout(function(){
        options.callback();
      }, options.fadeIn);

      return this;
    },

    hide: function(options) {
      options = $.extend({
        fadeOut: 700,
        callback: $.noop
      }, options);

      if (!this.isShowing()) 
        return this;

      overlay.fadeOut(options.fadeOut);
      setTimeout(function(){

        $(window).off("resize", update)
        overlay.off("scroll", update);
        overlay.remove();
        overlay = null;
        options.callback();

      }, options.fadeOut);

      return this;
    }
  };

  
})(jQuery);