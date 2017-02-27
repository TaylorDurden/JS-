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
			"scale": 0.8, 
			"speed": 500,
			"opcatiy": 1,
			"verticalAlignment": "middle"
		};

		$.extend(this.config, this.getConfig());
		this.setConfigToElements();
		this.setPosterPosition();
	};

	Carousel.prototype = {
		/*设置剩余的帧的位置关系*/
		setPosterPosition: function() {
			var self = this;
			var sliceItems = this.posterItems.slice(1),
				sliceSize = sliceItems.size()/2,
				rightSlice = sliceItems.slice(0, sliceSize),
				indexLevel = Math.floor(this.posterItems.size()/2),
				leftSlice = sliceItems.slice(sliceSize);

			// 设置右边帧的位置关系和宽度高度top
			var rightWidth = this.config.posterWidth,
				rightHeight = this.config.posterHeight,
				gap = ((this.config.width - this.config.posterWidth) / 2) / indexLevel;

			var firstLeft = (this.config.width - this.config.posterWidth) / 2;
			var fixedOffsetLeft = firstLeft + rightWidth;

			rightSlice.each(function(i) {
				indexLevel--;
				rightWidth = rightWidth * self.config.scale;
				rightHeight = rightHeight * self.config.scale;
				var j = i;
				$(this).css({
					zIndex: indexLevel,
					width: rightWidth,
					height: rightHeight,
					opacity: 1/(++j),
					left: fixedOffsetLeft + (++i) * gap - rightWidth,
					top: self.setVerticalAlignment(rightHeight)
				});
			});

			//设置左边的位置关系
			var leftWidth = rightSlice.last().width(),
				leftHeight = rightSlice.last().height(),
				opcatiyLoop = Math.floor(this.posterItems.size()/2);
			leftSlice.each(function(i) {
				$(this).css({
					zIndex: indexLevel,
					width: leftWidth,
					height: leftHeight,
					opacity: 1/opcatiyLoop,
					left: i * gap,
					top: self.setVerticalAlignment(leftHeight)
				});
				leftWidth = leftWidth / self.config.scale;
				leftHeight = leftHeight / self.config.scale;
				opcatiyLoop--;
			});
		},
		setVerticalAlignment: function(height) {
			var verticalType = this.config.verticalAlignment,
				top = 0;

			if (verticalType === 'middle'){
				top = (this.config.height - height) / 2;
			} else if (verticalType === 'top'){
				top = 0;
			} else if (verticalType === 'bottom'){
				top = this.config.height - height;
			} else {
				top = (this.config.height - height) / 2;
			}
			return top;
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
				width: this.config.posterWidth,
				height: this.config.postHeight,
				zIndex: Math.floor(this.posterItems.size() / 2), // 向下取整
				top:0,
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