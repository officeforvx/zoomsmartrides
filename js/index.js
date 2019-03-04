var dbAccess = "http://localhost/zoomsmartappapis/dbaccess";
var dbControllers = "http://localhost/zoomsmartappapis/dbcontrollers";
var dbFiles = "http://localhost/zoomsmartappapis/databasefiles/";


document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady(){
    //checkAccountStatus();
    if(window.location.href.indexOf("continuesignup")>=0){
        showProfilePicture();
    }
}


function checkAccountStatus(){
    var userId = localStorage.getItem("uid");
    if(userId !== null){
        $.ajax({
            type : "POST",
            url : dbControllers+"/account_controllers.php",
            crossDomain: true,
            data: {"method" : "signup_status", "uid" : userId}
        }).done(function(response){
            if(response.indexO("completed")>=0){
                window.location.href= "orders.html";
            }else if(response.indexOf("upload_photo")>=0){
                window.location.href = "continuesignup.html";
            }
        });
    }else{
        window.location.href = "index.html";
    }
}

function signupProceed(obj){
var fName = $("#fname").val();
var lName = $("#lname").val();
var emailAdd = $("#emailreg").val();
var pass1 = $("#pass1").val();
var pass2 = $("#pass2").val();

if(fName.length < 3 || lName.length < 3 || emailAdd.length < 6 || pass1.length < 6 || pass2.length < 6){
    alert("One ore more required fields are invalid");
}else{
    if(pass1 != pass2){
        alert("Your passwords do not match");
    }else{
        setLoading(obj, 20, "right");
        $.ajax({
            type: "POST",
            url : dbControllers+"/account_controllers.php",
            crossDomain: true,
            data : {"method" : "customer_signup_1", "fname" : fName, "lname" : lName, "email" : emailAdd, "password" : pass1}
        }).done(function(response){
            if(response.indexOf("ACCNT_SUCCESS")>=0){
                var resp = response.split("++");
                resp = resp[1];
                localStorage.setItem("uid", resp);
                window.location.href = "continuesignup.html";
            }else if(response.indexOf("ACCNT_ERR_X")>=0){
                alert("Sorry, you already have an account with us, click the login button to continue to your account");
            }else{
                alert(response);
                unsetLoading(obj);
            }
        });
    }
}
}


function LoginProceed(obj){
var emailAdd = $("#emailadd").val();
var password = $("#password").val();
if(emailAdd.length < 6 || password.length < 8){
    alert("Your values are invalid");
}else{
    setLoading(obj, 20, "right");
    $.ajax({
        type: "POST",
        url : dbControllers+"/account_controllers.php",
        crossDomain: true,
        cache: false,
        data: {"method" : "login", "email" : emailAdd, "password" : password}
    }).done(function(response){
        if(response.indexOf("SUCCESS")>=0){
            var userId = response.split("user_id=");
            userId = userId[1];
            userId = userId.split("&");
            var nuserId = userId[0];
            
            var status = userId[1];
            status = status.split("=");
            status = status[1];
            var newStat = status.split("))");
            var nnewStat = newStat[0];
            var imageStat = newStat[1].split("((");
            imageStat = imageStat[1];

            localStorage.setItem("user_avatar", imageStat);
            localStorage.setItem("uid", nuserId);
            if(nnewStat.indexOf("completed")>=0){
                window.location.href = "orders.html";
            }else if(nnewStat.indexOf("upload_photo")>=0){
                window.location.href = "continuesignup.html";
            }else{
                alert("Your details were not validated, please try again");
            }
        }else{
            alert(response);
        }
    });
}
}
function logout(){
    localStorage.removeItem("uid");
    localStorage.removeItem("user_avatar");
    window.location.href = "index.html";
}
function setLoading(obj, size, pos){
    obj.style.backgroundImage = "img/loading-transparent.gif";
    obj.style.backgroundSize = ""+size+"px";
    obj.style.backgroundPosition = pos;
    obj.style.backgrounRepeat = "no-repeat";
}

