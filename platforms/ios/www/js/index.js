// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);
var db = window.openDatabase("DB", "1.0", "Just a Dummy DB", 200000);

$(document).on('pageinit', '#login' ,function(){
    console.log('index');
});

function onDeviceReady() {
    db.transaction(populateDB, errorCB, successCB);
}

//create table and insert some record
function populateDB(tx) {
    /*tx.executeSql('DROP TABLE IF EXISTS fp_user');
    tx.executeSql('CREATE TABLE IF NOT EXISTS fp_user (
        id integer primary key, 
        name text, 
        qrcode text,
        brand text,
        background text,
        card integer,
        hash text
    )');
    tx.executeSql("INSERT INTO fp_user (name, qrcode, brand, background, card, hash) VALUES ('Rafa Alves', 'qr', 'brand', 'back', 9999999998811, 'hash000')");
*/
    /*tx.executeSql('CREATE TABLE IF NOT EXISTS fp_fav (id integer primary key, name text, description text, image text)');
    tx.executeSql("INSERT INTO fp_fav (name, description, image) VALUES ('Disney','20 - 30% OFF', 'jjjj')");
    tx.executeSql("INSERT INTO fp_fav (name, description, image) VALUES ('Orlando FC','10% OFF', 'aaaa')");
    tx.executeSql("INSERT INTO fp_fav (name, description, image) VALUES ('Beach','20% OFF', 'bbb')");
    tx.executeSql("INSERT INTO fp_fav (name, description, image) VALUES ('other','10 - 20% OFF', 'cccc')");*/

}

//function will be called when an error occurred
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//function will be called when process succeed
function successCB() {
    db.transaction(queryDB,errorCB);
}

function queryDB(tx){
    $('#name-user').text('Rafael Alves');
    /*$.ajax({
        url: "http://echo.jsontest.com/user/Holo_Johnson/key/novo"
    }).done(function(data) {
        alert(data.user);
    });*/


    /*$.ajax({
        url: "http://jsonplaceholder.typicode.com/posts"
    }).done(function(results) {
        /*$.each(results,function(data){
            
       });
    });*/

    /*tx.executeSql('SELECT * FROM fp_fav', [], function (tx, result) {
        $.each(result.rows,function(index){
            var row = result.rows.item(index);
            $('#name-user').text(row['name']);
        });
    });*/

        
    /*tx.executeSql('SELECT * FROM fp_fav', [], function (tx, results) {
    });*/
    //tx.executeSql('SELECT * FROM fp_fav',[],querySuccess);
}

function querySuccess(tx,result){
    /*$.each(result.rows,function(index){
        var row = result.rows.item(index);
        $('#name-user').text(row['data']);
    });*/
}

