// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipeBackPageThreshold: 1,
	//swipePanel: "top",
    swipePanelOnlyClose: true,
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
        case 'map.html':
            pageMap();
            break;
        case 'history.html':
            pageHistory();
            break;
    }

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

function pageHistory () {
    $('.load_').css('display', 'block');

    $.ajax({
        url: host + "/app/transactions/"+window.localStorage.getItem('user_id')
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
            item += '<h2>'+value.establishment.category+'</h2>';
            item += '<h2><b>'+value.benefit.description+'</b></h2>';
            item += '<h2><b>'+value.establishment.name+'</b></h2>';
            item += '</div>';
            item += '</div>';

            var li = $("<li />");

            li.html(item).appendTo($this);

        });

        if(results.length === 0) {
            var li = $("<li />");
            var item = '<p>Sem registros</p>';
            li.html(item).appendTo($this);
        }

    }).fail(function() {
        sweetAlert(":-( Oops...", "Não foi possível conectar ao servidor!", "error");
    }).always(function(){
        $('.load_').css('display', 'none');
    });
}
function ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}
function pageEvents () {
    $('.load_').css('display', 'block');
    $.ajax({
        url: host + "/app/transactions/"+window.localStorage.getItem('user_id')
    }).done(function(results) {
        var $this = $("#benefitsList").empty();

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
            item += '<h2>'+value.establishment.category+'</h2>';
            item += '<h2><b>'+value.benefit.description+'</b></h2>';
            item += '<h2><b>'+value.establishment.name+'</b></h2>';
            item += '</div>';
            item += '</div>';

            var li = $("<li />");

            li.html(item).appendTo($this);

        });

        if(results.length === 0) {
            var li = $("<li />");
            var item = '<p>Sem registros</p>';
            li.html(item).appendTo($this);
        }

    }).fail(function() {
        sweetAlert(":-( Oops...", "Não foi possível conectar ao servidor!", "error");
    }).always(function(){
        $('.load_').css('display', 'none');
    });
}

function pageMap () {

    var map;

    function initialize() {
        var latlng = new google.maps.LatLng(28.5197169,-81.381806);

        var options = {
            zoom: 8,
            center: latlng,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("mapa"), options);
    }

    initialize();

    var idInfoBoxAberto;
    var infoBox = [];

    function abrirInfoBox(id, marker) {
        if (typeof(idInfoBoxAberto) == 'number' && typeof(infoBox[idInfoBoxAberto]) == 'object') {
            infoBox[idInfoBoxAberto].close();
        }

        infoBox[id].open(map, marker);
        idInfoBoxAberto = id;
    }


    var markers = [];
    function carregarPontos() {
        $('.load_').css('display', 'block');
        $.ajax({
            url: host + "/app/benefits/" + window.localStorage.getItem('membership')
        }).done(function(results) {
            $.each(results, function (i, value) {
                var latlngbounds = new google.maps.LatLngBounds();

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(value.establishment.lat, value.establishment.lon),
                    title: value.establishment.name,
                    icon: 'images/icons/pin.png'
                });

                var content = '';
                content +=	'<p>'+value.establishment.category+'</p>';
                content += '<p><b>'+value.description+'</b></p>';
                content += '<p><b>'+value.establishment.name+'</b></p>';
                content += '<p>'+value.establishment.address+'</p>';

                var myOptions = {
                    content: content,
                    pixelOffset: new google.maps.Size(-150, 0)
                };

                infoBox[value.establishment.id] = new InfoBox(myOptions);
                infoBox[value.establishment.id].marker = marker;

                infoBox[value.establishment.id].listener = google.maps.event.addListener(marker, 'click', function (e) {
                    abrirInfoBox(value.establishment.id, marker);
                });

                markers.push(marker);
                latlngbounds.extend(marker.position);
            });

            var markerCluster = new MarkerClusterer(map, markers);
            map.fitBounds(latlngbounds);

            $('.load_').css('display', 'none');
        });

    };

    carregarPontos();

    $.ajax({
        url: host + "/app/transactions/"+window.localStorage.getItem('user_id')
    }).done(function(results) {



    }).fail(function() {
        sweetAlert(":-( Oops...", "Não foi possível conectar ao servidor!", "error");
    }).always(function(){
        $('.load_').css('display', 'none');
    });
}

$('#logout').on('click',function(e){
    window.localStorage.clear();
    $.ajax({
        type: 'get',
        data: {'destroy': true},
        method: 'get',
        url: 'http://revista.grupoair.com.br/wp-admin/admin-ajax.php?action=login',
        crossDomain: true, // enable this
        dataType: 'json',
        success: function(data){
            window.location.href = './login.html';
        }
    });
});

function openPage(url) {
    var caption = 'Fechar' // get translation from i18n
    window.open(url, '_blank', 'location=no,closebuttoncaption='+caption+',presentationstyle=pagesheet');
}