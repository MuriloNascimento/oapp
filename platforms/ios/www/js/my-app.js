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

var host = 'http://checklist.grupoair.com.br'

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

  		//events
		var base = 'images/icons/black/';
    	var favEvents = [];

    	switch(file){
    		case 'index.html':
				pageEvents();
    			break;
    		case 'events.html':
    			pageEvents();
    			break;
    		case 'favorite.html':
    			pageFavorites();
    			break;
			case 'history.html':
				pageHistory();
				break;
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

			$('.load_').css('display', 'block');
			$.ajax({
		        url: host + "/app/benefits/" + window.localStorage.getItem('membership')
		    }).done(function(results) {
				var $this = $("#benefitsList").empty();

		    	$.each(results, function(i, value) {

		    		var item = '<div class="accordion-item">';

		    		item += '<div class="ev_logo">';
					item += '<img class="logo_brand" src="'+value.establishment.image+'" alt="" title="" border="0">';
					item += '</div>';

					item += '<div class="ev_content">';
					item += '<p class="title_brand">'+value.establishment.name+'</p>';
					item +=	'<p class="title_brand">'+value.establishment.category+'</p>';
					item += '<p class="title_brand">'+value.description+'</p></div>';

					item += '<div class="ev_fav">';
					item += '<div class="accordion-item-toggle">';
					item += '<img src="images/load_posts.png" alt="" title="" border="0">';
					item += '</div>';
					item += '</div>';

					item += '<div class="accordion-item-content">';
					item += '<p>'+value.establishment.name+'</p>';
					item += '<p>'+value.establishment.address+'</p>';

					item += '<p>'+value.establishment.description+'</p>';

                    item += '<input type="hidden" name="benefit_id" value="'+value.id+'">';
                    item += '<input type="hidden" name="client_id" value="'+window.localStorage.getItem('user_id')+'>';

                    item += '<div class="actions">';
                    item += '<form>';
                    item += '<input type="hidden" name="benefit_id" value="'+value.id+'">';
                    item += '<input type="hidden" name="client_id" value="'+window.localStorage.getItem('user_id')+'">';
                    item += '</form>';
                    item += '<div class="call_button btn-45"><a href="#" class="">Mapa</a></div>';
                    item += '<div class="call_button btn-45"><a href="#" class="use">Usar</a></div>';
					item += '</div>';
					item += '</div>';

					item += '</div>';

					var li = $("<li />").addClass('event_row');

					li.html(item).appendTo($this);

				});

                $('.use').on('click', function(){
                    var btn = $(this);
                    var actions = btn.parent().parent();
                    swal({
                        title: "Atenção!",
                        text: "Este benefício só pode ser utilizado uma única vez.\nUsar Agora?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#AEF4B3",
                        confirmButtonText: "Sim, usar.",
                        closeOnConfirm: false
                    }, function(){
                        $('.load_').css('display', 'block');

                        var form = actions.find('form');
                        console.log(form.serialize());
                        $.ajax({
                            type: 'post',
                            data: form.serialize(),
                            method: 'post',
                            crossDomain: true,
                            dataType: 'json',
                            url: host + "/app/use-code"
                        }).done(function(results) {

                            if (results.success) {
                                var barcode = '<div class="barcode">';
                                barcode += '<img src="'+results.barcode+'">';
                                barcode += '<p>'+results.number+'</p>';
                                barcode += '</div>';

                                actions.html(barcode);
                                swal("Usado!", "Seu benefício foi gerado com sucesso.", "success");
                            } else {
                                swal("Erro!", results.error, "error");
                            }


                        }).always(function(){
                            $('.load_').css('display', 'none');
                        });;

                    });
                });

			}).fail(function() {
		    	sweetAlert(":-( Oops...", "Não foi possível conectar ao servidor!", "error");
		  	}).always(function(){
			    $('.load_').css('display', 'none');
		  	});
		}

	function pageHistory () {
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
		$('.load_').css('display', 'block');

		$.ajax({
			url: host + "/app/transactions/84"
		}).done(function(results) {
			var $this = $("#historyList").empty();

			$.each(results, function(i, value) {

				var arr = value.created_at.split(' ');
				var date = arr[0].split('-');
				var hour = arr[1].split(':');

				var item = '<div class="post_entry">';
				item += '<div class="post_date">';
				item += '<span class="day">'+date[2]+'</span>';
				item += '<span class="month">'+date[1]+'/'+date[0]+'</span>';
				item += '<span class="month" style="margin-top: 8px">'+hour[0]+':'+hour[1]+'</span>';
				item += '</div>';
				item += '<div class="post_title">';
				item += '<h2>'+value.establishment.name+'</h2>';
				item += '</div>';
				item += '<div class="post_benefit">';
				item += '<h2>'+value.benefit.description+'</h2>';
				item += '</div>';
				item += '</div>';

				var li = $("<li />");

				li.html(item).appendTo($this);

			});

		}).fail(function() {
			sweetAlert(":-( Oops...", "Não foi possível conectar ao servidor!", "error");
		}).always(function(){
			$('.load_').css('display', 'none');
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
				swal("Usado!", "Seu benefício foi gerado com sucesso.", "success");
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
