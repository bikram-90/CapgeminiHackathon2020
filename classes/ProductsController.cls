public class ProductsController {
    
    @AuraEnabled(cacheable=true)
    public static List<CNxPrdWrapper> getCNxProducts(){
        
        List<CNxPrdWrapper> cnxPrdWrapObjList = new List<CNxPrdWrapper>();
        List<PriceBookEntry> cnxPrdList = [SELECT Id, Name, UnitPrice, CurrencyIsoCode, 
                                           ProductCode, Product2.Product_Image_Link__c
                                           FROM PriceBookEntry 
                                           WHERE Product2.Family IN ('Games',
                                                                     'Anti-virus App',
                                                                     'Local Map',
                                                                     'Mobile Service')];
        
        for(PriceBookEntry eachItem : cnxPrdList){
            CNxPrdWrapper cnxPrdWrapObj = new CNxPrdWrapper();
            cnxPrdWrapObj.prdPriceBookEntryId = eachItem.Id;
            cnxPrdWrapObj.prdTitle = eachItem.Name;
            cnxPrdWrapObj.prdCode = eachItem.ProductCode;
            cnxPrdWrapObj.prdCurrencyIsoCode = eachItem.CurrencyIsoCode;
            cnxPrdWrapObj.prdPrice = eachItem.UnitPrice;
            cnxPrdWrapObj.prdImage = eachItem.Product2.Product_Image_Link__c;
            
            cnxPrdWrapObjList.add(cnxPrdWrapObj);
            
        }
        
        return cnxPrdWrapObjList;        
    }
    
    public class CNxPrdWrapper{
        @AuraEnabled public String prdPriceBookEntryId;
        @AuraEnabled public String prdTitle;
        @AuraEnabled public String prdCode;
        @AuraEnabled public String prdCurrencyIsoCode;
        @AuraEnabled public Decimal prdPrice;
        @AuraEnabled public String prdImage;        
    }

}