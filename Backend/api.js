/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var CRYPTO = require("crypto");

var public = "sandbox_i97626205035";
var private = "sandbox_948SJHMlKqOGytO5jA16q6lv9auHAhBJhtiEEbSv";



exports.createOrder =  function(req, res) {
    console.log(req.body);
    var orderInfo = req.body;
    var price = totalPrice(orderInfo.cart);
    var order = {
        version: 3,
        public_key: puk,
        action: "pay",
        amount: price,
        currency: "UAH",
        description: orderDescription(
            orderInfo.customerData.name,
            orderInfo.customerData.phNumber,
           orderInfo.customerData.adress,
            orderInfo.cart,
            price
        ),
        order_id: 1,
        sandbox: 1
    };

    var order_base64 = new Buffer(JSON.stringify(order)).toString("base64");
    var result = JSON.stringify({
        data: order_base64,
        signature: sha1(prk + order_base64 + prk)
    });
    res.send(result);
};

var crypto = require("crypto");
var puk = "sandbox_i97626205035";
var prk = "sandbox_948SJHMlKqOGytO5jA16q6lv9auHAhBJhtiEEbSv";

function sha1(string) {
    var sha1 = crypto.createHash("sha1");
    sha1.update(string);
    return sha1.digest("base64");
}

function totalPrice(cart) {
    var price = 0;
    cart.forEach(function(item){ price +=  item.pizza[item.size].price * item.quantity});
    return price;
}

function orderDescription(name, phone, address, cart, price) {
    var description = "";
    description += "Замовлення піци: " + name + "\n";
    description += "Адреса доставки: " + address + "\n";
    description += "Телефон: " + phone + "\n";
    description += "Замовлення:\n";
    cart.forEach(function(item){
        description += "- " + item.quantity + "шт. [" + item.size + "] " + item.pizza.title + ";\n";
    });
    description += "\nРазом " + price + " UAH.";
    return description;
}

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};