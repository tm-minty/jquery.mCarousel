/**
 * jQuery Carousel plugin
 * @version 1.1
 *
 * @author Timur R Mingaliev <timur@mingaliev.com>
 */

/*global jQuery*/
(function ($) {
    "use strict";
    $.fn.carousel = function (options) {
        var defaults = {
            backButton: '.back', // selector or jquery-object of back button
            forwardButton: '.forward', // selector or jquery-object of forward button
            elementsContainer: '.wrapper', // selector of jquery-object of elements container (ul)
            slideCount: 1, // how many element to slide
            duration: 500, // speed
            elements: 'li', // selector of elements (will be search in elements container)
            loop: true,
            beforeSlide: undefined,
            afterSlide: undefined,

            // Soon:
            easing: '',
            vertical: false
        };

        options = $.extend(defaults, options);

        var methods = {
            // Get full outer width of element(s)
            getOuterWidth: function (element) {
                var result;
                if (element !== undefined && element.length === undefined) {
                    result = $(element).width()
                        + parseInt(element.css('margin-left'), 10)
                        + parseInt(element.css('margin-right'), 10)
                        + parseInt(element.css('border-left'), 10)
                        + parseInt(element.css('border-right'), 10);
                } else {
                    var width = 0;
                    $(element).each(function () {
                        width += ($(this).width()
                            + parseInt($(this).css('margin-left'), 10)
                            + parseInt($(this).css('margin-right'), 10)
                            + ($(this).css('border-left') ? parseInt($(this).css('border-left'), 10) : 0)
                            + ($(this).css('border-right') ? parseInt($(this).css('border-right'), 10) : 0));
                    });
                    result = width;
                }
                return result;
            },
            // Move elements to the end
            moveEnd: function (count) {
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice(0, count);
                elementsContainer.append(movements.clone(true)).css({ 'left': parseInt(elementsContainer.css('left'), 10) + methods.getOuterWidth(movements) });
                movements.remove();
            },
            // Move elements to the begin
            moveBegin: function (count) {
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice(elements.length - count, elements.length);
                elementsContainer.prepend(movements.clone(true)).css({ 'left': parseInt(elementsContainer.css('left'), 10) - methods.getOuterWidth(movements) });
                movements.remove();
            },
            // Slide back method
            slideBack: function (evt, c) {
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice(elements.length - (c || options.slideCount), elements.length),
                    left = options.left + methods.getOuterWidth(movements);

                if (!options.loop) {
                    if (left > 0) {
                        left = 0;
                    }
                    options.left = left;
                }

                if (typeof options.beforeSlide === "function") {
                    options.beforeSlide.call(this, elementsContainer, options);
                }
                elementsContainer.animate({
                    'left': left
                },
                    {
                        duration: options.duration,
                        queue: true,
                        complete: function () {
                            if (options.loop) {
                                methods.moveBegin(options.slideCount);
                            }
                            if (typeof options.afterSlide === "function") {
                                options.afterSlide.call(this, elementsContainer, options);
                            }
                        }
                    });
                return false;
            },
            // Slide forward method
            slideForward: function (evt, c) {
                console.log(evt, c);
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice(0, c || options.slideCount),
                    left = options.left - methods.getOuterWidth(movements);

                if (!options.loop) {
                    var elementsWidth = methods.getOuterWidth(elements) - elementsContainer.parent().width();
                    if (elementsWidth <= Math.abs(left)) {
                        left = elementsWidth * -1;
                    }
                    options.left = left;
                }

                if (typeof options.beforeSlide === "function") {
                    options.beforeSlide.call(this, elementsContainer, options);
                }
                elementsContainer.animate({
                    'left': left
                },
                    {
                        duration: options.duration,
                        queue: true,
                        complete: function () {
                            if (options.loop) {
                                methods.moveEnd(options.slideCount);
                            }
                            if (typeof options.afterSlide === "function") {
                                options.afterSlide.call(this, elementsContainer, options);
                            }
                        }
                    });
                return false;
            }
        };

        var elementsContainer = $(options.elementsContainer),
            elements = $(options.elements, elementsContainer),
            elementsOuterWidth = methods.getOuterWidth(elements);

        options.left = 0;
        options.left -= (options.loop ? elementsOuterWidth : 0);

        elementsContainer.css({ 'left': options.left });

        if (options.loop) {
            elementsContainer.prepend(elements.clone(true)).append(elements.clone(true));
        }

        // Binding events for each carousel
        return this.each(function () {
            $(this)
                .bind("slide.back", $.proxy(methods.slideBack, this))
                .bind("slide.forward", $.proxy(methods.slideForward, this));
            $(options.backButton).bind('mousedown', $.proxy(methods.slideBack, this));
            $(options.forwardButton).bind('mousedown', $.proxy(methods.slideForward, this));
        });
    };
}(jQuery));
