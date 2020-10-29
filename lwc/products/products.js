import { LightningElement, track, wire } from 'lwc';
import CNxFiles from '@salesforce/resourceUrl/CNxFiles';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import GoogleFont from '@salesforce/resourceUrl/GoogleFont';
import getCNxProducts from '@salesforce/apex/ProductsController.getCNxProducts';
import pubsub from 'c/pubSubUtility';

//Variables
let cartBtn;
let closeCartBtn;
let clearCartBtn;
let buyNowBtn;
let cartDOM;
let cartOverlay;
let cartItems;
let cartTotal;
let cartContent;
let productsDOM;
//cart
let cart = [];
//buttons
let buttonsDOM = [];
let chessImagePath;

export default class Products extends LightningElement {

    error;
    @track cnxPrdJSON;

    // get chessImagePath() {
    //     return CNxFiles + '/CNxFiles/Images/chessKing.jpg';
    // }

    connectedCallback() {
        console.log('INSIDE Products connectedCallback');
        loadScript(this, FontAwesome + '/fontawesome.js');
        loadStyle(this, GoogleFont + '/googleFont.css');
        this.callsubscriber();
        chessImagePath = CNxFiles + '/CNxFiles/Images/chessKing.jpg';

    }

    renderedCallback() {
        console.log('INSIDE Products renderedCallback');

        // cartBtn = this.template.querySelector(".cart-btn");
        closeCartBtn = this.template.querySelector(".close-cart");
        clearCartBtn = this.template.querySelector(".clear-cart");
        buyNowBtn = this.template.querySelector(".buy-now");
        cartDOM = this.template.querySelector(".cart");
        cartOverlay = this.template.querySelector(".cart-overlay");
        // cartItems = this.template.querySelector(".cart-items");
        cartTotal = this.template.querySelector(".cart-total");
        cartContent = this.template.querySelector(".cart-content");
        productsDOM = this.template.querySelector(".products-center");

        try {
            const ui = new UI();
            const prds = new CNxProducts();

            //setup App
            ui.setupApp();

            //Get all products
            prds.getProducts().then(products => {
                console.log('After getProducts() Products : ' + JSON.stringify(products));
                ui.displayProducts(products);
                //this.productsArray = products;
                Storage.saveProducts(products);
            }).then(() => {
                const buttons = [...this.template.querySelectorAll(".bag-btn")];
                console.log('All buttons :- ' + buttons);
                ui.getBagButtons(buttons);
                ui.cartLogic();
            });

        } catch (error) {
            console.log(error);

        }

    }

    callsubscriber(){
        pubsub.subscribe('showCartButtonClicked', this.subscriberCallback);
    }

    subscriberCallback=(event)=>{
        console.log('showCart subscriberCallback : ' + event);
        if(event === 'showCart'){
            const ui = new UI();
            ui.showCart();
        }
    }

}

//getting the Products
export class CNxProducts {

    async getProducts() {
        try {
            let result = await getCNxProducts();
            console.log('getProducts result : ' + JSON.stringify(result));
            let prds = JSON.parse(JSON.stringify(result));
            /*prds = prds.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                //const image = item.fields.image.fields.file.url;
                const image = ComfyHouseSetupFiles + '/setup-files-js-comfy-house-master/images/product-' + item.sys.id + '.jpeg';
                return { title, price, id, image };
            });*/

            for (let i = 0; i < prds.length; i++) {
                prds[i].prdImage = chessImagePath;
                prds[i].id = prds[i].prdPriceBookEntryId;
            }
            console.log('getProducts prds : ' + JSON.stringify(prds));
            return prds;
        } catch (error) {
            console.log(error);
        }
    }

    /*async getProducts() {
        try {
            let result = await fetch(productsJSONPath);
            let data = await result.json();
            let prds = data.items;
            prds = prds.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                //const image = item.fields.image.fields.file.url;
                const image = ComfyHouseSetupFiles + '/setup-files-js-comfy-house-master/images/product-' + item.sys.id + '.jpeg';
                return { title, price, id, image };
            });
            return prds;
        } catch (error) {
            console.log(error);
        }
    }*/

}

//display Products
export class UI {

    displayProducts(products) {
        try {
            console.log('INSIDE displayProducts : ' + JSON.stringify(products));
            let result = '';
            products.forEach(product => {
                result += `
                    <!-- Single Product -->
                    <article class="product">
                        <div class="img-container">
                        <img src=${chessImagePath} alt="product"
                            class="product-img">
                            <!-- ${product.prdImage} -->
                            <button class="bag-btn" data-id=${product.prdPriceBookEntryId}>
                                <i class="fas fa-shopping-cart"></i>
                                add to bag
                            </button>
                        </div>
                        <h3>${product.prdTitle}</h3>
                        <h4>$${product.prdPrice}</h4>
                    </article>
                <!-- Single Product -->
            `;
            });
            productsDOM.innerHTML = result;
            console.log('PRODUCTS LOADED IN DOM');
        } catch (error) {
            console.log(error);
        }
    }

