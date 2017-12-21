$(document).ready(() => {

    SDK.Navigation.loadNav();



        const $basketTbody = $("#basket-tbody");
        const $checkoutAuctions = $("#checkout-actions")

        function loadBasket() {

            const currentUser = SDK.Storage.load("currentUser");
            const basket = SDK.Storage.load("basket") || [];
            let total = 0;

            console.log(basket);

            basket.forEach(entry => {
                const subtotal = entry.item.itemPrice * entry.count;
                total += subtotal;
                const itemHtml = `
                <tr>
                         <td>
                        </td>
                        <th>${entry.item.itemDescription}</th>
                        <th>${entry.item.count}</th>
                        <th>${entry.item.itemPrice}</th>
                        <th>${subtotal}</th>
                    </tr>
                
                `;

                $basketTbody.append(itemHtml);

                $basketTbody.append(`
      <tr>
        <td colspan="3"></td>
        <td><b>Subtotal</b></td>
        <td>kr. ${total}</td>
      </tr>`);

                if (currentUser) {
                    $checkoutAuctions.append(`
                    <button class="btn btn-success btn-lg" id="checkout-button">Checkout</button>
                    `);
                }


                /* const basket = SDK.Storage.load("basket");
                 const $basketTbody = $("#basket-tbody")


                 $basketTbody.empty();
                 basket.forEach(entry => {

                     const subtotal = entry.item.itemPrice * entry.count;
                     const itemHtml=`
                     <tr>
                             <th>${entry.item.itemDescription}</th>
                             <th>${entry.count}</th>
                             <th>${entry.item.itemPrice}</th>
                             <th>${subtotal}</th>
                         </tr>
                     `
                     $basketTbody.append(itemHtml);
                 });*/


            });
        }


        loadBasket();

        $("#clear-basket-button").click(() => {
            SDK.Storage.remove("basket");
            window.location.href = "checkout.html";

        });

        $("#checkout-button").click(() => {
            console.log("button clicked");
            let userId = SDK.Storage.load("userId");
            let basket = SDK.Storage.load("basket");
            let itemList = [];

            basket.forEach((item, i, basket) => {
                itemList.push(basket[i].item);
            });

            SDK.User.create(userId, itemList, (data, err)=>{
                if (err) {
                    console.log("error.");
                }
                else {
                    SDK.Storage.remove("basket");
                    window.alert("Order confirmed!");
                    window.location.href = "canteen.html";

                }
            });

        });





});






