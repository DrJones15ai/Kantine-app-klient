$(document).ready(() => {


SDK.Navigation.loadNav();

const $checkOut = $("#checkout-button");
const currentUser = SDK.Storage.load("currentUSer");

function load() {

    SDK.Items.findAllItems((items, err) => {


        let allItems = items;

        const $itemList = $("#modal-tbody");


        allItems.forEach((item) => {

            console.log(item);

            const itemHtml = `<tr>
                <th>${item.itemId}</th>
                <th>${item.itemDescription}</th>
                <th>${item.itemPrice}+<button class="btn btn-success purchase-button" data-item-id="${item.itemId}">Tilføj til kurv</button></th>
                            
                             
                             
            </tr>`;


            $itemList.append(itemHtml);


        });

        $(".purchase-button").click(function () {
            const itemId = $(this).data("item-id");
            const item = items.find(item => item.itemId === itemId);
            SDK.Items.addToBasket(item);
            $("#purchase-modal").modal("toggle");
        });

    });


    $("#purchase-modal").on('shown.bs.modal', () => {

        const basket = SDK.Storage.load("basket");
        const $modalTbody = $("#modal-tbody1")


        $modalTbody.empty();
        basket.forEach(entry => {

            const subtotal = entry.item.itemPrice * entry.count;
            const itemHtml = `
                <tr>
                        <th>${entry.item.itemDescription}</th>
                        <th>${entry.count}</th>
                        <th>${entry.item.itemPrice}</th>
                        <th>${subtotal}</th>
                    </tr>
                `
            $modalTbody.append(itemHtml);
        });

      if (currentUser) {
            const itemHtml = `
     <!-- <button class="btn btn-success btn-lg" id="checkout-button">Checkout</button>-->
    `
            $checkOut.append(itemHtml)

        }

        /*$modalTbody.append(`
        <tr>
            <td>
                <img src="${entry.item.i}" height="60"/>
            </td>
            <td>${entry.item.itemDescription}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.item.itemPrice}</td>
            <td>kr. ${subtotal}</td>
        </tr>
      `);*/
    });
}
load();

    $("#checkout-button").click(() => {
        console.log("checkout button click");
        const userId = SDK.Storage.load("user_id");
        const basket = SDK.Storage.load("basket");
        const selectedItems = [];
        for (let i = 0; i < basket.length; i++) {
            for (let j = 0; j < basket[i].count; j++) {
                selectedItems.push(basket[i].item);
            }

        }

        console.log(selectedItems);
        console.log(userId);
        SDK.User.create(userId, selectedItems, (data, err) => {
            if (err) {
                console.log(err);
            }
            else {
                $("#order-alert-container").find(".alert-success").show()
                SDK.Items.itemRemove("basket");
                console.log("order created");
            }
        });


    });
            //When modal closes
            /*$purchaseModal.on("hidden.bs.modal", () => {
                $modalTbody.html("");
            });*/



});



