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

//var host = 'http://app.orvipclub.com'
var host = 'http://checklist.grupoair.com.br'


// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});

/*var scrollingDiv = document.getElementById('scrollDiv');
scrollingDiv.addEventListener('touchmove', function(event){
    event.stopPropagation();
});*/

/*$$(document).on('pageshow',function(e) {
    mainView.router.loadPage("login.html");
});*/

$$(document).on('pageInit', function (e) {
    checkLanguage();

    var page = e.detail.page;

    var app = {
        initialize: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
            checkLanguage();
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

    if(!navigator.onLine){
        sweetAlert(":-( Oops...", lang.error_connection + "!", "error");
    }

    if (page.name == 'index') {
        pageEvents();
    }
    switch(file){
        case 'benefits.html':
            filterCategories('benefits');
            pageEvents();
            break;
        case 'map.html':
            filterCategories('map');
            pageMap();
            break;
        case 'history.html':
            pageHistory();
            break;
        case 'login.html':
            login();
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
            var establishmentNameI18n;
            var establishment_i18n = $.each(value.establishmentI18n, function(index, v){
                if (v.lang == lang_text) {
                    establishmentNameI18n = v.name;
                }
            });

            var benefitiDesc18n;
            var benefiti18n = $.each(value.benefitI18n, function(index, v){
                if (v.lang == lang_text) {
                    benefitiDesc18n = v.description;
                }
            });

            var categoryNameI18n;
            var cI18n = $.each(value.establishmentCategoryI18n, function(index, v){
                if (v.lang == lang_text) {
                    categoryNameI18n = v.name;
                }
            });

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
            if (categoryNameI18n != undefined) {
                item += '<h2>'+categoryNameI18n+'</h2>';
            } else {
                item += '<h2>'+value.establishmentCategory+'</h2>';
            }

            if (benefitiDesc18n != undefined) {
                item += '<h2><b>'+benefitiDesc18n+'</b></h2>';              
            } else {
                item += '<h2><b>'+value.benefit.description+'</b></h2>';
            }
            
            if (establishmentNameI18n != undefined) {
                item += '<h2><b>'+establishmentNameI18n+'</b></h2>';
            } else {
                item += '<h2><b>'+value.establishment.name+'</b></h2>';
            }

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
        sweetAlert(":-( Oops...", lang.error_connection + "!", "error");
        pageHistory();
    }).always(function(){
        $('.load_').css('display', 'none');
    });
}



function pageEvents (filter) {
    
    var $this = $("#benefitsList").empty();

    $('.load_').css('display', 'block');
    $.ajax({
        url: host + "/app/benefits/" + window.localStorage.getItem('membership'),
        data: filter
    }).done(function(results) {
        $.each(results, function(i, value) {
            var establishmentNameI18n;
            var establishmentDescI18n;
            var establishment_i18n = $.each(value.establishment_i18n, function(index, v){
                if (v.lang == lang_text) {
                    establishmentNameI18n = v.name;
                    establishmentDescI18n = v.description;
                }
            });

            var benefitiDesc18n;
            var benefiti18n = $.each(value.i18n, function(index, v){
                if (v.lang == lang_text) {
                    benefitiDesc18n = v.description;
                }
            });

            var categoryNameI18n;
            var cI18n = $.each(value.categoryI18n, function(index, v){
                if (v.lang == lang_text) {
                    categoryNameI18n = v.name;
                }
            });

            var item = '<div class="accordion-item">';
            item += '<div class="accordion-item-toggle">';
            item += '<img class="logo_brand" src="'+value.establishment.image+'" alt="" title="" border="0">';
            item += '<div class="be_content">';
            item += '<div class="ev_content">';
            if (categoryNameI18n != undefined) {
                item += '<p class="title_brand">'+categoryNameI18n+'</p>';
            } else {
                item += '<p class="title_category">'+value.categoryName+'</p>';
            }

            if (benefitiDesc18n != undefined) {
                item += '<p class="title_brand">'+benefitiDesc18n+'</p>';
              
            } else {
                item += '<p class="title_brand">'+value.description+'</p>';
            }
            
            if (establishmentNameI18n != undefined) {
                item += '<p class="title_brand">'+establishmentNameI18n+'</p>';
              
            } else {
                item += '<p class="title_brand">'+value.establishment.name+'</p>';
            }
            item += '</div>';

            item += '<div class="ev_fav">';

            item += '<img src="images/load_posts.png" alt="" title="" border="0">';
            item += '</div>';
            item += '</div>';
            item += '</div>';

            item += '<div class="accordion-item-content">';

            if (typeof establishmentDescI18n != 'undefined') {
                item += '<p class="content_desc">'+establishmentDescI18n+'</p>';
              
            } else {
                item += '<p class="content_desc">'+value.establishment.description+'</p>';
            }
            

            item += '<div class="actions">';
            item += '<form>';
            item += '<input type="hidden" name="benefit_id" value="'+value.id+'">';
            item += '<input type="hidden" name="client_id" value="'+window.localStorage.getItem('user_id')+'">';
            item += '</form>';
            //item += '<p>'+value.establishment.address+'</p>';
            //item += '<div class="call_button btn-45 btn-map"><a href="#" data-map="'+value.establishment.address+'" class="map">'+lang.map+'</a></div>';
            item += '<div class="call_button btn-45 btn-map"><a href="map.html" data-map="'+value.establishment.id+'" class="maps">'+lang.map+'</a></div>';

            item += '<div class="call_button btn-45 btn-use"><a href="#" data-single-use="'+value.single_use+'" class="use">'+lang.use+'</a></div>';
            item += '</div>';
            item += '</div>';

            item += '</div>';

            var li = $("<li />").addClass('event_row');

            li.html(item).appendTo($this);
        });
        function useCode(actions){
            var form = actions.find('form');
            $.ajax({
                type: 'post',
                data: form.serialize(),
                method: 'post',
                crossDomain: true,
                dataType: 'json',
                url: host + "/app/use-code"
            }).done(function(results) {

                if (results.success) {
                    swal(lang.success, lang.show_coupon, "success");

                    var barcode = '<div class="barcode">';
                    barcode += '<img src="'+results.barcode+'">';
                    barcode += '<p class="code_number">'+results.number+'</p>';
                    barcode += '</div>';
                    actions.html(barcode);
                } else {
                    swal("Erro!", results.error, "error");
                }

            }).fail(function() {
                sweetAlert(":-( Oops...", lang.error_connection+"!", "error");
                pageEvents();
            }).always(function(){
                $('.sweet-alert button').removeAttr("disabled");
            });
        }

        $('.map').on('click', function(e){
            e.preventDefault();
            var address = $(this).attr('data-map');
            //window.open("http://maps.apple.com/?q="+address, '_blank', 'location=no');
            window.open("maps://?q="+address, '_system', 'location=no');
        });

        $(".maps").click(function() {
            sessionStorage.param1 = $(this).attr('data-map');
            //window.location.replace("/#!/map.html");
            //window.location.href="/#!/map.html";
        });

        $('.use').on('click', function(){
            var btn = $(this);
            var actions = btn.parent().parent();
            if (btn.attr('data-single-use') == 1) {
                swal({
                    title: "Atenção!",
                    text: lang.msg_one_use+".\n"+lang.use_now+"?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#239E38",
                    confirmButtonText: "Sim, usar.",
                    closeOnConfirm: false
                }, function(){
                    $('.sweet-alert button').attr("disabled", "disabled");

                    useCode(actions);

                });
            } else {
                useCode(actions);
            }

        });

    }).fail(function() {
        sweetAlert(":-( Oops...", lang.error_connection+"!", "error");
        pageEvents();
    }).always(function(){
        $('.load_').css('display', 'none');
    });
}

function pageMap (filter) {
    var map;
    var estaId = 0;
    if (typeof sessionStorage.param1 != 'undefined') {
        estaId = sessionStorage.param1;
        sessionStorage.param1 = null;
    }
    window.scrollTo(0, 0);
    
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
            url: host + "/app/benefitAddress/" + window.localStorage.getItem('membership') + '/' + estaId,
            data: filter
        }).done(function(results) {
            $.each(results, function (i, value) {
                var establishmentNameI18n;
                var establishment_i18n = $.each(value.establishment_i18n, function(index, v){
                    if (v.lang == lang_text) {
                        establishmentNameI18n = v.name;
                    }
                });

                var benefitiDesc18n;
                var benefiti18n = $.each(value.i18n, function(index, v){
                    if (v.lang == lang_text) {
                        benefitiDesc18n = v.description;
                    }
                });

                var categoryNameI18n;
                var cI18n = $.each(value.categoryI18n, function(index, v){
                    if (v.lang == lang_text) {
                        categoryNameI18n = v.name;
                    }
                });

                var latlngbounds = new google.maps.LatLngBounds();

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(value.lat, value.lon),
                    title: value.establishment.name,
                    icon: 'images/icons/pin.png'
                });

                var content = '';
                if (categoryNameI18n != undefined) {
                    content +=  '<p>'+categoryNameI18n+'</p>';
                } else {
                    content +=  '<p>'+value.categoryName+'</p>';
                }
                
                if (benefitiDesc18n != undefined) {
                    content += '<p><b>'+benefitiDesc18n+'</b></p>';
                } else {
                    content += '<p><b>'+value.description+'</b></p>';
                }
                
                if (establishmentNameI18n != undefined) {
                    content += '<p><b>'+establishmentNameI18n+'</b></p>';
                } else {
                    content += '<p><b>'+value.establishment.name+'</b></p>';
                }

                content += '<p>'+value.address+'</p>';
                content += '<button onclick="openPage(\'http://maps.google.com/?q='+value.address+' \')" class="btn-see_map">'+lang.see_map+'</button>';

                var myOptions = {
                    content: content,
                    pixelOffset: new google.maps.Size(-150, 0)
                };

                infoBox[i] = new InfoBox(myOptions);
                infoBox[i].marker = marker;

                infoBox[i].listener = google.maps.event.addListener(marker, 'click', function (e) {
                    abrirInfoBox(i, marker);
                });

                markers.push(marker);
                latlngbounds.extend(marker.position);

            });

            var markerCluster = new MarkerClusterer(map, markers);
            map.fitBounds(latlngbounds);

        }).fail(function() {
            sweetAlert(":-( Oops...", lang.error_connection+"!", "error");
            carregarPontos();
        }).always(function(){
            $('.load_').css('display', 'none');
        });


    };

    carregarPontos();
}

