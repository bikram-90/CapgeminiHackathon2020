import { LightningElement } from 'lwc';
import CNxFiles from '@salesforce/resourceUrl/CNxFiles';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import GoogleFont from '@salesforce/resourceUrl/GoogleFont';
//import propertyName from '@salesforce/community/property';

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
    }
    renderedCallback() {
        console.log('INSIDE Navbar renderedCallback');
        console.log("navBarLogoPath : " + this.navBarLogoPath);
    }
}