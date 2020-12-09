import { LightningElement, api, wire, track } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import registProject from "@salesforce/apex/Project.registProject";

const PROJECT_NAME = "Project__c.Name";
const PROJECT_STARTDATE = "Project__c.StartDate__c";
const PROJECT_ENDDATE = "Project__c.EndDate__c";
const PROJECT_STATUS = "Project__c.Status__c";
const PROJECT_NUMBER = "Project__c.ProjectNumber__c";
const PROJECT_FLELDS = [
  PROJECT_NAME,
  PROJECT_STARTDATE,
  PROJECT_ENDDATE,
  PROJECT_STATUS,
  PROJECT_NUMBER
];

export default class Project extends LightningElement {
  /**
   * レコードID
   */
  @api recordId;

  /**
   * プロジェクトステータス選択肢
   */
  get projectStatus() {
    return [
      { label: "準備中", value: "準備中" },
      { label: "進行中", value: "進行中" },
      { label: "完了", value: "完了" },
      { label: "中止", value: "中止" }
    ];
  }

  /**
   * プロジェクト名
   */
  projectName;

  /**
   * プロジェクト番号
   */
  projectNumber;

  /**
   * ステータス
   */
  status;

  /**
   * 開始日
   */
  startDate;

  /**
   * 終了日
   */
  endDate;

  /**
   * タスク
   */
  @track tasks = [];

  connectedCallback() {
    this.tasks.push({
      Key: 1,
      Id: "",
      Name: "タスクA",
      Status__c: "未着手",
      StartDate__c: "2020-11-02",
      EndDate__c: "",
      Developer__c: "またえ"
    });

    this.recordId = "a001m000001qlsdAAA";
  }

  /**
   * プロジェクト情報を取得する
   */
  @wire(getRecord, { recordId: "$recordId", fields: PROJECT_FLELDS })
  loadProject({ error, data }) {
    if (data) {
      this.projectName = getFieldValue(data, PROJECT_NAME);
      this.projectNumber = getFieldValue(data, PROJECT_NUMBER);
      this.status = getFieldValue(data, PROJECT_STATUS);
      this.startDate = getFieldValue(data, PROJECT_STARTDATE);
      this.endDate = getFieldValue(data, PROJECT_ENDDATE);
    }
  }

  /**
   * プロジェクト情報を保存する
   */
  async handleSave() {
    const project = {
      Id: this.recordId,
      Name: this.projectName,
      ProjectNumber__c: this.projectNumber,
      StartDate__c: this.startDate,
      EndDate__c: this.endDate,
      Status__c: this.status
    };

    await registProject({
      projectJson: JSON.stringify(project),
      tasksJson: JSON.stringify(this.tasks)
    });
  }

  /**
   * タスクを追加する
   */
  handleAdd() {
    let key = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      key = Math.max(key, this.tasks[i].Key);
    }
    key++;

    this.tasks.push({
      Key: key,
      Id: undefined,
      Name: undefined,
      Status__c: "未着手",
      StartDate__c: undefined,
      EndDate__c: undefined,
      Developer__c: undefined
    });
  }

  /**
   * プロジェクト名の変更
   */
  handleChangeName(evt) {
    this.projectName = evt.target.value;
  }

  /**
   * プロジェクト番号の変更
   */
  handleChangeNumber(evt) {
    this.projectNumber = evt.target.value;
  }

  /**
   * 開始日の変更
   */
  handleChangeStartDate(evt) {
    this.startDate = evt.target.value;
  }

  /**
   * 終了日の変更
   */
  handleChangeEndDate(evt) {
    this.endDate = evt.target.value;
  }

  /**
   * ステータスの変更
   */
  handleChangeStatus(evt) {
    this.Status = evt.target.value;
  }
}