    getBagButtons(buttons) {
        console.log('INSIDE UI getBagButtons');
        try {
            //const buttons = [...this.template.querySelectorAll(".bag-btn")]; //turns this into an array

            buttonsDOM = buttons;

            buttons.forEach(button => {
                let id = button.dataset.id;
                console.log('getBagButtons button id : ' + id);
                let inCart = cart.find(item => item.id === id);
                console.log('getBagButtons inCart : ' + JSON.stringify(inCart));

                if (inCart) {
                    button.innerText = "In Cart";
                    button.disabled = true;

                }
                button.addEventListener('click', (event) => {

                    console.log('getBagButtons event : ' + event);
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;

                    //get product from products
                    let cartItem = { ...Storage.getProduct(id), amount: 1 };
                    console.log('getBagButtons cartItem : ' + JSON.stringify(cartItem));

                    //add prd to the cart
                    cart = [...cart, cartItem];
                    console.log('getBagButtons cart : ' + JSON.stringify(cart));

                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart values
                    if (cart.length > 0) {
                        this.setCartValues(cart);
                    }
                    //display cart item
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart();
                })
            });
        } catch (error) {
            console.log(error);
        }

    }

    setCartValues(cart) {
        try {
            let tempTotal = 0;
            let itemsTotal = 0;
            cart.map(item => {
                tempTotal += item.prdPrice * item.amount;
                itemsTotal += item.amount;
            });
            if (cartTotal) {
                cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
            }

            // if (cartItems) {
            //     cartItems.innerText = itemsTotal;//handled by pubsub utility as navbar is a separate cmp
            // }

            if(itemsTotal >= 0){
                this.eventPublisher(itemsTotal);//call publish function of pubsub utility
            }

            console.log('setCartValues : ' + cartTotal, cartItems);
        } catch (error) {
            console.log(error);
        }

    }

    addCartItem(item) {
        console.log('addCartItem item : ' + JSON.stringify(item));
        try {
            //const div = this.template.createElement('div');
            //div.classList.add('cart-item');
            //div.innerHTML = `
            let result = '';
            result = `
            <div class="cart-item">
                <img src=${item.prdImage} alt="product">
                <div>
                    <h4>${item.prdTitle}</h4>
                    <h5>$${item.prdPrice}</h5>
                    <span class="remove-item" data-id=${item.prdPriceBookEntryId}>remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id=${item.prdPriceBookEntryId}></i>
                        <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${item.prdPriceBookEntryId}></i>
                </div>   
                </div>
        `;
            //cartContent.appendChild(result);
            const doc = new DOMParser().parseFromString(result, "text/html");
            cartContent.appendChild(doc.body.firstChild);
            console.log(cartContent);
        } catch (error) {
            console.log(error);
        }
    }

    showCart() {        
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    setupApp() {
        try {
            console.log('INSIDE UI SETUPAPP');
            cart = Storage.getCart();
            console.log('INSIDE UI SETUPAPP cart.length : ' + cart.length);
            if (cart.length > 0) {
                this.setCartValues(cart);
                this.populateCart(cart);
            }
            cartBtn.addEventListener('click', this.showCart);
            //closeCartBtn.addEventListener('click', this.hideCart);//moved to showCart()

        } catch (error) {
            console.log(error);
        }
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));

    }

    hideCart() {
        console.log('hideCart : ' + cartOverlay.classList + ' : ' + cartDOM.classList);
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    cartLogic() {
        try {
            //Clear Cart Button
            clearCartBtn.addEventListener("click", () => {
                this.clearCart();
            });
            //Buy Now Button
            buyNowBtn.addEventListener("click", () => {
                this.buyNow();
            });
            //Cart Functionality
            cartContent.addEventListener("click", event => {
                console.log(event.target);
                if (event.target.classList.contains('remove-item')) {
                    let removeItem = event.target;
                    let id = removeItem.dataset.id;
                    cartContent.removeChild(removeItem.parentElement.parentElement);
                    this.removeItem(id);
                } else if (event.target.classList.contains('fa-chevron-up')) {
                    let increaseAmount = event.target;
                    let id = increaseAmount.dataset.id;
                    let tempItem = cart.find(item => item.id === id);
                    tempItem.amount++;
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    increaseAmount.nextElementSibling.innerText = tempItem.amount;
                } else if (event.target.classList.contains('fa-chevron-down')) {
                    let decreaseAmount = event.target;
                    let id = decreaseAmount.dataset.id;
                    let tempItem = cart.find(item => item.id === id);
                    tempItem.amount--;
                    if (tempItem.amount > 0) {
                        Storage.saveCart(cart);
                        this.setCartValues(cart);
                        decreaseAmount.previousElementSibling.innerText = tempItem.amount;
                    } else {
                        cartContent.removeChild(decreaseAmount.parentElement.parentElement);
                        this.removeItem(id);
                    }

                }

            });
        } catch (error) {

        }
    }

    clearCart() {
        console.log('INSIDE CLEAR CART');
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }

        this.hideCart();
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to bag`;
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }

    buyNow(){
        console.log('INSIDE buyNow');
    }

    eventPublisher(data){
        pubsub.publish("cartItemsUpdated", data);
    }

}

//local storage
export class Storage {

    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }

}