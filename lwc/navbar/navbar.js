import { LightningElement } from 'lwc';
import CNxFiles from '@salesforce/resourceUrl/CNxFiles';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import GoogleFont from '@salesforce/resourceUrl/GoogleFont';
import pubsub from 'c/pubSubUtility';

let cartItems;
let cartBtn;
// let registerBtn;

export default class Navbar extends LightningElement {

    get registerUrl() {
        var urlString = window.location.href;
        var baseURL = urlString.substring(0, urlString.indexOf("/s"));
        return baseURL + '/s/customer-registration';
    }

    get loginUrl() {
        var urlString = window.location.href;
        var baseURL = urlString.substring(0, urlString.indexOf("/s"));
        return baseURL + '/s/login';
    }

    get navBarLogoPath() {
        return CNxFiles + '/CNxFiles/Images/CNxLogo.jpg';
    }

    connectedCallback() {
        console.log('INSIDE Navbar connectedCallback');
        loadScript(this, FontAwesome + '/fontawesome.js');
        loadStyle(this, GoogleFont + '/googleFont.css');
        this.callsubscriber();
    }

    renderedCallback() {
        console.log('INSIDE Navbar renderedCallback');
        cartBtn = this.template.querySelector(".cart-btn");
        cartItems = this.template.querySelector(".cart-items");
        // registerBtn = this.template.querySelector(".registerBtn");

        // When the user scrolls the page, execute myFunction
        window.onscroll = function () { myFunction() };

        // Get the navbar
        var navbar = this.template.querySelector(".navbar");

        // Get the offset position of the navbar
        var sticky = navbar.offsetTop;

        // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
        function myFunction() {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky")
            } else {
                navbar.classList.remove("sticky");
            }
        }
    }

    callsubscriber() {
        pubsub.subscribe('cartItemsUpdated', this.subscriberCallback);
    }

    subscriberCallback = (event) => {
        cartItems.innerText = event;
    }

    hanldeShowCart(event) {
        console.log('eventPublisher data : ');
        this.eventPublisher('showCart')
    }

    eventPublisher(data) {
        console.log('eventPublisher data : ' + data);
        pubsub.publish("showCartButtonClicked", data);
    }

    // hanldeRegister(event){

    // }

}