function login() {
    window.localStorage.clear();
    $.ajax({
        type: 'get',
        data: {'destroy': true},
        method: 'get',
        url: 'http://revista.grupoair.com.br/wp-admin/admin-ajax.php?action=login',
        crossDomain: true, // enable this
        dataType: 'json',
        success: function(data){
            console.log('logout');
        }
    });

    $('#login').on('click',function(e){
        $('#login').attr("disabled", "disabled");
        $('.load_').css('display', 'block');
        e.preventDefault();
        var postData = $('.email-login').serialize();

        $.ajax({
            type: 'get',
            data: postData,
            method: 'get',
            url: 'http://revista.grupoair.com.br/wp-admin/admin-ajax.php?action=login',
            crossDomain: true, // enable this
            dataType: 'json',
            success: function(data){
                if (!data.loggedin) {
                    sweetAlert("Oops...", lang.error_user, "error");
                } else {

                    window.localStorage.setItem('token', data.token);
                    window.localStorage.setItem('user_id', data.user.data.ID);
                    window.localStorage.setItem('user_nicename', data.user.data.user_nicename);
                    window.localStorage.setItem('user_email', data.user.data.user_email);
                    window.localStorage.setItem('user_name', data.user.data.display_name);
                    window.localStorage.setItem('membership', data.user.data.membership);

                    insertData();

                    mainView.router.loadPage("benefits.html")

                }
                $('.load_').css('display', 'none');
                $('#login').removeAttr("disabled");

            }
            //beforeSend: setHeader
        });

        return false;
    });
}
function filterCategories(page){
    var $this = $(".list-flters").empty();
    
    $.ajax({
        url: host + "/app/categories"
    }).done(function(results) {

        $.each(results, function(i, value) {

            var item = '<input type="checkbox" name="category[]" value="'+value.id+'" />'+value.name;

            var li = $("<p />").addClass('categories-li');

            li.html(item).appendTo($this);
        });

        $('.categories-li').on('click',function(e){
            $(this).toggleClass('categories-li-active');
            var checkBoxes = $(this).find('input');
            checkBoxes.prop("checked", !checkBoxes.prop("checked"));
        });

    }).fail(function() {
        sweetAlert(":-( Oops...", lang.error_connection+"!", "error");
    });

    $('.btn-filter').on('click', function(){
        if (page == 'benefits') {
            pageEvents($('.filter-form').serializeArray());
        } else {
            pageMap($('.filter-form').serializeArray());
        }
        $(".accordion-item-toggle").trigger("click");
        $('.accordion-item').removeClass('accordion-item-expanded');
        $('.filter-content').removeAttr('style');

    });
}

