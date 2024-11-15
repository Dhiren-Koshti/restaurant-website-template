let btnDiv = document.querySelector(".menu-tabs");
let foodTemplate = document.querySelector("#foodTemplate");
let fastContainer = document.querySelector(".fast-food");
let thaliContainer = document.querySelector(".thalis");
let presentCard = "fastFood";

function displayCart(){
    let data = JSON.parse(localStorage.getItem("foodLS"));
    let count = document.querySelector("#cart-count");
    let num = data.length;
    if(num){
        count.innerText = num;
        count.style.display = "block";
    }else{
        count.style.display = "none";
    }
    
}

displayCart();

function addLSData(data){
   
    if(!(localStorage.getItem("foodLS"))){
        localStorage.setItem("foodLS",JSON.stringify([data]));
    }else{
        let getData = JSON.parse(localStorage.getItem("foodLS"));
        let check = true;
        getData = getData.map((currEle,index) => {
            if(currEle.id === data.id && currEle.category === data.category){
                currEle.quantity += data.quantity;
                currEle.price += data.price;
                check = false;
            }

            return currEle;
        })

        if(check){
            getData.push(data);
        }
            
        localStorage.setItem("foodLS",JSON.stringify(getData));
        displayCart();
    }
}

function addToCart(evt,id){
    let card = document.getElementById(id); 
    let category = card.getAttribute("data-category");
    let quantity = card.querySelector(".quantity-value").innerText;
    quantity = parseInt(quantity);
    let price = card.querySelector(".price").innerText*quantity;
    let lsData = {id,category,quantity,price};
    addLSData(lsData);
}

function increment(evt,id){
    let card = document.getElementById(id); 
    let quantity = card.querySelector(".quantity-value");
    quantity.innerText++;
}

function decrement(evt,id){
    let card = document.getElementById(id); 
    let quantity = card.querySelector(".quantity-value");
    if(quantity.innerText != 1){
        quantity.innerText--;
    }
}

async function getfoodCard(api,addContainer,removeContainer){
    let response = await fetch(api);
    let data = await response.json();

    for(let i=0; i<data.length; i++){
        let clone = foodTemplate.content.cloneNode(true);
        let {id,name,category,price,description,image} = data[i];
        let box = clone.querySelector(".menu-item");
        box.setAttribute("id",id);
        box.setAttribute("data-category",category);
        clone.querySelector(".name").innerText = name;
        clone.querySelector(".description").innerText = description;
        clone.querySelector(".price").innerText = price;
        clone.querySelector("img").setAttribute("src",image);
        clone.querySelector(".quantity-increment").addEventListener("click",(evt) => {
            increment(evt,id);
        });
        clone.querySelector(".quantity-decrement").addEventListener("click",(evt) => {
            decrement(evt,id);
        });
        clone.querySelector(".add-to-cart").addEventListener("click",(evt) => {
            addToCart(evt,id);
        });
        addContainer.appendChild(clone);
        removeContainer.innerHTML = "";
    }
}

getfoodCard("../json/fast_food.json",fastContainer,thaliContainer);

btnDiv.addEventListener("click",(evt) => {

    if(evt.target.id === "fast-food" && presentCard != "fastFood"){
        getfoodCard("../json/fast_food.json",fastContainer,thaliContainer);
        presentCard = "fastFood";
    }
    
    if(evt.target.id === "thalis" && presentCard != "Thali"){
        getfoodCard("../json/thali.json",thaliContainer,fastContainer);
        presentCard = "Thali"
    }
})

