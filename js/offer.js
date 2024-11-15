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