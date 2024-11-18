let productCartTemplate = document.querySelector("#productCartTemplate");
let productCartContainer = document.querySelector("#productCartContainer");

function bill(){
    let data = JSON.parse(localStorage.getItem("foodLS"));
    let subTotal = 0;
    
    for(let currEle of data){
        subTotal += currEle.price;
    }

    document.querySelector(".productSubTotal").innerText = subTotal;
    document.querySelector(".productFinalTotal").innerText = subTotal + 50;

    if(subTotal == 0){
        document.querySelector(".productFinalTotal").innerText = 0;
    }
}

bill();

function displayCart(){
    let data = JSON.parse(localStorage.getItem("foodLS"));
    let count = document.querySelector("#cart-count");

    if(data){
        let num = data.length;
        if(num){
            count.innerText = num;
            count.style.display = "block";
        }else{
            count.style.display = "none";
        }
    }
}

displayCart();

function addLSData(data){
   
    let getData = JSON.parse(localStorage.getItem("foodLS"));
    getData = getData.map((currEle,index) => {
        if(currEle.id === data.id && currEle.category === data.category){
            currEle.quantity = data.quantity;
            currEle.price = data.newPrice;
        }

        return currEle;
    })

    localStorage.setItem("foodLS",JSON.stringify(getData));
    bill();
}

function addToCart(evt,id,category,orignalPrice,operator){
    let card = document.getElementById(`${category}${id}`); 
    let quantity = card.querySelector(".productQuantity").innerText;
    quantity = parseInt(quantity);
    let newPrice;

    if(operator == "+"){
        newPrice = parseInt(card.querySelector(".productPrice").innerText) + orignalPrice;
    }else{
        newPrice = parseInt(card.querySelector(".productPrice").innerText) - orignalPrice;
    }

    card.querySelector(".productPrice").innerText = newPrice;
    let lsData = {id,category,quantity,newPrice};
    addLSData(lsData);
}

function increment(evt,id,category){
    let card = document.getElementById(`${category}${id}`); 
    let quantity = card.querySelector(".productQuantity");
    quantity.innerText++;
}

function decrement(evt,id,category,price,operator){
    let card = document.getElementById(`${category}${id}`); 
    let quantity = card.querySelector(".productQuantity");
    console.log(quantity.innerText);
    if(quantity.innerText != 1){
        quantity.innerText--;
        addToCart(evt,id,category,price,operator);
    }
}

function removeCart(evt,id,category){
    let card = document.getElementById(`${category}${id}`); 
    let getData = JSON.parse(localStorage.getItem("foodLS"));
    
    let newData = getData.filter((currEle) => {
       if(currEle.id != id || currEle.category != category){
            return currEle;
        };   
    })


    localStorage.setItem("foodLS",JSON.stringify(newData));
    card.remove();
    displayCart();
    bill();
}

async function addCard(api,arr){
    let response = await fetch(api);
    let data = await response.json();

    arr.forEach((currEle) => {
        let clone = productCartTemplate.content.cloneNode(true);
        let {id,category,quantity,price} = currEle;

        let isPresent = data.find((currEle) => {
            if(currEle.id === id){
                return currEle;
            }
        })

        let allOrder = {
            id:id,
            category:category,
            image:isPresent["image"],
            name:isPresent["name"],
            quantity:quantity,
            price:price,
        }

        clone.querySelector("#cardValue").setAttribute("id",`${category}${id}`);
        clone.querySelector(".category").innerText = allOrder.category;
        clone.querySelector(".productImage").setAttribute("src",allOrder.image);
        clone.querySelector(".productName").innerText = allOrder.name;
        clone.querySelector(".productPrice").innerText = allOrder.price;
        clone.querySelector(".productQuantity").innerText = allOrder.quantity;
        clone.querySelector(".cartIncrement").addEventListener("click",(evt) => {
            increment(evt,id,category);
            addToCart(evt,id,category,isPresent["price"],"+");
        });
        clone.querySelector(".cartDecrement").addEventListener("click",(evt) => {
            decrement(evt,id,category,isPresent["price"],"-");
        });
        clone.querySelector(".remove-to-cart-button").addEventListener("click",(evt) => {
            removeCart(evt,id,category);
        });

        productCartContainer.append(clone);

    });
}

let lsArr = JSON.parse(localStorage.getItem("foodLS"));
let fastArr = [];
let thaliArr = [];

for(let currEle of lsArr){
    
    if(currEle.category == "Fast Food"){
        fastArr.push(currEle);
    }else{
        thaliArr.push(currEle);
    }
}

if(fastArr.length) addCard("../json/fast_food.json",fastArr);
if(thaliArr.length) addCard("../json/thali.json",thaliArr);