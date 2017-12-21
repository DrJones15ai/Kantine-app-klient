//Jespers javascript client exercise er brugt som udgangspunkt for dette program fra https://github.com/Distribuerede-Systemer-2017/javascript-client med direkte kopiering af enkelte metoder */
var statusCode = 200;
    const SDK = {
            serverURL: "http://localhost:8080/api",
            request: (options, cb) => {


                let headers = {};


                if (options.headers) {

                    Object.keys(options.headers).forEach(function (h) {
                        headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
                    });
                }

                $.ajax({
                    url: SDK.serverURL + options.url,
                    method: options.method,

                    headers: headers,

                    contentType: "application/json",

                    dataType: "json",

                    data: JSON.stringify(options.data),

                    success: (data, status, xhr) => {
                        cb(data, status, xhr);
                        statusCode = xhr.status;
                    },

                    error: (xhr, status, errorThrown) => {
                        cb({xhr:xhr, status: status, error: errorThrown});
                        statusCode = xhr.status;
                    }
                });

            },


            Staff:{

                findAllOrders: (cb) => {
                    SDK.request({
                        method: "GET",
                        url:"/staff/getOrders",
                        headers: {
                            authorization: "Bearer" + SDK.Storage.load("token")
                        }

                    },cb );


},

                make: (orderId, cb) =>
                {
                    SDK.request({
                        method:"POST",
                        url:"/staff/makeReady/\" + orderId",
                        headers: {
                            authorization: "Bearer" + SDK.Storage.load("token")
                        },
                        data:{
                            orderId : orderId

                        }

                    })


                }


},
            User: {

                findOrderById: (cb) => {
                    SDK.request({
                            method: "GET",
                            url: "/user/getOrdersById/" + SDK.Storage.load("user_id"),
                            data: "data",
                            headers: {authorization: "Bearer" + SDK.Storage.load("BearerToken")}
                        },
                        (err, data) => {

                            if (err)
                                return cb(err);
                            cb(null, data);
                        },
                    )
                },
                createUser: (username, password, cb) => {
                    SDK.request({
                        data: {
                            username: username,
                            password: password
                        },
                        method: "POST",
                        url: "/user/createUser",
                    }, (err) => {

                        if (err) {
                            return cb(err);
                        }

                        //success
                        cb(null);
                    })


                },

                create: (user_Id,items, cb) => {
                    SDK.request({
                            method:"POST",
                            url: "/user/createOrder",
                            data:
                                {
                                    User_userId: user_Id,
                                    items: items
                                },
                            headers:{authorization: "Bearer " + SDK.Storage.load("BearerToken")}},
                        (err, data) => {
                            if (err) return cb(err);
                            cb(null);
                        })
                },



            logIn: (username, password, cb) => {
                SDK.request({
                    data: {
                        username: username,
                        password: password
                    },
                    method: "POST",
                    url: "/start/login",
                }, (err, data) => {


                    SDK.Storage.persist("user_id", data.user_id);
                    SDK.Storage.persist("username", data.username);
                    SDK.Storage.persist("token", data.token);
                    SDK.Storage.persist("isStaff", data.isPersonel);

                    cb(null);


                });
            },


        logOut: () => {

                SDK.request({
                    data: {
                        user_id: SDK.Storage.load("user_id")
                    },
                    method: "POST",
                    url: "/start/logout",
                    headers: {
                        authorization: "Bearer " + SDK.Storage.load("token")
                    }
                }, (err, cb) => {




                    SDK.Storage.remove("user_id");
                    SDK.Storage.remove("username");
                    SDK.Storage.remove("token");
                    SDK.Storage.remove("isStaff");
                    SDK.Storage.remove("basket");


                    window.location.href = "login.html";

                });
            },
            },


        Items: {

            findAllItems: (cb) => {
                SDK.request({
                    method: "GET",
                    url: "/user/getItems/",


                }, (err, data) => {
                    if (err) {
                        return cb(err);
                    }
                    cb(data, null);
                })
            },

            addToBasket: (item) => {
                let basket = SDK.Storage.load("basket");


                if (!basket) {
                    return SDK.Storage.persist("basket", [{
                        count: 1,
                        item: item
                    }]);
                }


                let foundItem = basket.find(i => i.item.itemId === item.itemId);
                if (foundItem) {
                    let i = basket.indexOf(foundItem);
                    basket[i].count++;
                } else {
                    basket.push({
                        count: 1,
                        item: item
                    });
                }

                SDK.Storage.persist("basket", basket);
            },

            create:(itemId, itemDescription, itemPrice, cb) => {
                SDK.request({
                        method:"POST",
                        url:"/staff/createItem",
                        data:{itemId:itemId, itemDescription:itemDescription, itemPrice:itemPrice},
                        headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}}
                    ,cb);
            },

            itemRemove:(itemId)=> {
                let basket = SDK.Storage.load("basket");
                for (let i=0; i<basket.length; i++ ){
                    if (basket[i].item.itemId === itemId){
                        if (basket[i].count > 1){
                            basket[i].count--;
                        }
                        else {
                            basket.splice(i, 1);
                        }
                    }
                }
            }
        },


        Storage: {
            prefix: "KantineAppSDK",
            persist: (key, value) => {

                window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value == 'object') ? JSON.stringify(value) : value);
            },
            load: (key) => {
                const val = window.localStorage.getItem(SDK.Storage.prefix + key);
                try {
                    return JSON.parse(val);
                }
                catch (e) {
                    return val;
                }
            },
            remove: (key) => {
                window.localStorage.removeItem(SDK.Storage.prefix + key);
            }
        },

        Navigation: {

            loadNav: (cb) => {

                $("#nav-container").load("nav.html", () => {
                    const activeToken = SDK.Storage.load("token");
                    const isStaff = SDK.Storage.load("isStaff");

                    if (activeToken && !isStaff) {
                        $(".navbar-right").html(`
            <li><a href="checkout.html" id="view-basket-link"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Se kurv</a></li>
            <li><a href="#" id="logout-link">Log ud</a></li>
          `);

                    } else if (activeToken && isStaff) {


                        $("#nav-menu-link").remove();


                        $("#nav-orders-link").remove();


                        $(".navbar-nav").html(`
            <li><a href="staffOrders.html" id="view-all-orders">Se alle ordre</a></li>
          `);

                        $(".navbar-right").html(`
            <li><a href="#" id="logout-link">Logout</a></li>
          `);

                    } else {

                        $(".navbar-right").html(`
            <li><a href="login.html">Logout<span class="sr-only">(current)</span></a></li>
          `);
                    }


                    $("#logout-link").click(() => SDK.User.logOut());
                    cb && cb();

                    $("#view-basket-link").click(() => {

                        $("#purchase-modal").modal("toggle");
                    });


                    $("#purchase-modal").on("shown.bs.modal", () => {
                        const basket = SDK.Storage.load("basket");


                        if (!basket) {
                            alert("You have to add items to your basket first!");
                            $("#purchase-modal").modal("toggle");
                            return;
                        }

                        const $modalTbody = $("#modal-tbody");
                        let $sum = 0;
                        basket.forEach((entry) => {

                            $sum += entry.item.itemPrice*entry.count;


                        });

                        $modalTbody.append(`
         <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Total: kr. ${$sum}</strong></td>
        `);
                    });


                    $("#purchase-modal").on("hidden.bs.modal", () => {
                        $("#modal-tbody").children("tr").remove();
                    })


                });
            }
        }
        };








