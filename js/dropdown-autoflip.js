/*
 * Fuel UX Dropdown Auto Flip
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the BSD New license.
 */

	// -- BEGIN MODULE CODE HERE --

	function _getContainer(element) {
		var containerElement, isWindow;
		if (element.attr('data-target')) {
			containerElement = element.attr('data-target');
			isWindow = false;
		} else {
			containerElement = window;
			isWindow = true;
		}

		$.each(element.parents(), function (index, value) {
			if ($(value).css('overflow') !== 'visible') {
				containerElement = value;
				isWindow = false;
				return false;
			}
		});

		return {
			overflowElement: $(containerElement),
			isWindow: isWindow
		};
	}

	function dropUpCheck(element) {
		// caching container
		var $container = _getContainer(element);

		// building object with measurementsances for later use
		var measurements = {};
		measurements.parentHeight = element.parent().outerHeight();
		measurements.parentOffsetTop = element.parent().offset().top;
		measurements.dropdownHeight = element.outerHeight();
		measurements.containerHeight = $container.overflowElement.outerHeight();

		// this needs to be different if the window is the container or another element is
		measurements.containerOffsetTop = (!!$container.isWindow) ? $container.overflowElement.scrollTop() : $container.overflowElement.offset().top;

		// doing the calculations
		measurements.fromTop = measurements.parentOffsetTop - measurements.containerOffsetTop;
		measurements.fromBottom = measurements.containerHeight - measurements.parentHeight - (measurements.parentOffsetTop - measurements.containerOffsetTop);

		// actual determination of where to put menu
		// false = drop down
		// true = drop up
		if (measurements.dropdownHeight < measurements.fromBottom) {
			return false;
		} else if (measurements.dropdownHeight < measurements.fromTop) {
			return true;
		} else if (measurements.dropdownHeight >= measurements.fromTop && measurements.dropdownHeight >= measurements.fromBottom) {
			// decide which one is bigger and put it there
			if (measurements.fromTop >= measurements.fromBottom) {
				return true;
			} else {
				return false;
			}

		}

	}

	function _autoFlip(menu) {
		// hide while the browser thinks
		$(menu).css({
			visibility: "hidden"
		});

		// decide where to put menu
		if (dropUpCheck(menu)) {
			menu.parent().addClass("dropup");
		} else {
			menu.parent().removeClass("dropup");
		}

		// show again
		$(menu).css({
			visibility: "visible"
		});
	}

	$(document.body).on('click.fu.dropdown-autoflip', '[data-toggle=dropdown][data-flip]', function (event) {
		if ($(this).data().flip === "auto") {
			// have the drop down decide where to place itself
			_autoFlip($(this).next('.dropdown-menu'));
		}
	});

	// For pillbox suggestions dropdown
	$(document.body).on('suggested.fu.pillbox', function (event, element) {
		_autoFlip($(element));
		$(element).parent().addClass('open');
	});

	// register empty plugin
	$.fn.dropdownautoflip = function () {
		/* empty */
	};
