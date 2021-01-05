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
      if (mapProject.get('StartDate__c') != null) {
        project.StartDate__c = Date.valueOf(
          (String) mapProject.get('StartDate__c')
        );
      } else {
        project.StartDate__c = null;
      }
      if (mapProject.get('EndDate__c') != null) {
        project.EndDate__c = Date.valueOf(
          (String) mapProject.get('EndDate__c')
        );
      } else {
        project.EndDate__c = null;
      }
      project.Status__c = (String) mapProject.get('Status__c');

      List<Task__c> lstTask = new List<Task__c>();
      List<Object> lstTaskItem = (List<Object>) JSON.deserializeUntyped(
        tasksJson
      );
      for (Object taskItem : lstTaskItem) {
        Map<String, Object> mapTaskItem = (Map<String, Object>) taskItem;
        Task__c task = new Task__c();
        if (mapTaskItem.get('Id') != null) {
          task.Id = (Id) mapTaskItem.get('Id');
        } else {
          task.Project__c = project.Id;
        }
        task.Name = (String) mapTaskItem.get('Name');
        if (mapTaskItem.get('StartDate__c') != null) {
          task.StartDate__c = Date.valueOf(
            (String) mapTaskItem.get('StartDate__c')
          );
        }
        if (mapTaskItem.get('EndDate__c') != null) {
          task.EndDate__c = Date.valueOf(
            (String) mapTaskItem.get('EndDate__c')
          );
        }
        task.Status__c = (String) mapTaskItem.get('Status__c');
        task.Developer__c = (String) mapTaskItem.get('Developer__c');
        lstTask.add(task);
      }

      upsert project;
      upsert lstTask;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  /**
   * プロジェクトのタスクを取得する
   */
  @AuraEnabled
  public static List<Task__c> getTasks(String projectId) {
    try {
      List<Task__c> lstTask = [
        SELECT Id, Name, Status__c, StartDate__c, EndDate__c, Developer__c
        FROM Task__c
        WHERE Project__c = :projectId
      ];

      return lstTask;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
