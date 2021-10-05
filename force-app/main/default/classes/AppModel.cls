public class AppModel {
    @AuraEnabled
    public String label {get;set;}
    @AuraEnabled
    public String name {get;set;}

    public AppModel(String name, String label) {
        this.name = name;
        this.label = label;
    }
}