function fetchUserName(){
    var uid = localStorage.getItem("uid");
    $.ajax({
        type : "POST",
        url : dbControllers+"/account_controllers.php",
        crossDomain: true,
        cache: false,
        data: {"method" : "username", "uid" : uid}
    }).done(function(response){
        $(".welcomeinput").text(response);
    });
}

function fetchNameOrders(){
    var uid = localStorage.getItem("uid");
    $.ajax({
        type : "POST",
        url : dbControllers+"/account_controllers.php",
        crossDomain: true,
        cache: false,
        data: {"method" : "username", "uid" : uid}
    }).done(function(response){
        $("#profilename").text(response);
    });
}

function unsetLoading(obj){
    obj.style.backgroundImage = "";
}

function triggerFile(){
    $("#imageuploader").trigger('click');
}

function triggerFile(){
    $("#imageuploader").trigger('click');
}

function uploadImage(obj){
	var file = obj.files[0];
	var formData = new FormData();
    var userId = localStorage.getItem("uid");
    if(file!== null){
        formData.append("image", file);
        formData.append("user_id", localStorage.getItem("uid"));        
        $.ajax({
            url: "http://localhost/zoomsmartappapis/uploadpic.php",
            type: "POST",
            contentType: false,
            cache: false,
            processData: false,
            crossDomain: true,
            data: formData,
            beforeSend: function(){
               $("#fakeavatar").attr('src', "img/loading-transparent.gif");
               $("#fakeavatar").css({"max-width" : "70px"});
            },success: function(data){
                if(data=="invalid"){
                    $("#fakeavatar").attr('src', "img/defaultl.png");
                    $("#fakeavatar").css({"max-width" : "100px"});    
                    alert("There was an error uploading your photo");             
                    $("#form")[0].reset();
                }else{
                    $("#form")[0].reset();
                    localStorage.setItem("user_avatar", data);
                    showProfilePicture();
                }

            }, error: function(err){

            }
        });
    }else{
        return false;
    }
}

function showProfilePicture(){
    var profilePicture = localStorage.getItem("user_avatar");
    if(profilePicture === null){
        return false;
    }else{
        $("#fakeavatar").hide();
        $("#useravatar").css({"display" : "block", "float" : "left", "width" : "100px", "height" : "100px"});
        $("#useravatar").css({"text-align" : "center", "background-image" : "url('http://localhost/zoomsmartappapis/"+profilePicture+"')", "background-repeat" : "no-repeat", "background-position" : "center", "background-size" : "cover"});
        $("#useravatar").css({"border" : "0px solid white", "border-radius" : "50px", "margin-left" : "55px", "margin-bottom" : "5px"});
        
    }
}

function completeSignup(obj){
    var address = $("#address").val();
    var phone = $("#phonenumber").val();
    var profilePicture = localStorage.getItem("user_avatar");
    var userId = localStorage.getItem("uid");
    if(address.length > 5 && phone.length > 7 && profilePicture.length > 3){
        $.ajax({
            type: "POST",
            url : dbControllers+"/account_controllers.php",
            data: {"method" : "final_signup", "address" : address, "phonenumber" : phone, "avatar" : profilePicture, "uid" : userId},
            crossDomain: true,
            beforeSend: function(){
                setLoading(obj, 20, "right");
            },success: function(data){
                if(data == "success"){
                    window.location.href = "orders.html";
                }else{
                    alert(data);
                    unsetLoading(obj);
                }
            },error: function(err){
                alert(err);
                unsetLoading(obj);
            }
        });
    }else{
        alert("Please fill out your form and upload a photo");
    }
}

function closeMenu(){
    $(".menu").animate({"margin-left" : "-200px"});
}

function openMenu(){
    $(".menu").animate({"margin-left" : "0px"});
}