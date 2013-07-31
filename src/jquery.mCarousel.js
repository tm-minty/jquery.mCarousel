/**
 * jQuery mCarousel plugin
 * @version 1.1.2
 *
 * @author Timur R Mingaliev <timur@mingaliev.com>
 */

/*global jQuery*/
/*jslint browser: true, devel: true, vars: true, todo: true*/
(function ($) {
    "use strict";
    // TODO: Access to methods from $(element).mCarousel("method", "methodName", [arguments]);
    $.fn.mCarousel = function (options) {
        var Plugin = function (options) {
                var self = this,
                    defaults = {
                        backButton: '.back', // selector or jquery-object of back button
                        forwardButton: '.forward', // selector or jquery-object of forward button
                        elementsContainer: '.wrapper', // selector of jquery-object of elements container (ul)
                        elements: 'li', // selector of elements (will be search in elements container)
                        slideCount: 1, // how many element to slide
                        duration: 500, // speed

                        // Soon:
                        easing: '',
                        loop: true,
                        beforeSlide: undefined,
                        afterSlide: undefined,
                        vertical: false
                    },
                    left = 0,
                    elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    elementsOuterWidth;

                options = $.extend(defaults, options);

                this.methods = {
                    // Get full outer width of element(s)
                    getOuterWidth: function (element) {
                        var width;
                        if (element !== undefined && element.length === undefined) {
                            width = $(element).width()
                                + parseInt(element.css('margin-left'), 10)
                                + parseInt(element.css('margin-right'), 10)
                                + parseInt(element.css('border-left'), 10)
                                + parseInt(element.css('border-right'), 10);
                        } else {
                            width = 0;
                            $(element).each(function () {
                                width += ($(this).width()
                                    + parseInt($(this).css('margin-left'), 10)
                                    + parseInt($(this).css('margin-right'), 10)
                                    + ($(this).css('border-left') ? parseInt($(this).css('border-left'), 10) : 0)
                                    + ($(this).css('border-right') ? parseInt($(this).css('border-right'), 10) : 0));
                            });
                        }
                        return width;
                    },
                    // Move elements to the end
                    moveEnd: function (count) {
                        var elementsContainer = $(options.elementsContainer),
                            elements = $(options.elements, elementsContainer),
                            movements = elements.slice(0, count);
                        elementsContainer
                            .append(movements.clone(true))
                            .css({
                                'left': parseInt(elementsContainer.css('left'), 10) + self.methods.getOuterWidth(movements)
                            });
                        movements.remove();
                    },
                    // Move elements to the begin
                    moveBegin: function (count) {
                        var elementsContainer = $(options.elementsContainer),
                            elements = $(options.elements, elementsContainer),
                            movements = elements.slice(elements.length - count, elements.length);
                        elementsContainer
                            .prepend(movements.clone(true))
                            .css({
                                'left': parseInt(elementsContainer.css('left'), 10) - self.methods.getOuterWidth(movements)
                            });
                        movements.remove();
                    },
                    // Slide back method
                    slideBack: function () {
                        var elementsContainer = $(options.elementsContainer),
                            elements = $(options.elements, elementsContainer),
                            movements = elements.slice(elements.length - options.slideCount, elements.length);
                        if (typeof options.beforeSlide === "function") {
                            options.beforeSlide.call(this, elementsContainer, options);
                        }
                        elementsContainer.animate({
                            'left': left + self.methods.getOuterWidth(movements)
                        }, {
                            duration: options.duration,
                            queue: true,
                            complete: function () {
                                self.methods.moveBegin(options.slideCount);
                                if (typeof options.afterSlide === "function") {
                                    options.afterSlide.call(this, elementsContainer, options);
                                }
                            }
                        });
                        return false;
                    },
                    // Slide forward method
                    slideForward: function () {
                        var elementsContainer = $(options.elementsContainer),
                            elements = $(options.elements, elementsContainer),
                            movements = elements.slice(0, options.slideCount);
                        if (typeof options.beforeSlide === "function") {
                            options.beforeSlide.call(this, elementsContainer, options);
                        }
                        elementsContainer.animate({
                            'left': left - self.methods.getOuterWidth(movements)
                        }, {
                            duration: options.duration,
                            queue: true,
                            complete: function () {
                                self.methods.moveEnd(options.slideCount);
                                if (typeof options.afterSlide === "function") {
                                    options.afterSlide.call(this, elementsContainer, options);
                                }
                            }
                        });
                        return false;
                    },
                    refreshPosition: function () {
                        elementsOuterWidth = self.methods.getOuterWidth(elements);
                        left = elementsOuterWidth * -1;
                        elementsContainer.css({'left': left});
                    },
                    /**
                     * Options getter/setter
                     * If value is defined, set new option value and return it
                     * Anyway method returns value of option
                     *
                     * @param name {String} Option name
                     * @param value {*} New option value
                     * @returns {*}
                     */
                    // TODO: Set options by object
                    option: function (name, value) {
                        if (value) {
                            options[name] = value;
                        }
                        if (name === undefined) {
                            return "";
                        }
                        return options[name];
                    }
                };

                elementsContainer.prepend(elements.clone(true)).append(elements.clone(true));
                this.methods.refreshPosition();

                // Binding events for each carousel
                return this;
            },
            plugin = new Plugin(options);
        return this.each(function () {
            var $self = $(this);
            $(this).data("mCarousel", plugin);
            $(window).on("resize", function () {
                $self.data("mCarousel").methods.refreshPosition();
            });
            $(options.backButton).on('mousedown', $.proxy(plugin.methods.slideBack, this));
            $(options.forwardButton).on('mousedown', $.proxy(plugin.methods.slideForward, this));
        });
    };
}(jQuery));