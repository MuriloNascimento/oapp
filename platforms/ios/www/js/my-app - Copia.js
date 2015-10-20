// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipeBackPageThreshold: 1,
	swipePanel: "left",
	swipePanelCloseOpposite: true,
	pushState: true,
    template7Pages: true
});


// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});

/*$$(document).on("mobileinit",function() {
  $('#loading').on('pageshow',function() {

    var initial = 'login';
    if(localStorage.registered) {
      initial = 'home';
    }
    $.mobile.changePage(initial);
  });

});*/

$$(document).on('pageInit', function (e) {
	var url = window.location.href;
	var fileUrl = url.split("#!/");
		
		var file = fileUrl[1];

		if(file == 'events.html') {
		var base = 'images/icons/black/';
	    var favEvents = window.localStorage.getItem('fav_events').split(',');
			
			$.ajax({
		        url: "http://beta.funpassorlando.com/wp-json/posts/?type=item"
		    }).done(function(results) {
		    	var $this = $("#events-fav").empty();
		    	$.each(results,function(index){

		    		var isFav = $.inArray(results[index].ID.toString(), favEvents);
		    		var icon;

			    	console.log(isFav);
		    		if (isFav >= 0) {
		    			icon = base + 'star_fav.png';
		    		} else {
		    			icon = base + 'star.png';
		    		}

		    		var item = '<div class="ev_logo"><img src="'+results[index].featured_image.attachment_meta.sizes.thumbnail.url+'" alt="" title="" border="0" /></div><div class="ev_content"><p>10 - 20% OFF</p><p>'+results[index].title+'</p></div><div class="ev_fav"><a href="#" class="a-fav" data-id="'+results[index].ID+'"><img src="'+icon+'" alt="" title="" border="0" /></a></div>'
		    		$("<li />").addClass('event_row').html(item).appendTo($this);
		    	});

			    $('.a-fav').click(function () {
			    	var img = $(this).find('img');
			    	if (img.attr('src') == base + 'star.png') {
			    		favEvents.push($(this).attr('data-id'));
			    		img.attr('src', base + 'star_fav.png');
			    	} else {
						index = favEvents.indexOf($(this).attr('data-id'));
						favEvents.splice(index, 1);
			    		img.attr('src', base + 'star.png');
			    	}
			    	window.localStorage.setItem('fav_events', favEvents);
			    });
		    });

		}

		$(".swipebox").swipebox();
	$(".videocontainer").fitVids();
	
	$("#ContactForm").validate({
	submitHandler: function(form) {
		ajaxContact(form);
		return false;
	}
	});
	

	$(".posts li").hide();	
	size_li = $(".posts li").size();
	x=4;
	$('.posts li:lt('+x+')').show();
	$('#loadMore').click(function () {
		x= (x+1 <= size_li) ? x+1 : size_li;
		$('.posts li:lt('+x+')').show();
		if(x == size_li){
			$('#loadMore').hide();
			$('#showLess').show();
		}
	});
        

	/*$("a.switcher").bind("click", function(e){
		e.preventDefault();
		
		var theid = $(this).attr("id");
		var theproducts = $("ul#photoslist");
		var classNames = $(this).attr('class').split(' ');
		
		console.log(theid);
		if($(this).hasClass("active")) {
			// if currently clicked button has the active class
			// then we do nothing!
			return false;
		} else {
			// otherwise we are clicking on the inactive button
			// and in the process of switching views!

  			if(theid == "view13") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_13_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_12");
				theproducts.addClass("photo_gallery_13");

			}
			
			else if(theid == "view12") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_12_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_12");

			} 
			else if(theid == "view11") {
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_11_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_12");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_11");

			} 
			
		}

	});	*/
	
	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);
	
	// Add ScrollFix
	/*var scrollingContent = document.getElementById("pages_maincontent");
	new ScrollFix(scrollingContent);*/
	
	
	var ScrollFix = function(elem) {
		// Variables to track inputs
		var startY = startTopScroll = deltaY = undefined,
	
		elem = elem || elem.querySelector(elem);
	
		// If there is no element, then do nothing	
		if(!elem)
			return;
	
		// Handle the start of interactions
		elem.addEventListener('touchstart', function(event){
			startY = event.touches[0].pageY;
			startTopScroll = elem.scrollTop;
	
			if(startTopScroll <= 0)
				elem.scrollTop = 1;
	
			if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		}, false);
	};
	
		
		
})
