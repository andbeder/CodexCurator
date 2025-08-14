public with sharing class CodexCuratorController {
  public class FieldInfo {
    @AuraEnabled
    public String apiName;
    @AuraEnabled
    public String label;
  }

  @AuraEnabled(cacheable=true)
  public static List<FieldInfo> getFieldOptions() {
    Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe()
      .get('Employee_Survey__c')
      .getDescribe()
      .fields.getMap();
    List<FieldInfo> options = new List<FieldInfo>();
    for (String fieldName : fieldMap.keySet()) {
      if (fieldName == 'Name' || fieldName == 'Id') {
        continue;
      }
      Schema.DescribeFieldResult d = fieldMap.get(fieldName).getDescribe();
      FieldInfo info = new FieldInfo();
      info.apiName = fieldName;
      info.label = d.getLabel();
      options.add(info);
    }
    return options;
  }

  @AuraEnabled(cacheable=true)
  public static List<Map<String, Object>> getRecords(List<String> fields) {
    Set<String> fieldSet = new Set<String>();
    if (fields != null) {
      fieldSet.addAll(fields);
    }
    String query = 'SELECT Id, Name';
    for (String f : fieldSet) {
      query += ', ' + f;
    }
    query += ' FROM Employee_Survey__c';
    List<SObject> records = Database.query(query);
    List<Map<String, Object>> results = new List<Map<String, Object>>();
    for (SObject s : records) {
      Map<String, Object> row = s.getPopulatedFieldsAsMap();
      if (!row.containsKey('Id')) {
        row.put('Id', s.Id);
      }
      results.add(row);
    }
    return results;
  }
}
