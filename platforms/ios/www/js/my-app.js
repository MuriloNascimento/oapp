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
		if (window.localStorage.getItem('user') != null) {
    		var favEvents = window.localStorage.getItem('fav_events').split(',')
    	}

		var url = window.location.href;
		var fileUrl = url.split("#!/");
  		
  		var file = fileUrl[1];

  		//events
		var base = 'images/icons/black/';
    	var favEvents = [];

    	if (window.localStorage.getItem('fav_events') != null) {
    		favEvents = window.localStorage.getItem('fav_events').split(',')
    	}
		
    	switch(file){
    		case 'index.html':
    			pageIndex();
    			break;
    		case 'events.html':
    			pageEvents();
    			break;
    		case 'favorite.html':
    			pageFavorites();
    			break;
    	}

		function pageIndex () {
			if (window.localStorage.getItem('user_profile') != '' && window.localStorage.getItem('user_profile') != undefined) {
				$('#user_profile').attr('src', window.localStorage.getItem('user_profile'));
			}
            $('#card_number').text(window.localStorage.getItem('card_number'));
            $('#user_email').text(window.localStorage.getItem('user_email'));
            $('.user_name').text(window.localStorage.getItem('user_name'));
            $('#user_profile').attr('src', window.localStorage.getItem('user_profile'));
            $('#qr_code').html(window.localStorage.getItem('qr_code'));
		}

		function pageEvents () {
			var app = {
			    initialize: function() {
				    this.bindEvents();
				},         
				bindEvents: function() {
				    document.addEventListener('deviceready', this.onDeviceReady, false);
				},         
				onDeviceReady: function() {
				    app.receivedEvent('deviceready');
				},
				openNativeAppWindow: function(data) {
				    window.open(data, '_system');
				}
			};

			$('#load_').css('display', 'block');
			$.ajax({
		        url: "http://beta.funpassorlando.com/api/public/index.php/establishment"
		    }).done(function(results) {
		    	var $this = $("#events").empty();
		    	console.log(results);

		    	$.each(results, function(i, value) {
		    		var isFav = $.inArray(value.id.toString(), favEvents);
		    		var icon;
		    		var favoritedClass = '';
		    		if (isFav >= 0) {
		    			icon = base + 'star_fav.png';
		    			favoritedClass = true;
		    		} else {
		    			icon = base + 'star.png';
		    		}

		    		var item = '<a href="#" class="s_info_brand">';
		    		item += '<div class="ev_logo">';
		    		item += '<img class="logo_brand" src="'+value.thumb+'" alt="" title="" border="0" />';
		    		item += '</div>';

		    		item += '<div class="ev_content">';
					item += '<p class="title_brand">'+value.name+'</p>';
					item += '<p>'+value.categories[0].name+'</p>';
					item += '<p>'+value.discount+'</p>';
					item += '</div>';
		    		item += '</a>';

					item += '<div class="ev_fav">';
					item += '<a href="#" class="a-fav" data-id="'+value.id+'">';
					item += '<img src="'+icon+'" alt="" title="" border="0" />';
					item += '</a>';
					item += '</div>';

					item += '<div class="info_brand" style="display:none">';
					item += '<p>'+value.name+'</p>';
					item += '<p>'+value.address+'</p>';
					item += '<p>'+value.description+'</p>';
					item += '<a href="geo:'+value.lat+','+value.lng+'">Ver Mapa</a>';

					item += '</div>';

					var li = $("<li />").addClass('event_row');
		    		if (favoritedClass) {
		    			li.addClass('favorited');
		    		}

					li.html(item).appendTo($this);
				  	//$('#table-modal > tbody').append(tRow);
				});
		    }).fail(function() {
		    	sweetAlert(":-( Oops...", "Não foi possível conectar ao servidor!", "error");
		  	}).always(function(){
			    $('#load_').css('display', 'none');
		  	});

			$('.use').on('click', function(){
				swal({
					title: "Atenção!",
					text: "Este benefício só pode ser utilizado uma única vez. Usar Agora?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#AEF4B3",
					confirmButtonText: "Sim, usar.",
					closeOnConfirm: false
				}, function(){
					var item = '<div class="barcode">';
					item += '<img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR-oWO3DuY6mKxpeLGiHgzwWFxOiUtvNgjPD0hGfv9gYtMzsMRx">';
					item += '<p>8885288 988959 565265</p>';
					item += '</div>';

					$('.actions').html(item);
					swal("Deleted!", "Your imaginary file has been deleted.", "success");
				});
			});
		}

		function pageFavorites () {
			console.log(window.localStorage.getItem('fav_itens'));
			$('#load_').css('display', 'block');
			$('#favorites').html(window.localStorage.getItem('fav_itens'));
			$('#load_').css('display', 'none');

			$('.a-fav').click(function () {
		    	var img = $(this).find('img');
		    	var star = '';

				index = favEvents.indexOf($(this).attr('data-id'));
				favEvents.splice(index, 1);

	    		//remove fav
	    		var item = $(this).parent().parent();
	    		item.remove();
		    	
		    	var itens = $("#events").find('li');

		    	var itensHtml = '';
		    	if (itens.length > 0) {
		    		$.each(itens,function(index){
		    			itensHtml += itens.get([index]).outerHTML;
		    		});
		    	}
			    window.localStorage.setItem('fav_itens', itensHtml);
		    	window.localStorage.setItem('fav_events', favEvents);

		    });
		}
		

  		/*$(".swipebox").swipebox();
		$(".videocontainer").fitVids();*/
		
		/*$("#ContactForm").validate({
			submitHandler: function(form) {
				ajaxContact(form);
				return false;
			}
		});*/
		

		/*$(".posts li").hide();	
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
		});*/
        	
	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);
	
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
