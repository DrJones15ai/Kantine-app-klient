$(document).ready(() => {



  $("#login-button").click(() => {

    const username = $("#inputUsername").val();
    const password = $("#inputPassword").val();

      SDK.User.logIn(username, password, (data,err) => {
                var code

          setTimeout(function(){

          if (err && err.xhr.status ===401){
            $(".form-group").addClass("Fejl");
          }
       else if (code == 400){
        console.log("Noget gik galt")
           $(".form-group").addClass("Fejl")
      } else {
        window.location.href = "shop.html";
      }
          }, 500);
    });

  });

});