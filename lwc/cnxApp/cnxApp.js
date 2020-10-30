import { LightningElement } from 'lwc';
import CNxFiles from '@salesforce/resourceUrl/CNxFiles';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import GoogleFont from '@salesforce/resourceUrl/GoogleFont';

export default class CnxApp extends LightningElement {

    get heroImagePath() {
        return CNxFiles + '/CNxFiles/Images/hero-bcg-pubg.jpg';
    }

    //Try to set this in CSS 
    get heroStyle() {
        return 'min-height: calc(100vh - 60px);'
            + 'background: url(' + this.heroImagePath + ') center/cover no-repeat;'
            + 'display: flex;'
            + 'align-items: center;'
            + 'justify-content: center;';
    }

    get shopNowUrl() {
        var urlString = window.location.href;
        var baseURL = urlString.substring(0, urlString.indexOf("/s"));
        return baseURL + '/s/products';
    }

    connectedCallback(){
        console.log('INSIDE CnxApp connectedCallback');
        loadScript(this, FontAwesome + '/fontawesome.js');
        loadStyle(this, GoogleFont + '/googleFont.css');
    }

    renderedCallback(){
        console.log('INSIDE CnxApp renderedCallback');
        console.log("heroImagePath : " + this.heroImagePath);
    }
}