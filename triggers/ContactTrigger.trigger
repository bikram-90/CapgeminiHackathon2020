trigger ContactTrigger on Contact (before insert, after insert) {
    
    ContactTriggerHandler conTrigHandlerObj = new ContactTriggerHandler();
    
    if (trigger.isBefore) {
        if (trigger.isInsert) {
            conTrigHandlerObj.doBeforeInsert(Trigger.new);
        }
    }
    
    if (trigger.isAfter) {
        if (trigger.isInsert) {
            conTrigHandlerObj.doAfterInsert(Trigger.new);
        }
    }
    
}