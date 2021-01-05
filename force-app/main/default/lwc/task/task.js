import { LightningElement, api, track } from "lwc";

export default class Task extends LightningElement {
  /**
   * 担当選択肢
   */
  get status() {
    return [
      { label: "未着手", value: "未着手" },
      { label: "進行中", value: "進行中" },
      { label: "完了", value: "完了" }
    ];
  }

  /**
   * 担当選択肢
   */
  get developers() {
    return [
      { label: "またえ", value: "またえ" },
      { label: "たかはし", value: "たかはし" },
      { label: "わたなべ", value: "わたなべ" }
    ];
  }

  /**
   * タスク
   */
  _task;
  @api
  get task() {
    return this._task;
  }
  set task(value) {
    this._task = JSON.parse(JSON.stringify(value));
  }

  /**
   * タスク日数
   */
  @track taskSpan;

  /**
   * タスク名が変更
   */
  handleChangeTaskName(evt) {
    this._task.Name = evt.target.value;

    this.emitChange();
  }

  /**
   * 開始日が変更
   */
  handleChangeStartDate(evt) {
    this._task.StartDate__c = evt.target.value;

    this.calcTaskSpan();

    this.emitChange();
  }

  /**
   * 終了日が変更
   */
  handleChangeEndDate(evt) {
    this._task.EndDate__c = evt.target.value;

    this.calcTaskSpan();

    this.emitChange();
  }

  /**
   * 担当が変更
   */
  handleChangeDeveloper(evt) {
    this._task.Developer__c = evt.target.value;

    this.emitChange();
  }

  /**
   * ステータスが変更
   */
  handleChangeStatus(evt) {
    this._task.Status__c = evt.target.value;

    this.emitChange();
  }

  /**
   * 所要日数算出
   */
  calcTaskSpan() {
    if (!this._task.StartDate__c || !this._task.EndDate__c) {
      this.taskSpan = 0;
    }

    const startDate = new Date(this._task.StartDate__c);
    const endDate = new Date(this._task.EndDate__c);

    this.taskSpan = (endDate - startDate) / 86400000;
  }

  /**
   * タスク情報の変更をイベント通知
   */
  emitChange() {
    this.dispatchEvent(new CustomEvent("change", { detail: this._task }));
  }
}
