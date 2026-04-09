 function wcpd_getCookie(c_name){
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++){
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name){
            return unescape(y);
        }
    }
    return false;
}
function wcpd_setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value +  "; path=/";
}
jQuery(document).ready(function($){
    jQuery("form.cart").submit(function(e) { 
    if(wcpd.ptype==="variable"){
         e.preventDefault();
      }else{
		  return;
	  }
    var data = {
        'action': 'variable_product_disclaimer',
        'prodId': wcpd.product_id,
        'varId': jQuery(document).find("input[name='variation_id']").val()
    };
    $.post(wcpd.ajaxurl, data, function(response) {
        var obj = JSON.parse(response);
        if (obj.flag) {
           // var message = obj.message;
            var url = obj.url;
            var prodId = obj.prodId;
            var enableCookie = obj.enableCookie;
            var message = obj.message;
            if(wcpd.ptype==="variable"){
              if((jQuery('#wped_variation_disclaimer').length) == 0) {
                jQuery('body').append('<div id="wped_variation_disclaimer"><div>'+message+'</div></div>');
              }
              else{
                jQuery('#wped_variation_disclaimer').html('<div>'+message+'</div>');
              }
               tb_show('Disclaimer', '#TB_inline?inlineId=wped_variation_disclaimer','');
            }                      
                jQuery(document).on('click','.disclaimer_agree',function(a){
                    a.preventDefault();
                    // user clicked "ok"
                    $('body').toggleClass('modal-open');
                    if(enableCookie){
                        var cookie = 'product-'+prodId;
                        var duration = wcpd.session;
                        if (duration == 'session'){
                            duration = null;
                        }
                        if(wcpd_getCookie(cookie) === false){
                            wcpd_setCookie(cookie, prodId, duration);
                        }
                    }
                    $("form.cart").unbind().submit();
                    tb_remove();
                });
                jQuery('.disclaimer_reject').click(function(e) {
                    e.preventDefault();
                    if (url) {
                        window.location = url;
                    }
                    tb_remove();
                });
                   
        
        }else{
          jQuery("form.cart").unbind().submit();
        }
    });
});
 if(!wcpd.ajax_cart){
 // shop page ajax
  jQuery(".ajax_add_to_cart, .add_to_cart_button").on('click', function(e) {
        e.preventDefault();
        var path = $(this).attr('href');
        var prodId = $(this).data("product_id");
        var check = $("#check" + prodId).val();
        if (check == 'yes') {
            var message = $("#message" + prodId).val();
            var url = $("#url" + prodId).val();
            var enableCookie = $("#enableCookie" + prodId).val();
             tb_show('Disclaimer' ,'#TB_inline?inlineId=message'+prodId,'');
            jQuery(document).on('click','.disclaimer_agree',function(){
            if(enableCookie){
                var cookie = 'product-'+prodId;
                var duration = wcpd.session;
                if (duration == 'session'){
                    duration = null;
                }
                if(wcpd_getCookie(cookie) === false){
                    wcpd_setCookie(cookie, prodId, duration);
                }
            }
            //window.location = path;
        });
        jQuery('.disclaimer_reject').click(function(e) {
                    e.preventDefault();
                    if (url) {
                        window.location = url;
                    }
                });
        } 
    });
}else{
    jQuery( document ).ajaxSend(function(event, jqxhr, settings) {
           if(settings.url.indexOf('?wc-ajax=add_to_cart') != -1){
            jqxhr.abort();
           }
        });   
        //var screenHeight = $(window).height();
        jQuery('.ajax_add_to_cart, .add_to_cart_button').click(function(e) {
            e.preventDefault();
            var $thisbutton = $(this);
            var path = $thisbutton.attr('href');
            var prodId = $thisbutton.data("product_id");
            var check = $("#check" + prodId).val();
            if (check == 'yes') {
            var cookie = 'product-'+prodId;
            var duration = wcpd.session;
            if (duration == 'session'){
                duration = null;
            }
            if (check == 'yes' && wcpd_getCookie(cookie) === false) {
                var message = $("#message" + prodId).val();
                var url = $("#url"+prodId).val();

                var enableCookie = $("#enableCookie" + prodId).val();
                 tb_show('Disclaimer','#TB_inline?inlineId=message'+prodId,'');
                jQuery(document).on('click','.disclaimer_agree',function(){
                // user clicked "ok"                
                if(enableCookie){
                    if(wcpd_getCookie(cookie) === false){
                        wcpd_setCookie(cookie, prodId, duration);
                    }
                }
                // add to cart ajax
                if($thisbutton.is('.product_type_simple')){
                    if (!$thisbutton.attr('data-product_id'))
                        return true;
                    var data = {
                        action: 'woocommerce_add_to_cart',
                        product_id: $thisbutton.attr('data-product_id'),
                        quantity: $thisbutton.attr('data-quantity')
                    };
                    // Trigger event
                    $('body').trigger('adding_to_cart', [$thisbutton, data]);
                    // Ajax action
                    $.post(wc_add_to_cart_params.ajax_url, data, function(response) {
                        if (!response)
                            return;
                        var this_page = window.location.toString();
                        this_page = this_page.replace('add-to-cart', 'added-to-cart');
                        if (response.error && response.product_url) {
                            window.location = response.product_url;
                            return;
                        }
                        // Redirect to cart option
                        if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
                            window.location = wc_add_to_cart_params.cart_url;
                            return;
                        } else {
                            $thisbutton.removeClass('loading');
                            fragments = response.fragments;
                            cart_hash = response.cart_hash;
                            // Block fragments class
                            if (fragments) {
                                $.each(fragments, function(key, value) {
                                    $(key).addClass('updating');
                                });
                            }
                            // Changes button classes
                            $thisbutton.addClass('added');
                            // View cart text
                            if (!wc_add_to_cart_params.is_cart && $thisbutton.parent().find('.added_to_cart').size() === 0) {
                                $thisbutton.after(' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' +
                                        wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>');
                            }
                            // Replace fragments
                            if (fragments) {
                                $.each(fragments, function(key, value) {
                                    $(key).replaceWith(value);
                                });
                            }
                            // Unblock
                            $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();
                            // Cart page elements
                            $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function() {
                                $('div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)').addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');
                                $('.shop_table.cart').stop(true).css('opacity', '1').unblock();
                                $('body').trigger('cart_page_refreshed');
                            });

                            $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function() {
                                $('.cart_totals').stop(true).css('opacity', '1').unblock();
                            });
                            // Trigger event so themes can refresh other areas
                            $('body').trigger('added_to_cart', [fragments, cart_hash]);
                        }
                    });
                    tb_remove();
                    //return false;
                }
                return true;
                // end of add to cart
                }); 
                jQuery('.disclaimer_reject').click(function(e) {
                    e.preventDefault();
                    if (url) {
                        window.location = url;
                    }
                });
            } else {
                // add to cart ajax
                if ($thisbutton.is('.product_type_simple')) {
                    if (!$thisbutton.attr('data-product_id'))
                        return true;
                    var data = {
                        action: 'woocommerce_add_to_cart',
                        product_id: $thisbutton.attr('data-product_id'),
                        quantity: $thisbutton.attr('data-quantity')
                    };
                    // Trigger event
                    $('body').trigger('adding_to_cart', [$thisbutton, data]);
                    // Ajax action
                    $.post(wc_add_to_cart_params.ajax_url, data, function(response) {
                        if (!response)
                            return;
                        var this_page = window.location.toString();
                        this_page = this_page.replace('add-to-cart', 'added-to-cart');
                        if (response.error && response.product_url) {
                            window.location = response.product_url;
                            return;
                        }
                        // Redirect to cart option
                        if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
                            window.location = wc_add_to_cart_params.cart_url;
                            return;
                        } else {
                            $thisbutton.removeClass('loading');
                            fragments = response.fragments;
                            cart_hash = response.cart_hash;
                            // Block fragments class
                            if (fragments) {
                                $.each(fragments, function(key, value) {
                                    $(key).addClass('updating');
                                });
                            }
                            // Changes button classes
                            $thisbutton.addClass('added');
                            // View cart text
                            if (!wc_add_to_cart_params.is_cart && $thisbutton.parent().find('.added_to_cart').size() === 0) {
                                $thisbutton.after(' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' +
                                        wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>');
                            }
                            // Replace fragments
                            if (fragments) {
                                $.each(fragments, function(key, value) {
                                    $(key).replaceWith(value);
                                });
                            }
                            // Unblock
                            $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();
                            // Cart page elements
                            $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function() {
                                $('div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)').addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');
                                $('.shop_table.cart').stop(true).css('opacity', '1').unblock();
                                $('body').trigger('cart_page_refreshed');
                            });
                            $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function() {
                                $('.cart_totals').stop(true).css('opacity', '1').unblock();
                            });
                            // Trigger event so themes can refresh other areas
                            $('body').trigger('added_to_cart', [fragments, cart_hash]);
                        }
                    });
                    //return false;
                }
                return true;
                // end of add to cart
            }
        } else {
            // add to cart ajax
                if ($thisbutton.is('.product_type_simple')) {
                    if (!$thisbutton.attr('data-product_id'))
                        return true;
                    var data = {
                        action: 'woocommerce_add_to_cart',
                        product_id: $thisbutton.attr('data-product_id'),
                        quantity: $thisbutton.attr('data-quantity')
                    };
                    // Trigger event
                    $('body').trigger('adding_to_cart', [$thisbutton, data]);
                    // Ajax action
                    $.post(wc_add_to_cart_params.ajax_url, data, function(response) {
                        if (!response)
                            return;
                        var this_page = window.location.toString();
                        this_page = this_page.replace('add-to-cart', 'added-to-cart');
                        if (response.error && response.product_url) {
                            window.location = response.product_url;
                            return;
                        }
                        // Redirect to cart option
                        if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
                            window.location = wc_add_to_cart_params.cart_url;
                            return;
                        } else {
                            $thisbutton.removeClass('loading');
                            fragments = response.fragments;
                            cart_hash = response.cart_hash;
                            // Block fragments class
                            if (fragments) {
                                $.each(fragments, function(key, value) {
                                    $(key).addClass('updating');
                                });
                            }
                            // Changes button classes
                            $thisbutton.addClass('added');
                            // View cart text
                            if (!wc_add_to_cart_params.is_cart && $thisbutton.parent().find('.added_to_cart').size() === 0) {
                                $thisbutton.after(' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' +
                                        wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>');
                            }
                            // Replace fragments
                            if (fragments) {
                                $.each(fragments, function(key, value) {
                                    $(key).replaceWith(value);
                                });
                            }
                            // Unblock
                            $('.widget_shopping_cart, .updating').stop(true).css('opacity', '1').unblock();
                            // Cart page elements
                            $('.shop_table.cart').load(this_page + ' .shop_table.cart:eq(0) > *', function() {
                                $('div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)').addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');
                                $('.shop_table.cart').stop(true).css('opacity', '1').unblock();
                                $('body').trigger('cart_page_refreshed');
                            });
                            $('.cart_totals').load(this_page + ' .cart_totals:eq(0) > *', function() {
                                $('.cart_totals').stop(true).css('opacity', '1').unblock();
                            });
                            // Trigger event so themes can refresh other areas
                            $('body').trigger('added_to_cart', [fragments, cart_hash]);
                        }
                    });
                    //return false;
                }else {
                    var path = $thisbutton.attr('href');
                    window.location = path;
                }
        }
    });
} /* end else */
});