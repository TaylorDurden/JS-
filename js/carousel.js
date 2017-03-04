;(function($) { /* 加; 是为了避免引入的文件没有;闭合而导致产生错误。 */
	var Carousel = function(poster) {
		var self = this;
		this.poster = poster;
		this.posterContainer = poster.find("ul.poster-list");
		this.posterFirstItem = this.posterContainer.find('li').first();
		this.posterLastItem = this.posterContainer.find('li').last();
		this.posterItems = poster.find('li.poster-item');
		this.switchFlag = true;

		this.nextButton = poster.find("div.poster-next-btn");
		this.prevButton = poster.find("div.poster-prev-btn");

		this.config = {
			"width": 1000, // 幻灯片的宽度
			"height": 270, // 幻灯片的高度
			"posterWidth": 640, // 幻灯片第一帧的宽度
			"posterHeight": 270, // 幻灯片第一帧的高度
			"scale": 0.8,
			"speed": 1000,
			"opcatiy": 1,
			"verticalAlignment": "middle",
			"autoPlay": true,
			"delay": 2000
		};

		$.extend(this.config, this.getConfig());
		this.setConfigToElements();
		this.setPosterPosition();
		this.nextButton.click(function() {
			if (self.switchFlag) {
				self.switchFlag = false;
				self.switchPicture('left');
			}
		});

		this.prevButton.click(function() {
			if (self.switchFlag) {
				self.switchFlag = false;
				self.switchPicture('right');
			}
		});

		if (this.config.autoPlay) {
			this.autoPlay();
			this.poster.hover(function() {
				window.clearInterval(self.timer);
			}, function() {
				self.autoPlay();
			});
		}
	};

	Carousel.prototype = {
		autoPlay: function() {
			var self = this;
			this.timer = window.setInterval(function() {
				self.nextButton.click();
			}, this.config.delay);
		},
		switchPicture: function(direction) {
			var _this_ = this;
			var zIndexArr = [];

			if (direction === 'left') {
				this.posterItems.each(function() {
					var self = $(this),
						prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
						width = prev.width(),
						height = prev.height(),
						zIndex = prev.css('zIndex'),
						opacity = prev.css('opacity'),
						left = prev.css('left'),
						top = prev.css('top');
						zIndexArr.push(zIndex);

						self.animate({
							width: width,
							height: height,
							//zIndex: zIndex,
							opacity: opacity,
							left: left,
							top: top
						}, _this_.config.speed, function() {
							_this_.switchFlag = true;
						});
				});

				this.posterItems.each(function(i) {
					$(this).css('zIndex', zIndexArr[i]);
				});
			} else {
				this.posterItems.each(function() {
					var self = $(this),
						next = self.next().get(0)?self.next():_this_.posterFirstItem,
						width = next.width(),
						height = next.height(),
						zIndex = next.css('zIndex'),
						opacity = next.css('opacity'),
						left = next.css('left'),
						top = next.css('top');
						zIndexArr.push(zIndex);

						self.animate({
							width: width,
							height: height,
							// zIndex: zIndex,
							opacity: opacity,
							left: left,
							top: top
						}, _this_.config.speed, function() {
							_this_.switchFlag = true;
						});
				});

				this.posterItems.each(function(i) {
					$(this).css('zIndex', zIndexArr[i]);
				});
			}
		},
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
					zIndex: i,
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
