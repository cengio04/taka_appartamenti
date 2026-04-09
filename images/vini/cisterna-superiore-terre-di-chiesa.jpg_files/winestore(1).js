function em_search_bar(){
	jQuery(".search-input").val('Cerca');
	searchinput = jQuery(".search-input"),
	searchvalue = searchinput.val();
	searchinput.click(function(){
		if (jQuery(this).val() === searchvalue) jQuery(this).val("");
	});
	searchinput.blur(function(){
		if (jQuery(this).val() === "") jQuery(this).val(searchvalue);
	});
	
	jQuery('#searchform').each(function(index,value){
		jQuery(value).find('input#s').attr('placeholder',"Cerca");
	});
	
}

if (typeof checkIfTouchDevice != 'function') { 
    function checkIfTouchDevice(){
        touchDevice = !!("ontouchstart" in window) ? 1 : 0; 
		if( jQuery.browser.wd_mobile ) {
			touchDevice = 1;
		}
		return touchDevice;      
    }
}

function sticky_main_menu( on_touch ){
		var _topSpacing = 0;
		if( jQuery('body').hasClass('logged-in') && jQuery('body').hasClass('admin-bar') && jQuery('#wpadminbar').length > 0 ){
			_topSpacing = jQuery('#wpadminbar').height();
		}
		if( !on_touch && jQuery(window).width() > 768 ){
			jQuery(".header-top").sticky({topSpacing:_topSpacing});
		}
}




function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



function onSizeChange(windowWidth){
	if( windowWidth >= 768 ) {
			jQuery('a.block-control').removeClass('active').hide();
			jQuery('a.block-control').parent().siblings().show();
	}
	if( windowWidth < 768 ) {
			jQuery('a.block-control').removeClass('active').show();
			jQuery('a.block-control').parent().siblings().hide();
	}		

}

function get_layout_config( container_width, number_item){
	ret_value = new Array(283,'100%');
	if( container_width >= 960 ){
		var _num_show = Math.min(number_item,4);
		ret_value[1] = _num_show*25 + "%";
		return ret_value;
	}
	if( container_width > 600 && container_width < 960 ){
		var _num_show = Math.min(number_item,3);
		ret_value[0] = 380;
		ret_value[1] = _num_show*33.3333333333 + "%";
		return ret_value;
	}
	if( container_width <= 500 && container_width > 380 ){
		ret_value[0] = 380;
		var _num_show = Math.min(number_item,2);
		ret_value[1] = _num_show*50 + "%";
		return ret_value;
	}
	ret_value[0] = 380;
	return ret_value;
}


function change_cart_items_mobile(){
	var _cart_items = parseInt(jQuery( "#cart_size_value_head" ).text());
	_cart_items = isNaN(_cart_items) ? 0 : _cart_items;
	jQuery('.mobile_cart_container > .mobile_cart_number').text(_cart_items);
}


