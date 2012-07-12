(function($, undefined){
    $.fn.carousel = function(options){
        var defaults = {
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
        };

        options = $.extend( defaults, options );

        var methods = {
            // Get full outer width of element(s)
            getOuterWidth: function(element){
                if( typeof element != 'undefined' && typeof element.length == 'undefined'){
                    return $(element).width() 
                                    + parseInt(element.css('margin-left'), 10)
                                    + parseInt(element.css('margin-right'), 10)
                                    + parseInt(element.css('border-left'), 10)
                                    + parseInt(element.css('border-right'), 10);
                }else{
                    var width = 0;
                    $(element).each(function(){
                        width += ($(this).width() 
                                    + parseInt($(this).css('margin-left'), 10)
                                    + parseInt($(this).css('margin-right'), 10)
                                    + parseInt($(this).css('border-left'), 10)
                                    + parseInt($(this).css('border-right'), 10));
                    });
                    return width;
                }
            },
            // Move elements to the end
            moveEnd: function( count ){
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice( 0, count );
                elementsContainer.append(movements.clone(true)).css({ 'left': parseInt(elementsContainer.css('left'), 10) + methods.getOuterWidth(movements) });
                movements.remove();
            },
            // Move elements to the begin
            moveBegin: function( count ){
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice( elements.length - count, elements.length );
                elementsContainer.prepend(movements.clone(true)).css({ 'left': parseInt(elementsContainer.css('left'), 10) - methods.getOuterWidth(movements) });
                movements.remove();
            },
            // Slide back method
            slideBack: function(){
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice( elements.length - options.slideCount, elements.length );
                elementsContainer.animate({ 
                    'left': left + methods.getOuterWidth(movements) 
                },
                {
                    duration: options.duration, 
                    queue: true,
                    complete: function(){ 
                        methods.moveBegin(options.slideCount) 
                    }
                });
            },
            // Slide forward method
            slideForward: function(){
                var elementsContainer = $(options.elementsContainer),
                    elements = $(options.elements, elementsContainer),
                    movements = elements.slice( 0, options.slideCount );
                elementsContainer.animate({ 
                    'left': left - methods.getOuterWidth(movements) 
                },
                {
                    duration: options.duration, 
                    queue: true,
                    complete: function(){ 
                        methods.moveEnd(options.slideCount) 
                    }
                });
            }
        };

        var elementsContainer = $(options.elementsContainer),
            elements = $(options.elements, elementsContainer),
            elementsOuterWidth = methods.getOuterWidth(elements),
            left = 0 - elementsOuterWidth;

        elementsContainer.prepend(elements.clone(true)).append(elements.clone(true)).css({ 'left': left });

        // Binding events for each carousel
        return this.each(function(){
            $(options.backButton).bind('click', $.proxy(methods.slideBack, this));
            $(options.forwardButton).bind('click', $.proxy(methods.slideForward, this));
        });
    };
})(jQuery);