function isLogged(){
    checkConnection();

    checkLanguage();
    if (window.localStorage.getItem('token') === null || window.localStorage.getItem('token') === undefined) {
        mainView.router.loadPage("login.html");
    } else {
        $('#user-panel').addClass('panel-left panel-cover');
    }
}

function openPage(url) {
    var caption = lang['close'] // get translation from i18n
    window.open(url, '_blank', 'location=no,closebuttoncaption='+caption+',presentationstyle=pagesheet');
}
function ucFirst(string) {
    return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}

var lang;
var lang_text = 'en';
function checkLanguage() {

    /*=====DEV=====*/
    // lang_text = 'pt';
    // lang = window['pt'];
    // changeText();
    
    /*=====PROD=====*/
    navigator.globalization.getPreferredLanguage(
        function (language) {
            var l_ = language.value;
            var lang_ = l_.split("-");

            lang_text = lang_[0];
            lang = window[lang_text];
            changeText();
        },
        function () {
            lang = window[lang_text];
            changeText();
        }
    );
}
function changeText(){
    $.each(lang, function(i, val) {
       $('.lang_-'+i).text(val);
    });
}

$('body').on('click', function(){
    isLogged();
});

function insertData() {
    $('.user_nicename').text(window.localStorage.getItem('user_nicename'));
    $('.user_email').text(window.localStorage.getItem('user_email'));
    $('.user_name').text(window.localStorage.getItem('user_name'));
    $('.user_plan').text(ucFirst(window.localStorage.getItem('membership')));
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert(Connection.NONE);

    //sweetAlert(":-( Oops...", lang.error_connection + "!", "error");
}