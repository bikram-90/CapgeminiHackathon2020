public class ContactTriggerHandler {
    
    private static Account cnxAccount = [SELECT Id, name FROM Account WHERE Name = 'CNx Account' Limit 1];
    
    public void doBeforeInsert(List<Contact> newContactList) {        
        System.debug('INSIDE ContactTriggerHandler doBeforeInsert : ' + newContactList);
        for(Contact con : newContactList){
            if(con.isCNxUser__c){//Checking if Contact is registered from CNx portal
                con.AccountId = cnxAccount.Id;
            }
        }        
    }
    
    public void doAfterInsert(List<Contact> newContactList) {        
        System.debug('INSIDE ContactTriggerHandler doAfterInsert : ' + newContactList);
        CreatePortalUser.userCreation(JSON.serialize(newContactList));
    }
    
}