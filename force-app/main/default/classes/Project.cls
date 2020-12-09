public with sharing class Project {
  /**
   * プロジェクトを登録する
   */
  @AuraEnabled
  public static void registProject(String projectJson, String tasksJson) {
    try {
      Map<String, Object> mapProject = (Map<String, Object>) JSON.deserializeUntyped(
        projectJson
      );

      Project__c project = new Project__c();
      project.Id = (Id) mapProject.get('Id');
      project.Name = (String) mapProject.get('Name');
      project.ProjectNumber__c = (String) mapProject.get('ProjectNumber__c');
      project.StartDate__c = Date.valueOf(
        (String) mapProject.get('StartDate__c')
      );
      project.EndDate__c = Date.valueOf((String) mapProject.get('EndDate__c'));
      project.Status__c = (String) mapProject.get('Status__c');

      upsert project;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
