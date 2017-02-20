;(function($) { /* 加; 是为了避免引入的文件没有;闭合而导致产生错误。 */
	var Carousel = function(poster) {

		this.poster = poster;
		this.posterContainer = poster.find("ul.poster-list");
		this.posterFirstItem = this.posterContainer.find('li').eq(0);
		this.posterItems = poster.find('li.poster-item');

		this.nextButton = poster.find("div.poster-next-btn");
		this.prevButton = poster.find("div.poster-prev-btn");

		this.config = {
			"width": 1000, // 幻灯片的宽度
			"height": 270, // 幻灯片的高度
			"posterWidth": 640, // 幻灯片第一帧的宽度
			"posterHeight": 270, // 幻灯片第一帧的高度
			"scale": 0.9, 
			"speed": 500,
			"verticalAlignment": "middle"
		};

		$.extend(this.config, this.getConfig());
		this.setConfigToElements();
	};

	Carousel.prototype = {
		/*设置剩余的帧的位置关系*/
		setPosterPosition: function() {
			var sliceItems = this.posterItems.slice(1),
				sliceSize = sliceItems.size()/2,
				rightSlice = sliceItems.slice(0, sliceSize),
				indexLevel = Math.floor(this.posterItems.size()/2);

			// 设置右边帧的位置关系和宽度高度top
			var rightWidth = this.config.posterWidth,
				rightHeight = this.config.posterHeight,
				gap = ((this.config.width - this.config.posterWidth) / 2) / indexLevel;


			rightSlice.each(function(i) {
				indexLevel--;
				rightWidth = rightWidth * self.config.scale;
				rightHeight = rightHeight * self.config.scale;
				$(this).css({
					zIndex: xx,
					width: ww,
					height: hh,
					opcatiy: oo,
					left: ll
				});
			});
		},

		//设置配置参数值来控制基本的宽高比例等
		setConfigToElements: function() {
			this.poster.css({
				width: this.config.width,
				height: this.config.height
			});

			this.posterContainer.css({
				width: this.config.width,
				height: this.config.height
			});

			//计算上下切换按钮的宽度
			var computedWidthForSwitchButton = (this.config.width - this.config.posterWidth) / 2;
			this.nextButton.css({
				width: computedWidthForSwitchButton,
				height: this.config.height,
				zIndex: Math.ceil(this.posterItems.size() / 2) // 向上取整
			});
			this.prevButton.css({
				width: computedWidthForSwitchButton,
				height: this.config.height,
				zIndex: Math.ceil(this.posterItems.size() / 2) 
			});

			this.posterFirstItem.css({
				left: computedWidthForSwitchButton,
				width: this.config.width,
				height: this.config.height,
				zIndex: Math.floor(this.posterItems.size() / 2) // 向下取整
			});
		},
		// 获取人工配置参数
		getConfig: function() {
			var config = this.poster.data('config');
			return config !==""&& config != null ? config : {};			
		}
	};

	Carousel.init = function(posters) {
		var _this_ = this; /* this -> Carousel */

		posters.each(function() {
			new _this_($(this)); /* this -> each element in posters */
		});
	}

	window['Carousel'] = Carousel;
})(jQuery);