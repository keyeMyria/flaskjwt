// var token_auth = 'manikandan'
var token_auth;
var app=angular.module('myApp');
app.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register,
      getUserStatus: getUserStatus
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }




    function login(email, password) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/auth', {username: email, password: password})
        // handle success
        
        .success(function (data, status) {
          // var token_auth = data.access_token
          // console.log(data.access_token+'---------'+status)
          if(status === 200 && data.access_token){

            token_auth = data.access_token;
          // token_auth= token_auth == undefined ?$sessionStorage.token_auth :token_auth;
            // $sessionStorage.token_auth=data.access_token;
            // $rootScope.token_auth= data.access_token
            console.log(token_auth)
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }



          // if(status === 200 && data.result){
          //   user = true;
          //   deferred.resolve();
          // } else {
          //   user = false;
          //   deferred.reject();
          // }


        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/register', {email: email, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function getUserStatus() {
      return $http.get('/api/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

}]);


$(document).ready(function(){
            'use strict';

                var imagewidth,imageheight,ext;
                //The Window.URL property returns an object that provides static methods used for creating and managing object URLs.
                var _URL = window.URL || window.webkitURL;
                $("#image").change(function(e) {
                    var image, file;
                    if ((file = this.files[0])) {
                        image = new Image();
                        //get the image format
                        ext = this.value.match(/\.(.+)$/)[1];
                        image.onload = function() {
                            imagewidth = this.width
                            imageheight = this.height
                            return true;
                        };
                        //Calling a static method:
                        image.src = _URL.createObjectURL(file);
                    }
                });



                        alert(token_auth)


            function isBrowserSupported () {
                var myNav = navigator.userAgent.toLowerCase();
                if(myNav.indexOf('msie') == -1) return true;
                else {
                var IEVer = parseInt(myNav.split('msie')[1])
                if(IEVer < 10) return false;
                else return true;
                }
                }
                if (!isBrowserSupported ()) {
                // alert('Internet explorer version 9 and below are not supported.');
                $('#upload-image-btn').attr('disabled',true);
                }
            function start_long_task() {
                var imageName = $("#image").val();
                if(!imageName) {
                alert("Please select an image");
                return;
                }

                // show the error message frend also
                if (imagewidth <= 512 && imageheight <= 512){
                var init_status_div = $('<div class="center-align img-sticky"><div></div><div>The image size should be above 512 * 512 pixels for prediction.</div><div>&nbsp;</div></div>');
                }
                else
                {
                 var init_status_div = $('<div class="center-align img-sticky"><div></div><div>0%</div><div>Please wait while the file is being uploaded...</div><div>&nbsp;</div></div>');
                }

                if(ext=='tif' || ext == 'tiff'){
                    alert('Please wait while the tiff image is converted.')
                    imagewidth=imageheight=undefined;
                }


                $('#progress').prepend(init_status_div);
                //appending image to result
                $('.img-sticky:first').append('<img class="image-container" src="'+ $("#process-img").attr("src") +'" />');
                // create a progress bar
                var nanobar = new Nanobar({
                    bg: '#44f',
                    target: init_status_div[0].childNodes[0]
                });

                var imageInput = document.getElementById('image');
                var image = imageInput.files[0];
                var form_data = new FormData();
                form_data.append('image', image);
                // send ajax POST request to start background job



                $.ajax({
                    type: 'POST',
                    url: '/diabetic_retinopathy/predictions',
                    data : form_data,
                    contentType: false,
                    cache: false,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "JWT "+token_auth);
                    },
                    processData: false,
                    success: function(data) {
                        if(imagewidth <= 512 && imageheight <= 512){
                        alert("The image size should be above 512 * 512 pixels for prediction.")
                        return false;
                        }
                        // var status_url = request.getResponseHeader('Location');
                        // http_status: 202(In process)
                        update_progress(data['taskstatus'], nanobar, init_status_div[0]);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                       alert(errorThrown + ': ' + 'This image could not be processed. Please try another.');
                       $(init_status_div[0].childNodes[2]).text('The uploaded image could not be processed. Please try another.');
                    }
                });

            }

            function update_progress(status_url, nanobar, status_div) {
                $.ajax({
                    type: 'GET',
                    url: status_url,
                    contentType: false,
                    cache: false,
                    success: function(data) {
                        var percent = parseInt(data['current'] * 100 / data['total']);
                        nanobar.go(percent);
                        // var mani
                        $(status_div.childNodes[1]).text(percent + '%');
                        $(status_div.childNodes[2]).text(data['status']);


                        if (data['state'] != 'PENDING' && data['state'] != 'PROGRESS') {
                            if ('result' in data) { //http_status: 200(OK, Task successfully completed)
                                //alert($(status_div.childNodes[3]).text(data['result']))
                                $(status_div.childNodes[3]).text('Result: ' + data['result']);
                                }
                            else { //http_status: 204(processed the request but not returned any prediction)
                                $(status_div.childNodes[3]).text('Result: ' + data['state']);
                                 }
                            }
                        else { //http_status: 202(In process)
                            // rerun in 1 second
                            setTimeout(function(){
                                update_progress(status_url, nanobar, status_div);
                                }, 1000);
                        }
                     },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert(textStatus + ': ' + errorThrown + ': ' + 'The prediction could not be completed.');
                    }
                });
            }
            $(function() {
                $('#upload-image-btn').click(start_long_task);
               });
            $('.btn').mouseleave(function(){
                $('.btn').css("background-color", "#f05f40");
               });

            $('#goup').click( function() {
               $(window).scrollTop(0);
             });

            $(window).scroll( function(){
                var scroll = $(window).scrollTop();
                $('#goup').removeClass('hide');
                    if (scroll < 300) {
                        $('#goup').addClass('hide');
                    }
            });
    });
