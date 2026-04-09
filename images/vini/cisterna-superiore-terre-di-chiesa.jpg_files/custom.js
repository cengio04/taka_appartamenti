var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
}


var autoSlideIndex = 0;
autoShowSlides();

function autoShowSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  autoSlideIndex++;
  if (autoSlideIndex > slides.length) {autoSlideIndex = 1}
  slides[autoSlideIndex-1].style.display = "block";
  setTimeout(autoShowSlides, 5000); // Change image every 2 seconds
}


/*************** Start Product Rotate On *****************/

 jQuery('li.product > a').hover(
 function(event){
  TweenMax.to(jQuery(this).children('.product-image-front2'), 3, {rotationY:180,ease:Power2.easeInOut});
  TweenMax.to(jQuery(this).children('.product-image-back2'), 3, {css:{ opacity:1 },shortRotation:{rotationY:0,rotationX:0},ease:Power2.easeInOut });
  TweenMax.to( jQuery(value), 0.9, { css:{ right:"0px",opacity:1 },  ease:Power2.easeInOut ,delay:index*0.9});
 }
 ,function(event){
  TweenMax.to(jQuery(this).children('.product-image-front2'), 3, {rotationY:0, transformOrigin:"left  50% -200"});
  TweenMax.to(jQuery(this).children('.product-image-back2'), 3, {rotationY:180, transformOrigin:"left  50% -200"});
 }
 );


/*************** End Product Rotate On *****************/
/*************** Accordion *****************/
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function(){
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}
/*************** End Accordion *****************/

em_search_bar();
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
jQuery('#searchform').each(function(index,value){
  jQuery(value).find('input#s').attr('placeholder',"Cerca");
});