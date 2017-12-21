$(document).ready(() => {

    SDK.Navigation.loadNav();

    SDK.Staff.findAllOrders((data, err) => {

        const $orderList = $("#orderList");

        let allOrders = data;

        allOrders.forEach((orders) => {

           let  $items = [];
           let  $orderPrice = 0;

        if (!orders.isReady){
                let $items =[];
                let $orderPrice = 0;
        }


        for (let i = 0; i < orders.items[i]; i++){

            if ($items.length>=1){
                $items += ','+ orders.items.itemDescription;
            }

            else {
                $items +=orders.items[i].itemDescription;
            }
                $orderPrice += parseInt(orders.items[i].itemPrice);
        };


       const ordersHTML=`
       <tr id = " + id + ">
       <th> ${orders.orderId} </th>
       <th> ${orders.User_userId} </th>
       <th> ${orders.orderTime}</th>
       <th> ${$items}</th>  
       </tr>    
       `

            $orderList.append(ordersHTML);

    });



    });
});