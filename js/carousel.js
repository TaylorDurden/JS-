;(function($) { /* 加; 是为了避免引入的文件没有;闭合而导致产生错误。 */
	var Carousel = function(poster) {
		alert(poster);
	};

	Carousel.prototype = {};

	Carousel.init = function(posters) {
		var _this_ = this; /* this -> Carousel */

		posters.each(function() {
			new _this_($(this)); /* this -> each element in posters */
		});
	}

	window['Carousel'] = Carousel;
})(jQuery);