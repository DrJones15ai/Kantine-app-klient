$ (document).ready (() => {

    $("#create-button").click(() => {
        const username = $("#inputCreatePassword").val();
        const password = $("#inputCreatePassword").val();


        SDK.User.createUser(username, password, (data, err) => {
            if (err) {
                console.log("Der er sket en fejl");
            }
            else {
                console.log("Brugeren er oprettet");
                window.location.href = "shop.html";
            }


        });
        });

});


