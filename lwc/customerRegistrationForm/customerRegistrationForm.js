import { LightningElement, track, wire, api } from 'lwc';
import CNxFiles from '@salesforce/resourceUrl/CNxFiles';

export default class CustomerRegistrationForm extends LightningElement {

    @track contactFieldsJSON = {};
    @track showSpinner = false;
    @track errorMessage = false;

    get heroImagePath() {
        return CNxFiles + '/CNxFiles/Images/rocketLeaguePotrait.jpg';
    }

    connectedCallback() {
        console.log('INSIDE CustomerRegistrationForm connectedCallback');
    }

    renderedCallback() {
        console.log('INSIDE CustomerRegistrationForm renderedCallback');
    }

    handleLoad(event) {
        console.log('INSIDE CustomerRegistrationForm handleLoad');
    }

    handleFieldChange(event) {
        console.log('INSIDE CustomerRegistrationForm handleFieldChange');
    }

    handleRegister(event) {
        console.log('INSIDE CustomerRegistrationForm handleRegister');
        this.showSpinner = true;
    }

    handleSubmit(event) {
        console.log('INSIDE CustomerRegistrationForm handleSubmit');
        event.preventDefault();       // stop the form from submitting
        this.showSpinner = true;
        const fields = event.detail.fields;
        console.log('BEFORE fields : ' + JSON.stringify(fields));
        fields.LastName = fields.Lastname__c; //Assign statndard LastName Field as it is mandatory field to create contact       
        // fields.AccountId = '0012x00000GSPd0AAH'; //TODO change the account assignment dynamic, DO-NOT HARD CODE //Hanlde in Trigger
        fields.isCNxUser__c = true; //Contact is registered from CNx portal
        console.log('AFTER fields : ' + JSON.stringify(fields));
        this.template.querySelector('lightning-record-edit-form').submit(fields); // Submits the form
    }

    handleSuccess(event) {        
        console.log('INSIDE CustomerRegistrationForm handleSuccess');
        this.showSpinner = false;
        const payload = event.detail;
        console.log('payload onsuccess : ', JSON.stringify(payload));
        const createdRecord = event.detail.id;
        console.log('recordId onsuccess : ', createdRecord);

    }

    handleError(event) {        
        console.log('INSIDE CustomerRegistrationForm handleError' + JSON.stringify(event.detail));
        this.showSpinner = false;
        console.log(event);
        this.errorMessage = event.detail.message;
    }
}