jQuery(document).ready(function($) {
		on_touch = checkIfTouchDevice();
		
		if (jQuery.browser.msie && jQuery.browser.version == 10) {
			$("html").addClass("ie10 ie");
		}

		/*************** Start Woo Add On *****************/
		jQuery('body').bind( 'adding_to_cart', function() {
			jQuery('.cart_dropdown').addClass('disabled working');
		} );		
		
		jQuery('#products-tabs-wrapper > ul.nav.nav-tabs > li').bind('click',function(){
			jQuery("#products-tabs-wrapper").trigger('tabs_change');
		});
				
		jQuery('.add_to_cart_button').live('click',function(event){
			var _li_prod = jQuery(this).parent().parent();
			_li_prod.trigger('wd_adding_to_cart');
		});
		
		jQuery('li.product').bind('wd_adding_to_cart', function() {
			jQuery(this).addClass('adding_to_cart').append('<div class="loading-mark-up"><div class="loading-image"></div></div>');
			var _loading_mark_up = jQuery(this).find('.loading-mark-up').css({'width' : jQuery(this).width()+'px','height' : jQuery(this).height()+'px'}).show();
		});
		jQuery('li.product').each(function(index,value){
			jQuery(value).bind('wd_added_to_cart', function() {
				var _loading_mark_up = jQuery(value).find('.loading-mark-up').remove();
				jQuery(value).removeClass('adding_to_cart').addClass('added_to_cart').append('<span class="loading-text">Successfully added to your shopping cart</span>');
				var _load_text = jQuery(value).find('.loading-text').css({'width' : jQuery(value).width()+'px','height' : jQuery(value).height()+'px'}).delay(1500).fadeOut();
				setTimeout(function(){
					_load_text.hide().remove();
				},1500);	
			});	
		});	
		
		
		jQuery('body').bind( 'added_to_cart', function(event) {
			var _added_btn = jQuery('li.product').find('.add_to_cart_button.added').removeClass('added').addClass('added_btn');
			var _added_li = _added_btn.parent().parent();
			_added_li.each(function(index,value){
				jQuery(value).trigger('wd_added_to_cart');
			});
		
			jQuery.ajax({
				type : 'POST'
				,url : _ajax_uri	
				,data : {action : 'update_tini_cart'}
				,success : function(respones){
					if( jQuery('.shopping-cart-wrapper').length > 0 ){
						jQuery('.shopping-cart-wrapper').html(respones);
						jQuery('.cart_dropdown,.form_drop_down').hide();
						jQuery('body').trigger('mini_cart_change');
						change_cart_items_mobile();
					}
				}
			});			
		} );			
		jQuery('.cart_dropdown,.form_drop_down').hide();
		change_cart_items_mobile();

		
		jQuery('.wd_tini_cart_wrapper,.wd_tini_account_wrapper').hoverIntent(
			function(){
				jQuery(this).children('.drop_down_container').slideDown(300);
			}
			,function(){
				jQuery(this).children('.drop_down_container').slideUp(300);
			}
		
		);

		jQuery('body').live('mini_cart_change',function(){
			jQuery('.wd_tini_cart_wrapper,.wd_tini_account_wrapper').hoverIntent(
				function(){
					jQuery(this).children('.drop_down_container').slideDown(300);
				}
				,function(){
					jQuery(this).children('.drop_down_container').slideUp(300);
				}
			
			);
		});	
		
		//cart update
		jQuery('div.cart-total-wrapper .wd_update_cart').click(function(){
			jQuery( ".woocommerce form.wd_form_cart .wd_update_hidden" ).trigger("click");
		});	
			
		jQuery('input.subscribe_email').focus(function(event){
			if( jQuery(this).val() == "enter your email address" ){
				jQuery(this).val("");
			}
		});	
		jQuery('input.subscribe_email').blur(function(event){
			if( jQuery(this).val() == "" ){
				jQuery(this).val("enter your email address");
			}
		});			
			
		//product_label
		
		
		// _s_controller = jQuery.superscrollorama({triggerAtCenter: true});
		// jQuery('span.product_label').each(function(index,value){
			// _ele_bgcolor = jQuery(value).css('background-color');
			// _s_controller.addTween(jQuery(value), TweenMax.to( jQuery(value), .5, {css:{scare:1.5,opacity:1,top:26,height:"60px",width:"60px",right:-30,boxShadow: "0px 0px 6px 3px "+_ele_bgcolor,fontSize : 16 }, immediateRender:false,yoyo:true,repeat:1, ease:Power3.easeInOut}),100,0,true);
		// });
		
		
		// jQuery('.custom_category_shortcode > ul.products').children('li.product').hover(
			// function(){
				// TweenMax.to( jQuery(this), .9, {css:{opacity:1}})
			// }
			// ,function(){
				// TweenMax.to( jQuery(this), .9, {css:{opacity:0.7}})
			// }
		// );
		jQuery('div.custom_category_shortcode').each(function(index,value){
			// jQuery(value).children('ul.products').children('li.product').not('.featured_product_wrapper').each(function(li_index,li_value){
				// _s_controller.addTween(jQuery(li_value), TweenMax.from( jQuery(li_value), .9, {css:{opacity:0.7}, immediateRender:true, ease:Power3.easeInOut}));
			// });		
			// var _big_ele = jQuery(value).find('.featured_product_wrapper');
			// var _haft_container_width = _big_ele.width()/2;
			// _s_controller.addTween(jQuery(_big_ele), TweenMax.from( jQuery(_big_ele), .9, {css:{left:_haft_container_width}, immediateRender:true, ease:Power3.easeInOut}));
			// jQuery(value).children('ul.products').children('li.product').not('.featured_product_wrapper').each(function(li_index,li_value){
				// _s_controller.addTween(jQuery(li_value), TweenMax.from( jQuery(li_value), .9, {css:{opacity:0,right:"-100px"}, immediateRender:true, ease:Power3.easeInOut}));
			// });
		});
		
		
		/*************** End Woo Add On *****************/
		
		
		/*************** Start Product Rotate On *****************/
		
		// jQuery('li.product > a').hover(
			// function(event){
				// // TweenMax.to(jQuery(this).children('.product-image-front'), 3, {rotationY:180,ease:Power2.easeInOut});
				// // TweenMax.to(jQuery(this).children('.product-image-back'), 3, {css:{ opacity:1 },shortRotation:{rotationY:0,rotationX:0},ease:Power2.easeInOut });
				// // TweenMax.to( jQuery(value), 0.9, { css:{ right:"0px",opacity:1 },  ease:Power2.easeInOut ,delay:index*0.9});
			// }
			// ,function(event){
				// // TweenMax.to(jQuery(this).children('.product-image-front'), 3, {rotationY:0, transformOrigin:"left  50% -200"});
				// // TweenMax.to(jQuery(this).children('.product-image-back'), 3, {rotationY:180, transformOrigin:"left  50% -200"});
			// }
		// );

		
		/*************** End Product Rotate On *****************/
		
		/***** Start Re-init Cloudzoom on Variation Product  *****/
		jQuery('form.variations_form').live('found_variation',function( event, variation ){	
			var image_link = variation.image_link; 
			jQuery('.product_thumbnails li a[href="'+image_link+'"]').trigger('click');
			if (jQuery('.woocommerce-main-image.cloud-zoom').data('zoom') != null){
				//jQuery('.woocommerce-main-image.cloud-zoom').data('zoom').destroy();
				//jQuery('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
			}
		}).live('reset_image',function(){
			jQuery('.product_thumbnails li a:first').trigger('click');
			//jQuery('#qs-zoom,.wd-qs-cloud-zoom,.cloud-zoom, .cloud-zoom-gallery').CloudZoom({}); 
		});
		/***** End Re-init Cloudzoom on Variation Product  *****/     
		
		if (jQuery.browser.msie && ( parseInt( jQuery.browser.version, 10 ) == 7 )){
			alert("Your browser is too old to view this interactive experience. You should take the next 30 seconds or so and upgrade your browser! We promise you'll thank us after doing so in having a much better and safer web browsing experience! ");
		}

		
		// jQuery('#MobileMainNavigation').live('change',function(event) {	
			// event.preventDefault();
			// window.location.href = jQuery(this).find('option:selected').val();
			
		// });
		em_search_bar();
		var windowWidth = jQuery(window).width();
		
		setTimeout(function () {
			  onSizeChange(windowWidth);
		}, 1000);	
		
        jQuery('a.block-control').click(function(){
            jQuery(this).parent().siblings().slideToggle(300);
            jQuery(this).toggleClass('active');
            return false;
        });
		
		//flexslider slider
		jQuery('.portfolio-slider').flexslider({
			animation: "slide"
		});
	
		jQuery('.related-slider').flexslider({
			animation: "slide"
		});
		

		jQuery("a.wd-prettyPhoto").prettyPhoto({
				social_tools: false,
				theme: 'pp_woocommerce',
				horizontal_padding: 10,
				opacity: 0.9,
				deeplinking: false
			});		
		
		jQuery('li.shortcode').hover(function(){
			jQuery(this).addClass('shortcode_hover')},function(){jQuery(this).removeClass('shortcode_hover');});
		



		
		////////// Generate Tab System /////////
		if(jQuery('.tabs-style').length > 0){
			jQuery('.tabs-style').each(function(){
				var ul = jQuery('<ul></ul>');
				var divPanel = jQuery('<div></div>');
				var liChildren = jQuery(this).find('li.tab-item');
				var length = liChildren.length;
				divPanel.addClass('panel');
				jQuery(this).find('li.tab-item').each(function(index){
					jQuery(this).children('div').appendTo(divPanel);
					if(index == 0)
						jQuery(this).addClass('first');
					if(index == length - 1)
						jQuery(this).addClass('last');
					jQuery(this).appendTo(ul);
					
				});
				jQuery(this).append(ul);
				jQuery(this).append(divPanel);
				
					jQuery( this ).tabs({ fx: { opacity: 'toggle', duration:'slow'} }).addClass( 'ui-tabs-vertical ui-helper-clearfix' );
				
			});		
		}
		

		
		// Toggle effect for ew_toggle shortcode
		jQuery( '.toggle_container a.toggle_control' ).click(function(){
			if(jQuery(this).parent().parent().parent().hasClass('show')){
				jQuery(this).parent().parent().parent().removeClass('show');
				jQuery(this).parent().parent().parent().addClass('hide');
				jQuery(this).parent().parent().children('.toggle_content ').hide('slow');
			}
			else{
				jQuery(this).parent().parent().parent().addClass('show');
				jQuery(this).parent().parent().parent().removeClass('hide');
				jQuery(this).parent().parent().children('.toggle_content ').show('slow');
			}
				
		});
		

		jQuery('p:empty').remove();
		
		// button state demo
		jQuery('.btn-loading')
		  .click(function () {
			var btn = jQuery(this)
			btn.button('loading')
			setTimeout(function () {
			  btn.button('reset')
			}, 3000)
		  });
		
		// tooltip 
		jQuery('body').tooltip({
		  selector: "a[rel=tooltip]"
		});
	 

		
		if( jQuery('html').offset().top < 100 ){
			jQuery("#to-top").hide();
		}
		jQuery(window).scroll(function () {
			
			if (jQuery(this).scrollTop() > 100) {
				jQuery("#to-top").fadeIn();
			} else {
				jQuery("#to-top").fadeOut();
			}
		});
		jQuery('.scroll-button').click(function(){
			jQuery('body,html').animate({
			scrollTop: '0px'
			}, 1000);
			return false;
		});			

		
		jQuery('#myTab a').click(function (e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});
	
		
		jQuery('form.checkout').on('submit',function(){
			
			if(jQuery('#collapse-createaccount').length > 0){
				console.log('sdfsdf');
				jQuery('#collapse-createaccount').find('#createaccount').prop( "checked",true );
			}
		});
			
		jQuery('.carousel').each(function(index,value){
			jQuery(value).wipetouch({
				tapToClick: false, // if user taps the screen, triggers a click event
				wipeLeft: function(result) { 
					jQuery(value).find('a.carousel-control.right').trigger('click');
					//jQuery(value).carousel('next');
				},
				wipeRight: function(result) {
					jQuery(value).find('a.carousel-control.left').trigger('click');
					//jQuery(value).carousel('prev');
				}
			});	
		});
		
		
		// jQuery("ul.social-share > li > a > span").css("position","relative").css("right","500px").css("opacity","0");
		// jQuery("ul.social-share > li > a > span").each(function(index,value){
			// TweenMax.to( jQuery(value), 0.9, { css:{ right:"0px",opacity:1 },  ease:Power2.easeInOut ,delay:index*0.9});
		// });

		
		//product seach
		if(jQuery('form.products-search input.search-input-btn:first').length > 0){
			jQuery('form.products-search input.search-input-btn:first').attr('title','Cerca');
		}
		
		// Set menu on top
		//sticky_main_menu( on_touch );
		if( on_touch == 0 ){
			jQuery(window).bind('resize',$.throttle( 250, 
				function(){
					if( !( jQuery.browser.msie &&  parseInt( jQuery.browser.version, 10 ) <= 7 ) ){
						onSizeChange( jQuery(window).width() );
						menu_change_state( jQuery('body').innerWidth() );	
					}
				})
			);
		}else{
			jQuery(window).bind('orientationchange',function(event) {	
					onSizeChange( jQuery(window).width() );
					menu_change_state( jQuery('body').innerWidth() );				
			});
		}
		
		setTimeout(function () {
			jQuery("div.shipping-calculator-form").show(400);
		}, 1500);
		
		//jQuery('div.wd-prod-toggle .accordion-group .accordion-body:first').collapse('show');
		
		jQuery(".right-sidebar-content > ul > li:first").addClass('first');
		jQuery(".right-sidebar-content > ul > li:last").addClass('last');
		
		
		jQuery(".product_upsells > ul").each(function( index,value ){
			jQuery(value).children("li:last").addClass('last');
		});
		

		jQuery("ul.product_list_widget").each(function(index,value){
			jQuery(value).children("li:first").addClass('first');
			jQuery(value).children("li:last").addClass('last');
		});
		jQuery(".related.products > ul > li:last").addClass('last');
		
		jQuery('.shop_table > tbody > tr:first').addClass('first');
		jQuery('.shop_table > tbody > tr:last').addClass('last');
});

