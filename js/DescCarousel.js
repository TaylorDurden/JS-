;(function($) {
	var DescCarousel = function(descriptor) {
		var self = this;
		this.descriptor = descriptor;
		this.descriptorContainer = descriptor.find(".picture");
		this.descriptorCFirstItem = this.descriptorContainer.find('div.desc').first();
		this.descriptorCLastItem = this.descriptorContainer.find('div.desc').last();
		this.descItems = descriptor.find('div.desc');
		this.switchFlag = true;
		this.setInterval = 2000;
		this.speed = 500;
		// this.config = {
		// 	"width": 1000, // 幻灯片的宽度
		// 	"height": 270, // 幻灯片的高度
		// 	"posterWidth": 640, // 幻灯片第一帧的宽度
		// 	"posterHeight": 270, // 幻灯片第一帧的高度
		// 	"scale": 0.8,
		// 	"speed": 1000,
		// 	"opcatiy": 1,
		// 	"verticalAlignment": "middle",
		// 	"autoPlay": true,
		// 	"delay": 2000
		// };
		// $.extend(this.config, this.getConfig());
		// this.setConfigToElements()
		this.autoPlay();
	};
	
	DescCarousel.prototype = {
		autoPlay:function() {
			var self = this;
			this.timer = window.setInterval(function() {
				self.switch();
			}, self.setInterval);
		},
		switch: function() {
			var _this_ = this;
			var zIndexArr = [];

			this.descItems.each(function() {
				var self = $(this),
					next = self.next().get(0)?self.next():_this_.descriptorCFirstItem,
					width = next.innerWidth(),
					height = next.innerHeight(),
					zIndex = next.css('zIndex'),
					opacity = next.css('opacity'),
					left = next.css('left'),
					top = next.css('top');
					zIndexArr.push(zIndex);

					self.animate({
						// width: width,
						// height: height,
						// zIndex: zIndex,
						opacity: opacity,
						left: left,
						top: top
					}, _this_.speed);
			});

			// this.descItems.each(function(i) {
			// 	$(this).css('zIndex', zIndexArr[i]);
			// });
		},
		setConfigToElements: function() {
			this.descriptor.css({
				width: this.config.width,
				height: this.config.height
			});

			this.descriptorContainer.css({
				width: this.config.width,
				height: this.config.height
			});
		},
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
		}
	};

	DescCarousel.init = function(descriptors) {
		var _this_ = this; /* this -> DescCarousel */

		descriptors.each(function() {
			new _this_($(this)); /* this -> each element in descriptors */
		});
	}

	window['DescCarousel'] = DescCarousel;
})(jQuery);