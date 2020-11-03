public class CreatePortalUser {
    
    @future //Declared as future as setup(Contact)/non-setup(User) objects cannot be created in a single transaction
    public static void userCreation(String contactJsonPayload){
        System.debug('contactJsonPayload : ' + contactJsonPayload);
        try{
            //Get Community Profile Id
            Profile communityProfile = [SELECT Id FROM Profile WHERE Name='Customer Community Login User' Limit 1];
            //Deserialize contactJsonPayload
            List<Contact> contactList = (List<Contact>)JSON.deserialize(contactJsonPayload, List<Contact>.class);
            List<User> userList = new List<User>();
            //Loop Over Conatct List and create Users
            for(Contact con : contactList){
                
                User usr = new User();
                usr.UserName = con.Username__c;
                usr.FirstName = con.Firstname__c;
                usr.LastName = con.Lastname__c;
                usr.Alias = con.Username__c.substring(0, 4) + string.valueOf(math.random()).substring(0,4);
                usr.email = con.Email;
                usr.ContactId = con.Id;
                usr.ProfileId = communityProfile.Id;
                usr.EmailEncodingKey = 'UTF-8';
                usr.CommunityNickname = con.Username__c.substring(0, 4) + string.valueOf(math.random()).substring(0,6);
                usr.TimeZoneSidKey = 'America/Los_Angeles';
                usr.LocaleSidKey = 'en_US';
                usr.LanguageLocaleKey = 'en_US';
                
                userList.add(usr);
            }
            
            Database.SaveResult[] userSaveResultList = Database.insert(userList, FALSE);
            
            for(Database.SaveResult sr : userSaveResultList) {
                if (!sr.isSuccess()) {
                    system.debug('Error creating User : ' + sr.getErrors());
                }
            }
            
        }catch(Exception ex){
            System.debug('Exception from CreatePortalUser.userCreation : ' + ex.getMessage());
            System.debug('Stack Trace : ' + ex.getStackTraceString());
        }        
    }
    
}