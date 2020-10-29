import { LightningElement } from 'lwc';
import CNxFiles from '@salesforce/resourceUrl/CNxFiles';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import GoogleFont from '@salesforce/resourceUrl/GoogleFont';
import pubsub from 'c/pubSubUtility';

let cartItems;
let cartBtn;

export default class Navbar extends LightningElement {

    get registerUrl() {
        var urlString = window.location.href;
        var baseURL = urlString.substring(0, urlString.indexOf("/s"));
        return baseURL + '/s/customer-registration';
    }

    get navBarLogoPath() {
        return CNxFiles + '/CNxFiles/Images/navbarlogo.svg';
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
    }

    callsubscriber(){
        pubsub.subscribe('cartItemsUpdated', this.subscriberCallback);
    }

    subscriberCallback=(event)=>{
        cartItems.innerText = event;
    }

    hanldeShowCart(event){
        console.log('eventPublisher data : ');
        this.eventPublisher('showCart')
    }

    eventPublisher(data){
        console.log('eventPublisher data : ' + data);
        pubsub.publish("showCartButtonClicked", data);
    }
}