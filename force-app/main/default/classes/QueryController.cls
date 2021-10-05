public with sharing class QueryController {

    @AuraEnabled(cacheable=true)
    public static Map<String,String> getObjList(){
        List<Schema.SObjectType> objList = Schema.getGlobalDescribe().Values();     
        Map<String,String> objNames = new Map<String,String>();
        objNames.put('Select', 'Select');
        for(Schema.sObjectType obj : objList)
        {
            objNames.put(obj.getDescribe().getName(), obj.getDescribe().getLabel());
        }
        
        return objNames;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String,String> getObjectFields(String obj){
        SObjectType contactType = Schema.getGlobalDescribe().get(obj);
        Map<String,Schema.SObjectField> mfields = contactType.getDescribe().fields.getMap();

        Map<String,String> sObjectDetailsList = new Map<String,String>();
        for(String s : mfields.keySet()){
            sObjectDetailsList.put(String.valueOf(mfields.get(s)), mfields.get(s).getDescribe().getLabel());
        }
        return sObjectDetailsList;
    }

    @AuraEnabled
    public static List<sObject> getResults(String query){
        if(!query.contains(' LIMIT ')){
            query += ' LIMIT 50000';
        }
        try {
            return Database.query(query);
        } catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}
