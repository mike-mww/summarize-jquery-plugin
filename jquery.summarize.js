( function($){
    $.extend({
        Summarize: function(element, customizations){
            var settings    = $.extend(true, {}, {
                    behavior:		        'toggle',   // split, hide, toggle
                    animate:                true,       // for split, toggle behaviors only
                    key:			        '*',        // "*" for all, or specific content elements
                    limit: 			        3,          // limit to summarize content to
                    showEllipsis:		    false,      // append ellipsis to the last element in the summary
                    splitTargets:           [],         // "primary" node, "secondary" node (max 2)
                    showContinueLink:       true,       
                    continueLinkText:       'Continue', // text string, or array of text strings for closed/opened states (max 2)
                    continueLinkHref:       '#',        // designate links href url
                    continueLinkClasses:    '',         // additional link css classes
                    onComplete:             null,       // function executed when countdown has completed
                }, customizations),
                
                properties = {
                    summaryChildCount: 		0,
                    summarizedChildCount:	0,
                    summaryHeight:			0,
                    summaryMaxHeight:		0,
                    summaryChildren: 		null,
                    summarySplit: 			{ 0: [], 1: [] },
                    expandable:				false,
                    limitReached:			false,
                };

            var $p = {
                init: function(){
                    if( $(element).length > 0 ){
                        $(element).each(function(){
                            var $e  = $(this),
                                _s  = settings,
                                _p  = $.extend(true, {}, properties),
                                c   = 0;

                                _s.key		= ($e.attr('data-summary-key') && $e.data('summary-key') != '')
                                                        ? $e.data('summary-key')
                                                        : ( $e.closest('.summarize').length > 0 && $e.closest('.summarize').attr('data-summary-key')
                                                            ? $e.closest('.summarize').attr('data-summary-key')
                                                            : _s.key
                                                        );
                                _s.limit	= ($e.attr('data-summary-limit') && $e.data('summary-limit') != '')
                                                        ? parseInt($e.data('summary-limit'))
                                                        : ( $e.closest('.summarize').length > 0 && $e.closest('.summarize').attr('data-summary-limit') ?
                                                            $e.closest('.summarize').attr('data-summary-limit')
                                                            : _s.limit
                                                        );
                                _s.behavior	= ($e.attr('data-summary-behavior') && $e.data('summary-behavior') != '')
                                                        ? $e.data('summary-behavior')
                                                        : _s.behavior;
                                _p.summaryChildren		= (_s.key != '*') ? _s.key : null;
                                _p.expandable 			= (_s.behavior == 'toggle') ? true : false;

                            if(!$e.hasClass('.summarize')){
                                $e.addClass('summarize');
                            }

                            if($e.children().length >= _s.limit){
                                $e.children().each(function(i){
                                    if($(this).is(_s.key) || _s.key == '*'){
                                        c++;
                                        _p.summaryChildCount = c;
                                        _p.summaryMaxHeight += $(this).outerHeight(true);

                                        if(_p.limitReached){
                                            if( _s.behavior == 'hide' ){
                                                $(this).hide();
                                                return false;
                                            } else if( _s.behavior == 'split' ){
                                                _p.summarySplit[1].push( $(this) );
                                            }
                                        } else {
                                            if(_p.summaryChildren != null){
                                                if($(this).is(_p.summaryChildren)){
                                                    _p.summarizedChildCount++;
                                                }
                                            } else {
                                                _p.summarizedChildCount++;
                                            }

                                            if(_p.expandable){
                                                _p.summaryHeight += $(this).outerHeight( (_p.summarizedChildCount == _s.limit ? false : true) );
                                            } else if( _s.behavior == 'split' ) {
                                                _p.summarySplit[0].push( $(this) );
                                            }

                                            if(_p.summarizedChildCount == _s.limit){
                                                $(this).addClass('limit');
                                                _p.limitReached = true;
                                            }
                                        }
                                    }
                                });

                                if( _s.behavior == 'split' ){
                                    $.each(_p.summarySplit, function(k, v){
                                        var splitWrap = (v.length) ? $('<div class="summary-split summary-split-' + (parseInt(k) + 1) + '"></div>').append(v) : '';

                                        if( _s.splitTargets.length && _s.splitTargets.length <= 2 ){
                                            for( var t=0; t<_s.splitTargets.length; t++ ){
                                                if( $(_s.splitTargets[k]).length ){
                                                    $(_s.splitTargets[k]).append(splitWrap);
                                                } else {
                                                    $e.append(splitWrap);
                                                }
                                            }
                                        } else {
                                            $e.append(splitWrap);
                                        }
                                    });

                                } else {
                                    $e.wrapInner('<div class="summary"></div>');
                                }

                                if( _p.expandable ){
                                    $e.children('.summary').height(_p.summaryHeight).css('overflow', 'hidden');
                                }

                                if(_s.showEllipsis){
                                    $e.children().last().append('<span class="ellipsis">[...]</span>');
                                }

                                if(_s.showContinueLink){
                                    if(_p.summaryChildCount > _s.limit){
                                        var continueLink = '<a class="continue-link' + ( _s.continueLinkClasses != null ? ' ' + _s.continueLinkClasses : '' ) + '"><span class="continue-link-text">' + ( $.isArray(_s.continueLinkText) ? _s.continueLinkText[0] : _s.continueLinkText ) + '</span></a>';

                                        $e.on('click', '.continue-link', function(e){
                                            e.stopPropagation();
                                            e.preventDefault();

                                            var sh = _p.summaryHeight;
                                            var smh = _p.summaryMaxHeight;

                                            var linkEl  = $(this),
                                                summary = linkEl.siblings('.summary');

                                            if(_s.behavior == 'toggle' || _s.behavior == ''){
                                                summary.clearQueue();

                                                if(_s.animate){
                                                    summary.animate({
                                                        height: ( summary.height() == _p.summaryHeight ? _p.summaryMaxHeight : _p.summaryHeight )
                                                    }, 400, 'swing', function(){
                                                        if($.isArray(_s.continueLinkText) && _s.continueLinkText.length > 1){
                                                            if(linkEl.is('a.continue-link')){
                                                                linkEl.children('span.continue-link-text').text(
                                                                    ( summary.height() == _p.summaryMaxHeight ? _s.continueLinkText[1] : _s.continueLinkText[0] )
                                                                );
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    summary.height(
                                                        (summary.height() == _p.summaryHeight) ? _p.summaryMaxHeight : _p.summaryHeight
                                                    );

                                                    if($.isArray(_s.continueLinkText) && _s.continueLinkText.length > 1){
                                                        if(linkEl.is('a.continue-link')){
                                                            linkEl.children('span.continue-link-text').text(
                                                                ( summary.height() == _p.summaryMaxHeight ? _s.continueLinkText[1] : _s.continueLinkText[0] )
                                                            );
                                                        }
                                                    }
                                                }
                                            } else if(_s.behavior == 'split') {
                                                var targetOffset = $(_s.splitTargets[1]).offset().top

                                                if(_s.animate){
                                                    $('html, body').animate({ scrollTop: targetOffset }, 400);
                                                } else {
                                                    $('html, body').scrollTop(targetOffset);
                                                }
                                                
                                            } else {
                                                window.location = _s.continueLinkHref;
                                            }

                                        });

                                        $e.append(continueLink);
                                    }
                                } 
                            }

                            if ( $e.is(':hidden') || $e.css('visibility') == 'hidden' ){
                                $e.css({
                                    'display': 'block',
                                    'visibility': 'visible',
                                    'height': 'auto'
                                });
                            }
                        });

                        if( settings.onComplete != null && typeof settings.onComplete === 'function' ){
                            settings.onComplete();
                        }
                    }
                },
                
                destroy: function(){
                    var $e = $(element),
                        _s = settings;

                    if( _s.behavior == 'split' ){
                        var splits = _s.splitTargets;

                        for( var t=0; t < splits.length; t++ ){
                            if( $(splits[t] + ' .summary-split').length ){
                                if( t > 0 ){
                                    $e.children('.summary-split').append( $(splits[t] + ' .summary-split').contents() );
                                    $(splits[t] + ' .summary-split').remove();
                                }
                            }
                        }

                        $e.children('.summary-split').contents().unwrap();

                    } else {
                        if( $e.children('.summary').length ){
                            $e.children('.summary').contents().unwrap();
                            $e.children(':hidden').show();
                        }                                
                    }

                    $e.find('.limit').removeClass('limit');
                    $e.find('.ellipsis').remove();

                    $e.off('click', '.continue-link');
                    $e.find('.continue-link').remove();
                    
                    $e.attr('style', '');
                },

                reset: function(){
                    $p.destroy();
                    $p.init();
                }

            }

            $p.init();
            return $p;
        }
    });
}(jQuery) );
