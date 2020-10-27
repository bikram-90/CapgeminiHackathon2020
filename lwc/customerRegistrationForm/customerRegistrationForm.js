import { LightningElement, track, wire, api } from 'lwc';
import CNxFiles from '@salesforce/resourceUrl/CNxFiles';

export default class CustomerRegistrationForm extends LightningElement {

    @track contactFieldsJSON = {};
    @track showSpinner = false;

    get heroImagePath() {
        return CNxFiles + '/CNxFiles/Images/rocketLeaguePotrait.jpg';
    }

    connectedCallback(){
        console.log('INSIDE CustomerRegistrationForm connectedCallback');
    }

    renderedCallback(){
        console.log('INSIDE CustomerRegistrationForm renderedCallback');
    }

    handleLoad(event){
        console.log('INSIDE CustomerRegistrationForm handleLoad');
    }

    handleFieldChange(event){
        console.log('INSIDE CustomerRegistrationForm handleFieldChange');
    }

    handleRegister(event){
        console.log('INSIDE CustomerRegistrationForm handleRegister');
    }

    handleSubmit(event){
        console.log('INSIDE CustomerRegistrationForm handleSubmit');
    }

    handleSuccess(event){
        console.log('INSIDE CustomerRegistrationForm handleSuccess');
    }

    handleError(event){
        console.log('INSIDE CustomerRegistrationForm handleError');
    }    
}